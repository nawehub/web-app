import type {
  User,
  ForumCategory,
  ForumPost,
  ForumReply,
  Conversation,
  Message,
  TypingIndicator,
  OnlineStatus,
  Notification,
  DatabaseEvent,
  SearchResult,
  ForumAnalytics,
  ChatAnalytics,
} from "./types"
import {ActivityType} from "@/lib/enums/db-enums";

export class InMemoryDatabase {
  // Core Data Stores
  public users = new Map<string, User>()
  private forumCategories = new Map<string, ForumCategory>()
  private forumPosts = new Map<string, ForumPost>()
  private forumReplies = new Map<string, ForumReply>()
  private conversations = new Map<string, Conversation>()
  private messages = new Map<string, Message>()

  // Real-time Data
  private typingIndicators = new Map<string, TypingIndicator>()
  private onlineStatuses = new Map<string, OnlineStatus>()
  private notifications = new Map<string, Notification[]>()

  // Event System
  private eventListeners = new Map<string, Array<(event: DatabaseEvent) => void>>()
  private eventHistory: DatabaseEvent[] = []

  // Indexes for Performance
  private postsByCategory = new Map<string, Set<string>>()
  private postsByAuthor = new Map<string, Set<string>>()
  private repliesByPost = new Map<string, Set<string>>()
  private messagesByConversation = new Map<string, Set<string>>()
  private conversationsByUser = new Map<string, Set<string>>()
  private notificationsByUser = new Map<string, Set<string>>()

  constructor() {
    this.initializeDefaultData()
    this.startCleanupTasks()
  }

  // Event System
  on(eventType: string, callback: (event: DatabaseEvent) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType)!.push(callback)
  }

  off(eventType: string, callback: (event: DatabaseEvent) => void) {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  public emit(event: DatabaseEvent) {
    this.eventHistory.push(event)

    // Keep only the last 1000 events
    if (this.eventHistory.length > 1000) {
      this.eventHistory.shift()
    }

    const listeners = this.eventListeners.get(event.type) || []
    listeners.forEach((callback) => {
      try {
        callback(event)
      } catch (error) {
        console.error("Event listener error:", error)
      }
    })

    // Emit to 'all' listeners
    const allListeners = this.eventListeners.get("all") || []
    allListeners.forEach((callback) => {
      try {
        callback(event)
      } catch (error) {
        console.error("Event listener error:", error)
      }
    })
  }

  // User Management
  createUser(userData: Omit<User, "id" | "joinedAt" | "lastActive" | "isOnline">): User {
    const user: User = {
      ...userData,
      id: this.generateId(),
      joinedAt: new Date(),
      lastActive: new Date(),
      isOnline: false,
    }

    this.users.set(user.id, user)
    this.conversationsByUser.set(user.id, new Set())
    this.postsByAuthor.set(user.id, new Set())
    this.notificationsByUser.set(user.id, new Set())

    return user
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId)
  }

  updateUser(userId: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(userId)
    if (!user) return undefined

    const updatedUser = { ...user, ...updates }
    this.users.set(userId, updatedUser)
    return updatedUser
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  searchUsers(query: string): User[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.users.values()).filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.business?.toLowerCase().includes(lowercaseQuery) ||
        user.profile.skills.some((skill) => skill.toLowerCase().includes(lowercaseQuery)),
    )
  }

  // Online Status Management
  setUserOnline(userId: string, activity?: { type: ActivityType; location?: string }) {
    const status: OnlineStatus = {
      userId,
      isOnline: true,
      lastSeen: new Date(),
      currentActivity: activity,
    }

    this.onlineStatuses.set(userId, status)
    this.updateUser(userId, { isOnline: true, lastActive: new Date() })

    this.emit({
      type: "user_online",
      data: { userId, activity },
      timestamp: new Date(),
      userId,
    })
  }

  setUserOffline(userId: string) {
    const status = this.onlineStatuses.get(userId)
    if (status) {
      status.isOnline = false
      status.lastSeen = new Date()
      status.currentActivity = undefined
      this.onlineStatuses.set(userId, status)
    }

    this.updateUser(userId, { isOnline: false, lastActive: new Date() })

    this.emit({
      type: "user_offline",
      data: { userId },
      timestamp: new Date(),
      userId,
    })
  }

  getOnlineUsers(): OnlineStatus[] {
    return Array.from(this.onlineStatuses.values()).filter((status) => status.isOnline)
  }

  getUsersInLocation(type: string, location?: string): OnlineStatus[] {
    return this.getOnlineUsers().filter(
      (status) => status.currentActivity?.type === type && (!location || status.currentActivity?.location === location),
    )
  }

  // Forum Category Management
  createCategory(categoryData: Omit<ForumCategory, "id" | "postCount">): ForumCategory {
    const category: ForumCategory = {
      ...categoryData,
      id: this.generateId(),
      postCount: 0,
    }

    this.forumCategories.set(category.id, category)
    this.postsByCategory.set(category.id, new Set())
    return category
  }

  getCategories(): ForumCategory[] {
    return Array.from(this.forumCategories.values())
  }

  getCategory(categoryId: string): ForumCategory | undefined {
    return this.forumCategories.get(categoryId)
  }

  // Forum Post Management
  createPost(
    postData: Omit<ForumPost, "id" | "createdAt" | "updatedAt" | "likes" | "views" | "bookmarks" | "replyCount">,
  ): ForumPost {
    const post: ForumPost = {
      ...postData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: [],
      views: [],
      bookmarks: [],
      replyCount: 0,
    }

    this.forumPosts.set(post.id, post)
    this.postsByCategory.get(post.categoryId)?.add(post.id)
    this.postsByAuthor.get(post.authorId)?.add(post.id)
    this.repliesByPost.set(post.id, new Set())

    // Update category post count
    const category = this.forumCategories.get(post.categoryId)
    if (category) {
      category.postCount++
      this.forumCategories.set(category.id, category)
    }

    this.emit({
      type: "post_created",
      data: { postId: post.id, authorId: post.authorId, categoryId: post.categoryId },
      timestamp: new Date(),
      userId: post.authorId,
    })

    return post
  }

  getPost(postId: string): ForumPost | undefined {
    return this.forumPosts.get(postId)
  }

  updatePost(postId: string, updates: Partial<ForumPost>): ForumPost | undefined {
    const post = this.forumPosts.get(postId)
    if (!post) return undefined

    const updatedPost = {
      ...post,
      ...updates,
      updatedAt: new Date(),
      editedAt: updates.content ? new Date() : post.editedAt,
    }
    this.forumPosts.set(postId, updatedPost)
    return updatedPost
  }

  deletePost(postId: string): boolean {
    const post = this.forumPosts.get(postId)
    if (!post) return false

    // Remove from indexes
    this.postsByCategory.get(post.categoryId)?.delete(postId)
    this.postsByAuthor.get(post.authorId)?.delete(postId)

    // Delete all replies
    const replyIds = this.repliesByPost.get(postId) || new Set()
    replyIds.forEach((replyId) => this.forumReplies.delete(replyId))
    this.repliesByPost.delete(postId)

    // Update category post count
    const category = this.forumCategories.get(post.categoryId)
    if (category) {
      category.postCount--
      this.forumCategories.set(category.id, category)
    }

    this.forumPosts.delete(postId)
    return true
  }

  getPostsByCategory(categoryId: string, limit = 20, offset = 0): ForumPost[] {
    const postIds = Array.from(this.postsByCategory.get(categoryId) || [])
    const posts = postIds
      .map((id) => this.forumPosts.get(id)!)
      .sort((a, b) => {
        // Pinned posts first, then by last activity
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return (b.lastReplyAt || b.createdAt).getTime() - (a.lastReplyAt || a.createdAt).getTime()
      })

    return posts.slice(offset, offset + limit)
  }

  getPostsByAuthor(authorId: string): ForumPost[] {
    const postIds = Array.from(this.postsByAuthor.get(authorId) || [])
    return postIds.map((id) => this.forumPosts.get(id)!).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  likePost(postId: string, userId: string): boolean {
    const post = this.forumPosts.get(postId)
    if (!post) return false

    if (!post.likes.includes(userId)) {
      post.likes.push(userId)
      this.forumPosts.set(postId, post)

      this.emit({
        type: "post_liked",
        data: { postId, userId, likeCount: post.likes.length },
        timestamp: new Date(),
        userId,
      })
    }

    return true
  }

  unlikePost(postId: string, userId: string): boolean {
    const post = this.forumPosts.get(postId)
    if (!post) return false

    const index = post.likes.indexOf(userId)
    if (index > -1) {
      post.likes.splice(index, 1)
      this.forumPosts.set(postId, post)
    }

    return true
  }

  viewPost(postId: string, userId: string): boolean {
    const post = this.forumPosts.get(postId)
    if (!post) return false

    if (!post.views.includes(userId)) {
      post.views.push(userId)
      this.forumPosts.set(postId, post)
    }

    return true
  }

  bookmarkPost(postId: string, userId: string): boolean {
    const post = this.forumPosts.get(postId)
    if (!post) return false

    if (!post.bookmarks.includes(userId)) {
      post.bookmarks.push(userId)
    } else {
      const index = post.bookmarks.indexOf(userId)
      post.bookmarks.splice(index, 1)
    }

    this.forumPosts.set(postId, post)
    return true
  }

  // Forum Reply Management
  createReply(
    replyData: Omit<ForumReply, "id" | "createdAt" | "updatedAt" | "isEdited" | "likes" | "replies">,
  ): ForumReply {
    const reply: ForumReply = {
      ...replyData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      likes: [],
      replies: [],
    }

    this.forumReplies.set(reply.id, reply)
    this.repliesByPost.get(reply.postId)?.add(reply.id)

    // Update post-reply count and last reply info
    const post = this.forumPosts.get(reply.postId)
    if (post) {
      post.replyCount++
      post.lastReplyAt = new Date()
      post.lastReplyBy = reply.authorId
      this.forumPosts.set(post.id, post)
    }

    this.emit({
      type: "reply_added",
      data: {
        replyId: reply.id,
        postId: reply.postId,
        authorId: reply.authorId,
        mentions: reply.mentions,
      },
      timestamp: new Date(),
      userId: reply.authorId,
    })

    // Create notifications for mentions
    reply.mentions.forEach((mentionedUserId) => {
      this.createNotification(mentionedUserId, {
        type: "forum_mention",
        title: "You were mentioned in a discussion",
        message: `${this.getUser(reply.authorId)?.name} mentioned you in a reply`,
        data:  {
          "postId": reply.postId,
          "replyId": reply.id
        }
      })
    })
    return reply
  }

  getReply(replyId: string): ForumReply | undefined {
    return this.forumReplies.get(replyId)
  }

  updateReply(replyId: string, updates: Partial<ForumReply>): ForumReply | undefined {
    const reply = this.forumReplies.get(replyId)
    if (!reply) return undefined

    const updatedReply = {
      ...reply,
      ...updates,
      updatedAt: new Date(),
      isEdited: updates.content ? true : reply.isEdited,
      editedAt: updates.content ? new Date() : reply.editedAt,
    }
    this.forumReplies.set(replyId, updatedReply)
    return updatedReply
  }

  deleteReply(replyId: string): boolean {
    const reply = this.forumReplies.get(replyId)
    if (!reply) return false

    // Remove from post's reply set
    this.repliesByPost.get(reply.postId)?.delete(replyId)

    // Delete nested replies
    reply.replies.forEach((nestedReplyId) => {
      this.deleteReply(nestedReplyId)
    })

    // Update post-reply count
    const post = this.forumPosts.get(reply.postId)
    if (post) {
      post.replyCount--
      this.forumPosts.set(post.id, post)
    }

    this.forumReplies.delete(replyId)
    return true
  }

  getRepliesByPost(postId: string, sortBy: "newest" | "oldest" | "popular" = "newest"): ForumReply[] {
    const replyIds = Array.from(this.repliesByPost.get(postId) || [])
    const replies = replyIds.map((id) => this.forumReplies.get(id)!).filter((reply) => !reply.id) // Only top-level replies

    return this.sortReplies(replies, sortBy)
  }

  getNestedReplies(parentReplyId: string, sortBy: "newest" | "oldest" | "popular" = "newest"): ForumReply[] {
    const parentReply = this.forumReplies.get(parentReplyId)
    if (!parentReply) return []

    const replies = parentReply.replies.map((id) => this.forumReplies.get(id)!)
    return this.sortReplies(replies, sortBy)
  }

  private sortReplies(replies: ForumReply[], sortBy: "newest" | "oldest" | "popular"): ForumReply[] {
    switch (sortBy) {
      case "oldest":
        return replies.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      case "popular":
        return replies.sort((a, b) => b.likes.length - a.likes.length)
      case "newest":
      default:
        return replies.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  }

  likeReply(replyId: string, userId: string): boolean {
    const reply = this.forumReplies.get(replyId)
    if (!reply) return false

    if (!reply.likes.includes(userId)) {
      reply.likes.push(userId)
      this.forumReplies.set(replyId, reply)

      this.emit({
        type: "reply_liked",
        data: { replyId, userId, likeCount: reply.likes.length },
        timestamp: new Date(),
        userId,
      })
    }

    return true
  }

  unlikeReply(replyId: string, userId: string): boolean {
    const reply = this.forumReplies.get(replyId)
    if (!reply) return false

    const index = reply.likes.indexOf(userId)
    if (index > -1) {
      reply.likes.splice(index, 1)
      this.forumReplies.set(replyId, reply)
    }

    return true
  }

  // Conversation Management
  createConversation(
    conversationData: Omit<Conversation, "id" | "createdAt" | "updatedAt" | "isArchived" | "settings">,
  ): Conversation {
    const conversation: Conversation = {
      ...conversationData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false,
      settings: {
        notifications: true,
        pinnedMessages: [],
        customizations: {},
      },
    }

    this.conversations.set(conversation.id, conversation)
    this.messagesByConversation.set(conversation.id, new Set())

    // Add to each participant's conversation list
    conversation.participants.forEach((userId) => {
      this.conversationsByUser.get(userId)?.add(conversation.id)
    })

    return conversation
  }

  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId)
  }

  getConversationsByUser(userId: string): Conversation[] {
    const conversationIds = Array.from(this.conversationsByUser.get(userId) || [])
    return conversationIds
      .map((id) => this.conversations.get(id)!)
      .filter((conv) => !conv.isArchived)
      .sort((a, b) => (b.lastMessageAt || b.createdAt).getTime() - (a.lastMessageAt || a.createdAt).getTime())
  }

  // Message Management
  sendMessage(
    messageData: Omit<
      Message,
      "id" | "createdAt" | "updatedAt" | "isEdited" | "deliveredTo" | "readBy" | "isDeleted" | "reactions"
    >,
  ): Message {
    const message: Message = {
      ...messageData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      deliveredTo: [],
      readBy: [],
      isDeleted: false,
      reactions: [],
    }

    this.messages.set(message.id, message)
    this.messagesByConversation.get(message.conversationId)?.add(message.id)

    // Update conversation
    const conversation = this.conversations.get(message.conversationId)
    if (conversation) {
      conversation.lastMessageAt = new Date()
      conversation.lastMessageId = message.id
      conversation.updatedAt = new Date()
      this.conversations.set(conversation.id, conversation)

      // Mark as delivered to all participants except sender
      message.deliveredTo = conversation.participants.filter((id) => id !== message.senderId)
    }

    this.emit({
      type: "message_sent",
      data: {
        messageId: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        mentions: message.mentions,
      },
      timestamp: new Date(),
      userId: message.senderId,
    })

    // Create notifications for mentions
    message.mentions.forEach((mentionedUserId) => {
      this.createNotification(mentionedUserId, {
        type: "message",
        title: "You were mentioned in a message",
        message: `${this.getUser(message.senderId)?.name} mentioned you`,
        data: { conversationId: message.conversationId, messageId: message.id },
      })
    })

    return message
  }

  getMessage(messageId: string): Message | undefined {
    return this.messages.get(messageId)
  }

  updateMessage(messageId: string, updates: Partial<Message>): Message | undefined {
    const message = this.messages.get(messageId)
    if (!message) return undefined

    const updatedMessage = {
      ...message,
      ...updates,
      updatedAt: new Date(),
      isEdited: updates.content ? true : message.isEdited,
      editedAt: updates.content ? new Date() : message.editedAt,
    }
    this.messages.set(messageId, updatedMessage)
    return updatedMessage
  }

  deleteMessage(messageId: string): boolean {
    const message = this.messages.get(messageId)
    if (!message) return false

    message.isDeleted = true
    message.deletedAt = new Date()
    message.content = "[Message deleted]"
    this.messages.set(messageId, message)

    return true
  }

  getMessagesByConversation(conversationId: string, limit = 50, before?: string): Message[] {
    const messageIds = Array.from(this.messagesByConversation.get(conversationId) || [])
    let messages = messageIds
      .map((id) => this.messages.get(id)!)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

    if (before) {
      const beforeMessage = this.messages.get(before)
      if (beforeMessage) {
        messages = messages.filter((msg) => msg.createdAt < beforeMessage.createdAt)
      }
    }

    return messages.slice(-limit)
  }

  markMessageAsRead(messageId: string, userId: string): boolean {
    const message = this.messages.get(messageId)
    if (!message) return false

    const existingRead = message.readBy.find((read) => read.userId === userId)
    if (!existingRead) {
      message.readBy.push({ userId, readAt: new Date() })
      this.messages.set(messageId, message)

      this.emit({
        type: "message_read",
        data: { messageId, userId, conversationId: message.conversationId },
        timestamp: new Date(),
        userId,
      })
    }

    return true
  }

  addMessageReaction(messageId: string, userId: string, emoji: string): boolean {
    const message = this.messages.get(messageId)
    if (!message) return false

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter((reaction) => reaction.userId !== userId)

    // Add new reaction
    message.reactions.push({ userId, emoji, createdAt: new Date() })
    this.messages.set(messageId, message)

    return true
  }

  removeMessageReaction(messageId: string, userId: string): boolean {
    const message = this.messages.get(messageId)
    if (!message) return false

    message.reactions = message.reactions.filter((reaction) => reaction.userId !== userId)
    this.messages.set(messageId, message)

    return true
  }

  // Typing Indicators
  startTyping(userId: string, conversationId?: string, postId?: string) {
    const key = conversationId || postId || "general"
    const indicator: TypingIndicator = {
      userId,
      conversationId,
      postId,
      startedAt: new Date(),
      lastActivity: new Date(),
    }

    this.typingIndicators.set(`${userId}-${key}`, indicator)

    this.emit({
      type: "typing_start",
      data: { userId, conversationId, postId },
      timestamp: new Date(),
      userId,
    })
  }

  stopTyping(userId: string, conversationId?: string, postId?: string) {
    const key = conversationId || postId || "general"
    this.typingIndicators.delete(`${userId}-${key}`)

    this.emit({
      type: "typing_stop",
      data: { userId, conversationId, postId },
      timestamp: new Date(),
      userId,
    })
  }

  getTypingUsers(conversationId?: string, postId?: string): TypingIndicator[] {
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

    return Array.from(this.typingIndicators.values()).filter((indicator) => {
      if (conversationId && indicator.conversationId !== conversationId) return false
      if (postId && indicator.postId !== postId) return false
      return indicator.lastActivity > fiveMinutesAgo
    })
  }

  // Notification Management
  createNotification(
    userId: string,
    notificationData: Omit<Notification, "id" | "userId" | "isRead" | "createdAt">,
  ): Notification {
    const notification: Notification = {
      ...notificationData,
      id: this.generateId(),
      userId,
      isRead: false,
      createdAt: new Date(),
    }

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, [])
    }

    this.notifications.get(userId)!.push(notification)
    this.notificationsByUser.get(userId)?.add(notification.id)

    return notification
  }

  getNotifications(userId: string, limit = 20): Notification[] {
    const userNotifications = this.notifications.get(userId) || []
    return userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
  }

  markNotificationAsRead(userId: string, notificationId: string): boolean {
    const userNotifications = this.notifications.get(userId) || []
    const notification = userNotifications.find((n) => n.id === notificationId)

    if (notification) {
      notification.isRead = true
      return true
    }

    return false
  }

  getUnreadNotificationCount(userId: string): number {
    const userNotifications = this.notifications.get(userId) || []
    return userNotifications.filter((n) => !n.isRead).length
  }

  // Search Functionality
  searchPosts(query: string, categoryId?: string): SearchResult[] {
    const lowercaseQuery = query.toLowerCase()
    const results: SearchResult[] = []

    for (const post of this.forumPosts.values()) {
      if (categoryId && post.categoryId !== categoryId) continue

      let relevance = 0

      if (post.title.toLowerCase().includes(lowercaseQuery)) {
        relevance += 10
      }

      if (post.content.toLowerCase().includes(lowercaseQuery)) {
        relevance += 5
      }

      if (post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))) {
        relevance += 3
      }

      if (relevance > 0) {
        results.push({
          type: "post",
          id: post.id,
          title: post.title,
          content: post.content.substring(0, 200) + "...",
          relevance,
          metadata: {
            authorId: post.authorId,
            categoryId: post.categoryId,
            createdAt: post.createdAt,
            likes: post.likes.length,
            replies: post.replyCount,
          },
        })
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance)
  }

  searchMessages(query: string, conversationId?: string): SearchResult[] {
    const lowercaseQuery = query.toLowerCase()
    const results: SearchResult[] = []

    for (const message of this.messages.values()) {
      if (conversationId && message.conversationId !== conversationId) continue
      if (message.isDeleted) continue

      if (message.content.toLowerCase().includes(lowercaseQuery)) {
        results.push({
          type: "message",
          id: message.id,
          title: `Message from ${this.getUser(message.senderId)?.name}`,
          content: message.content,
          relevance: 1,
          metadata: {
            senderId: message.senderId,
            conversationId: message.conversationId,
            createdAt: message.createdAt,
          },
        })
      }
    }

    return results.sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime())
  }

  // Analytics
  getForumAnalytics(): ForumAnalytics {
    const totalPosts = this.forumPosts.size
    const totalReplies = this.forumReplies.size
    const activeUsers = this.getOnlineUsers().length

    const categoryStats = new Map<string, number>()
    for (const post of this.forumPosts.values()) {
      categoryStats.set(post.categoryId, (categoryStats.get(post.categoryId) || 0) + 1)
    }

    const topCategories = Array.from(categoryStats.entries())
      .map(([categoryId, postCount]) => ({ categoryId, postCount }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5)

    // Calculate engagement rate (likes + replies / total posts)
    let totalEngagement = 0
    for (const post of this.forumPosts.values()) {
      totalEngagement += post.likes.length + post.replyCount
    }
    const engagementRate = totalPosts > 0 ? totalEngagement / totalPosts : 0

    // Calculate average response time (simplified)
    let totalResponseTime = 0
    let responseCount = 0
    for (const post of this.forumPosts.values()) {
      if (post.lastReplyAt) {
        totalResponseTime += post.lastReplyAt.getTime() - post.createdAt.getTime()
        responseCount++
      }
    }
    const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0

    return {
      totalPosts,
      totalReplies,
      activeUsers,
      topCategories,
      engagementRate,
      averageResponseTime,
    }
  }

  getChatAnalytics(): ChatAnalytics {
    const totalMessages = this.messages.size
    const activeConversations = Array.from(this.conversations.values()).filter(
      (conv) => conv.lastMessageAt && conv.lastMessageAt > new Date(Date.now() - 24 * 60 * 60 * 1000),
    ).length

    // Calculate average response time
    let totalResponseTime = 0
    let responseCount = 0
    const conversationMessages = new Map<string, Message[]>()

    for (const message of this.messages.values()) {
      if (!conversationMessages.has(message.conversationId)) {
        conversationMessages.set(message.conversationId, [])
      }
      conversationMessages.get(message.conversationId)!.push(message)
    }

    for (const messages of conversationMessages.values()) {
      messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      for (let i = 1; i < messages.length; i++) {
        if (messages[i].senderId !== messages[i - 1].senderId) {
          totalResponseTime += messages[i].createdAt.getTime() - messages[i - 1].createdAt.getTime()
          responseCount++
        }
      }
    }

    const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0

    // Count message types
    const messageTypes: Record<string, number> = {}
    for (const message of this.messages.values()) {
      messageTypes[message.type] = (messageTypes[message.type] || 0) + 1
    }

    return {
      totalMessages,
      activeConversations,
      averageResponseTime,
      messageTypes,
    }
  }

  // Utility Methods
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private startCleanupTasks() {
    // Clean up old typing indicators every minute
    setInterval(() => {
      const now = new Date()
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

      for (const [key, indicator] of this.typingIndicators.entries()) {
        if (indicator.lastActivity < fiveMinutesAgo) {
          this.typingIndicators.delete(key)
        }
      }
    }, 60000)

    // Clean up old events every hour
    setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      this.eventHistory = this.eventHistory.filter((event) => event.timestamp > oneHourAgo)
    }, 3600000)

    // Clean up expired notifications every day
    setInterval(
      () => {
        const now = new Date()
        for (const [userId, notifications] of this.notifications.entries()) {
          const validNotifications = notifications.filter((n) => !n.expiresAt || n.expiresAt > now)
          this.notifications.set(userId, validNotifications)
        }
      },
      24 * 60 * 60 * 1000,
    )
  }

  private initializeDefaultData() {
    // Create default categories
    this.createCategory({
      name: "General Discussion",
      description: "General business discussions and networking",
      icon: "MessageSquare",
      color: "blue",
    })

    this.createCategory({
      name: "Funding & Investment",
      description: "Discussions about funding opportunities and investment",
      icon: "DollarSign",
      color: "green",
    })

    this.createCategory({
      name: "Technology",
      description: "Tech-related discussions and innovation",
      icon: "Laptop",
      color: "purple",
    })

    this.createCategory({
      name: "Agriculture",
      description: "Agricultural business and farming discussions",
      icon: "Sprout",
      color: "emerald",
    })

    this.createCategory({
      name: "Marketing & Sales",
      description: "Marketing strategies and sales discussions",
      icon: "TrendingUp",
      color: "orange",
    })

    this.createCategory({
      name: "Legal & Compliance",
      description: "Legal advice and compliance discussions",
      icon: "Scale",
      color: "red",
    })
  }

  // Export/Import for persistence (if needed)
  exportData() {
    return {
      users: Array.from(this.users.entries()),
      forumCategories: Array.from(this.forumCategories.entries()),
      forumPosts: Array.from(this.forumPosts.entries()),
      forumReplies: Array.from(this.forumReplies.entries()),
      conversations: Array.from(this.conversations.entries()),
      messages: Array.from(this.messages.entries()),
      notifications: Array.from(this.notifications.entries()),
    }
  }

  importData(data: any) {
    if (data.users) this.users = new Map(data.users)
    if (data.forumCategories) this.forumCategories = new Map(data.forumCategories)
    if (data.forumPosts) this.forumPosts = new Map(data.forumPosts)
    if (data.forumReplies) this.forumReplies = new Map(data.forumReplies)
    if (data.conversations) this.conversations = new Map(data.conversations)
    if (data.messages) this.messages = new Map(data.messages)
    if (data.notifications) this.notifications = new Map(data.notifications)

    // Rebuild indexes
    this.rebuildIndexes()
  }

  private rebuildIndexes() {
    // Clear existing indexes
    this.postsByCategory.clear()
    this.postsByAuthor.clear()
    this.repliesByPost.clear()
    this.messagesByConversation.clear()
    this.conversationsByUser.clear()
    this.notificationsByUser.clear()

    // Rebuild category indexes
    for (const category of this.forumCategories.values()) {
      this.postsByCategory.set(category.id, new Set())
    }

    // Rebuild post indexes
    for (const post of this.forumPosts.values()) {
      this.postsByCategory.get(post.categoryId)?.add(post.id)

      if (!this.postsByAuthor.has(post.authorId)) {
        this.postsByAuthor.set(post.authorId, new Set())
      }
      this.postsByAuthor.get(post.authorId)?.add(post.id)

      this.repliesByPost.set(post.id, new Set())
    }

    // Rebuild reply indexes
    for (const reply of this.forumReplies.values()) {
      this.repliesByPost.get(reply.postId)?.add(reply.id)
    }

    // Rebuild conversation indexes
    for (const conversation of this.conversations.values()) {
      this.messagesByConversation.set(conversation.id, new Set())

      conversation.participants.forEach((userId) => {
        if (!this.conversationsByUser.has(userId)) {
          this.conversationsByUser.set(userId, new Set())
        }
        this.conversationsByUser.get(userId)?.add(conversation.id)
      })
    }

    // Rebuild message indexes
    for (const message of this.messages.values()) {
      this.messagesByConversation.get(message.conversationId)?.add(message.id)
    }

    // Rebuild user indexes
    for (const user of this.users.values()) {
      if (!this.conversationsByUser.has(user.id)) {
        this.conversationsByUser.set(user.id, new Set())
      }
      if (!this.postsByAuthor.has(user.id)) {
        this.postsByAuthor.set(user.id, new Set())
      }
      this.notificationsByUser.set(user.id, new Set())
    }
  }
}

// Create singleton instance
export const db = new InMemoryDatabase()
