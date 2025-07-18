"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  ArrowLeft,
  Check,
  CheckCheck,
  Plus,
  Star,
  Archive,
  Trash2,
  Pin,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const conversations = [
  {
    id: 1,
    participant: {
      name: "Mohamed Sesay",
      avatar: "/placeholder.svg?height=40&width=40",
      business: "Digital Marketing Pro",
      district: "Western Area Urban",
      online: true,
    },
    lastMessage: {
      content: "That sounds like a great partnership opportunity! When can we schedule a call?",
      timestamp: "2 min ago",
      sender: "them",
      read: false,
    },
    unreadCount: 2,
    pinned: true,
    starred: false,
  },
  {
    id: 2,
    participant: {
      name: "Fatima Bangura",
      avatar: "/placeholder.svg?height=40&width=40",
      business: "Eco Fashion SL",
      district: "Kenema",
      online: false,
      lastSeen: "1 hour ago",
    },
    lastMessage: {
      content: "Thanks for the supplier recommendations! I'll reach out to them this week.",
      timestamp: "1 hour ago",
      sender: "them",
      read: true,
    },
    unreadCount: 0,
    pinned: false,
    starred: true,
  },
  {
    id: 3,
    participant: {
      name: "Ibrahim Turay",
      avatar: "/placeholder.svg?height=40&width=40",
      business: "FinTech Innovations",
      district: "Bo",
      online: true,
    },
    lastMessage: {
      content: "Perfect! I'll send you the technical documentation by tomorrow.",
      timestamp: "3 hours ago",
      sender: "me",
      read: true,
    },
    unreadCount: 0,
    pinned: false,
    starred: false,
  },
  {
    id: 4,
    participant: {
      name: "Aminata Kamara",
      avatar: "/placeholder.svg?height=40&width=40",
      business: "AgroTech Solutions",
      district: "Bo",
      online: false,
      lastSeen: "2 days ago",
    },
    lastMessage: {
      content: "Looking forward to collaborating on the IoT project!",
      timestamp: "2 days ago",
      sender: "them",
      read: true,
    },
    unreadCount: 0,
    pinned: false,
    starred: false,
  },
]

const messages = [
  {
    id: 1,
    content:
      "Hi Mohamed! I saw your post about digital marketing services. I'm interested in discussing a potential partnership.",
    sender: "me",
    timestamp: "10:30 AM",
    date: "Today",
    status: "read",
    type: "text",
  },
  {
    id: 2,
    content:
      "Hello! Great to hear from you. I'd love to learn more about your business and how we might work together.",
    sender: "them",
    timestamp: "10:35 AM",
    date: "Today",
    status: "read",
    type: "text",
  },
  {
    id: 3,
    content:
      "I run a sustainable fashion brand and I'm looking to expand our online presence. Your expertise in e-commerce could be really valuable.",
    sender: "me",
    timestamp: "10:40 AM",
    date: "Today",
    status: "read",
    type: "text",
  },
  {
    id: 4,
    content:
      "That sounds perfect! I've worked with several fashion brands before. I can help with social media strategy, e-commerce setup, and digital advertising.",
    sender: "them",
    timestamp: "10:45 AM",
    date: "Today",
    status: "read",
    type: "text",
  },
  {
    id: 5,
    content: "Here's my portfolio with some case studies from similar projects:",
    sender: "them",
    timestamp: "10:46 AM",
    date: "Today",
    status: "read",
    type: "text",
  },
  {
    id: 6,
    content: "Digital_Marketing_Portfolio.pdf",
    sender: "them",
    timestamp: "10:46 AM",
    date: "Today",
    status: "read",
    type: "file",
    fileName: "Digital_Marketing_Portfolio.pdf",
    fileSize: "2.4 MB",
  },
  {
    id: 7,
    content:
      "This looks impressive! I especially like the case study with the local jewelry brand. The 300% increase in online sales is exactly what we're aiming for.",
    sender: "me",
    timestamp: "11:15 AM",
    date: "Today",
    status: "read",
    type: "text",
  },
  {
    id: 8,
    content: "That sounds like a great partnership opportunity! When can we schedule a call?",
    sender: "them",
    timestamp: "11:20 AM",
    date: "Today",
    status: "delivered",
    type: "text",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showMobileChat, setShowMobileChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.participant.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatTime = (timestamp: string) => {
    // Simple time formatting - in a real app, you'd use a proper date library
    return timestamp
  }

  const getMessageStatus = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="w-4 h-4 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Messages</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className={`lg:col-span-1 ${showMobileChat ? "hidden lg:block" : "block"}`}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button size="sm" variant="ghost">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation)
                          setShowMobileChat(true)
                        }}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                          selectedConversation.id === conversation.id
                            ? "bg-blue-50 border-blue-500"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={conversation.participant.avatar || "/placeholder.svg"}
                                alt={conversation.participant.name}
                              />
                              <AvatarFallback>
                                {conversation.participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.participant.online && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-sm truncate">{conversation.participant.name}</h3>
                                {conversation.pinned && <Pin className="w-3 h-3 text-gray-400" />}
                                {conversation.starred && <Star className="w-3 h-3 text-yellow-500" />}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">{conversation.lastMessage.timestamp}</span>
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="default" className="text-xs min-w-[20px] h-5">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{conversation.participant.business}</p>
                            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-3 ${showMobileChat ? "block" : "hidden lg:block"}`}>
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowMobileChat(false)}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={selectedConversation.participant.avatar || "/placeholder.svg"}
                          alt={selectedConversation.participant.name}
                        />
                        <AvatarFallback>
                          {selectedConversation.participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.participant.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.participant.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{selectedConversation.participant.business}</span>
                        <span>•</span>
                        <span>{selectedConversation.participant.district}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.participant.online
                          ? "Online"
                          : `Last seen ${selectedConversation.participant.lastSeen}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          Star Conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pin className="w-4 h-4 mr-2" />
                          Pin Conversation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100vh-400px)] p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isMe = message.sender === "me"
                      const showDate = index === 0 || messages[index - 1].date !== message.date

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <Badge variant="secondary" className="text-xs">
                                {message.date}
                              </Badge>
                            </div>
                          )}
                          <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] ${isMe ? "order-2" : "order-1"}`}>
                              {message.type === "text" ? (
                                <div
                                  className={`p-3 rounded-lg ${
                                    isMe
                                      ? "bg-blue-600 text-white rounded-br-sm"
                                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                              ) : message.type === "file" ? (
                                <div
                                  className={`p-3 rounded-lg border ${
                                    isMe
                                      ? "bg-blue-50 border-blue-200 rounded-br-sm"
                                      : "bg-gray-50 border-gray-200 rounded-bl-sm"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <Paperclip className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{message.fileName}</p>
                                      <p className="text-xs text-gray-500">{message.fileSize}</p>
                                    </div>
                                    <Button size="sm" variant="outline">
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              ) : null}
                              <div
                                className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                                  isMe ? "justify-end" : "justify-start"
                                }`}
                              >
                                <span>{formatTime(message.timestamp)}</span>
                                {isMe && getMessageStatus(message.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyUp={handleKeyPress}
                      className="min-h-[40px] max-h-[120px] resize-none"
                      rows={1}
                    />
                  </div>
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  <span>{selectedConversation.participant.online ? "Online" : "Offline"}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
