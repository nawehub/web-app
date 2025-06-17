"use client"

import { useEffect, useState, useCallback } from "react"
import { db } from "./in-memory-db"
import type {
  User,
  ForumPost,
  ForumReply,
  Conversation,
  Message,
  TypingIndicator,
  OnlineStatus,
  Notification,
  DatabaseEvent,
} from "./types"
import {undefined} from "zod";

// Real-time hooks for React components
export function useRealTimeUpdates() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const handleEvent = (event: DatabaseEvent) => {
      setLastUpdate(new Date())
    }

    db.on("all", handleEvent)

    return () => {
      db.off("all", handleEvent)
    }
  }, [])

  return lastUpdate
}

export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineStatus[]>([])

  const updateOnlineUsers = useCallback(() => {
    setOnlineUsers(db.getOnlineUsers())
  }, [])

  useEffect(() => {
    updateOnlineUsers()

    const handleUserOnline = () => updateOnlineUsers()
    const handleUserOffline = () => updateOnlineUsers()

    db.on("user_online", handleUserOnline)
    db.on("user_offline", handleUserOffline)

    return () => {
      db.off("user_online", handleUserOnline)
      db.off("user_offline", handleUserOffline)
    }
  }, [updateOnlineUsers])

  return onlineUsers
}

export function useTypingIndicators(conversationId?: string, postId?: string) {
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])

  const updateTypingUsers = useCallback(() => {
    setTypingUsers(db.getTypingUsers(conversationId, postId))
  }, [conversationId, postId])

  useEffect(() => {
    updateTypingUsers()

    const handleTypingStart = () => updateTypingUsers()
    const handleTypingStop = () => updateTypingUsers()

    db.on("typing_start", handleTypingStart)
    db.on("typing_stop", handleTypingStop)

    return () => {
      db.off("typing_start", handleTypingStart)
      db.off("typing_stop", handleTypingStop)
    }
  }, [updateTypingUsers])

  return typingUsers
}

export function useForumPost(postId: string) {
  const [post, setPost] = useState<ForumPost | undefined>()
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [loading, setLoading] = useState(true)

  const updatePost = useCallback(() => {
    const postData = db.getPost(postId)
    setPost(postData)

    if (postData) {
      const repliesData = db.getRepliesByPost(postId)
      setReplies(repliesData)
    }

    setLoading(false)
  }, [postId])

  useEffect(() => {
    updatePost()

    const handleReplyAdded = (event: DatabaseEvent) => {
      if (event.data.postId === postId) {
        updatePost()
      }
    }

    const handlePostLiked = (event: DatabaseEvent) => {
      if (event.data.postId === postId) {
        updatePost()
      }
    }

    const handleReplyLiked = (event: DatabaseEvent) => {
      const reply = db.getReply(event.data.replyId)
      if (reply?.postId === postId) {
        updatePost()
      }
    }

    db.on("reply_added", handleReplyAdded)
    db.on("post_liked", handlePostLiked)
    db.on("reply_liked", handleReplyLiked)

    return () => {
      db.off("reply_added", handleReplyAdded)
      db.off("post_liked", handlePostLiked)
      db.off("reply_liked", handleReplyLiked)
    }
  }, [postId, updatePost])

  return { post, replies, loading, refresh: updatePost }
}

export function useConversation(conversationId: string) {
  const [conversation, setConversation] = useState<Conversation | undefined>()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const updateConversation = useCallback(() => {
    const conversationData = db.getConversation(conversationId)
    setConversation(conversationData)

    if (conversationData) {
      const messagesData = db.getMessagesByConversation(conversationId)
      setMessages(messagesData)
    }

    setLoading(false)
  }, [conversationId])

  useEffect(() => {
    updateConversation()

    const handleMessageSent = (event: DatabaseEvent) => {
      if (event.data.conversationId === conversationId) {
        updateConversation()
      }
    }

    const handleMessageRead = (event: DatabaseEvent) => {
      if (event.data.conversationId === conversationId) {
        updateConversation()
      }
    }

    db.on("message_sent", handleMessageSent)
    db.on("message_read", handleMessageRead)

    return () => {
      db.off("message_sent", handleMessageSent)
      db.off("message_read", handleMessageRead)
    }
  }, [conversationId, updateConversation])

  return { conversation, messages, loading, refresh: updateConversation }
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const updateNotifications = useCallback(() => {
    const notificationsData = db.getNotifications(userId)
    setNotifications(notificationsData)
    setUnreadCount(db.getUnreadNotificationCount(userId))
  }, [userId])

  useEffect(() => {
    updateNotifications()

    // Listen for new notifications (simplified - in real app would be more specific)
    const interval = setInterval(updateNotifications, 5000)

    return () => clearInterval(interval)
  }, [updateNotifications])

  const markAsRead = useCallback(
    (notificationId: string) => {
      db.markNotificationAsRead(userId, notificationId)
      updateNotifications()
    },
    [userId, updateNotifications],
  )

  return { notifications, unreadCount, markAsRead, refresh: updateNotifications }
}

export function useForumPosts(categoryId?: string) {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)

  const updatePosts = useCallback(() => {
    if (categoryId) {
      setPosts(db.getPostsByCategory(categoryId))
    } else {
      // Get all posts from all categories
      const allPosts: ForumPost[] = []
      const categories = db.getCategories()
      categories.forEach((category) => {
        allPosts.push(...db.getPostsByCategory(category.id))
      })

      // Sort by last activity
      allPosts.sort((a, b) => {
        const aTime = a.lastReplyAt || a.createdAt
        const bTime = b.lastReplyAt || b.createdAt
        return bTime.getTime() - aTime.getTime()
      })

      setPosts(allPosts)
    }
    setLoading(false)
  }, [categoryId])

  useEffect(() => {
    updatePosts()

    const handlePostCreated = () => updatePosts()
    const handleReplyAdded = () => updatePosts()

    db.on("post_created", handlePostCreated)
    db.on("reply_added", handleReplyAdded)

    return () => {
      db.off("post_created", handlePostCreated)
      db.off("reply_added", handleReplyAdded)
    }
  }, [updatePosts])

  return { posts, loading, refresh: updatePosts }
}

export function useConversations(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const updateConversations = useCallback(() => {
    setConversations(db.getConversationsByUser(userId))
    setLoading(false)
  }, [userId])

  useEffect(() => {
    updateConversations()

    const handleMessageSent = () => updateConversations()

    db.on("message_sent", handleMessageSent)

    return () => {
      db.off("message_sent", handleMessageSent)
    }
  }, [updateConversations])

  return { conversations, loading, refresh: updateConversations }
}

// Utility hooks for common operations
export function useCurrentUser() {
  // In a real app, this would get the current user from auth context
  // For demo purposes, we'll use a mock user
  const [currentUser] = useState<User>({
    isActive: false,
    password: "",
    phone: "",
    profile: {avatar: "", bio: "", interests: [], skills: []},
    role: "entrepreneur",
    userType: "entrepreneur",
    id: "current-user-id",
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    business: "Tech Innovations SL",
    businessType: "Technology",
    district: "Bo",
    verified: true,
    title: "Entrepreneur",
    // bio: "Building innovative solutions for Sierra Leone",
    lookingFor: ["Investors", "Partners", "Mentors"],
    experience: "5+ years",
    rating: 4.8,
    connections: [],
    joinedAt: new Date(),
    lastActive: new Date(),
    isOnline: true
  })

  return currentUser
}

export function useSearch() {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const searchPosts = useCallback(async (query: string, categoryId?: string) => {
    setLoading(true)
    const results = db.searchPosts(query, categoryId)
    setSearchResults(results)
    setLoading(false)
    return results
  }, [])

  const searchMessages = useCallback(async (query: string, conversationId?: string) => {
    setLoading(true)
    const results = db.searchMessages(query, conversationId)
    setSearchResults(results)
    setLoading(false)
    return results
  }, [])

  const searchUsers = useCallback(async (query: string) => {
    setLoading(true)
    const results = db.searchUsers(query)
    setSearchResults(results)
    setLoading(false)
    return results
  }, [])

  return {
    searchResults,
    loading,
    searchPosts,
    searchMessages,
    searchUsers,
    clearResults: () => setSearchResults([]),
  }
}
