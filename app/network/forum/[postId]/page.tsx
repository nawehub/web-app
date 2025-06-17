"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  ThumbsUp,
  Reply,
  Share2,
  Bookmark,
  Flag,
  Clock,
  Eye,
  MessageSquare,
  Send,
  Heart,
  Users,
  Smile,
  ImageIcon,
  Paperclip,
  MoreVertical,
  Edit,
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Simulated real-time data
const postData = {
  id: 1,
  title: "Looking for tech co-founder for AgriTech startup",
  category: "Technology",
  author: "Aminata Kamara",
  authorAvatar: "/placeholder.svg?height=40&width=40",
  authorBio: "Founder of AgroTech Solutions, passionate about using technology to help smallholder farmers",
  district: "Bo",
  verified: true,
  content: `I'm building an IoT solution for smallholder farmers and looking for a technical co-founder with experience in hardware and mobile development. 

The solution helps farmers monitor soil conditions and optimize irrigation through smart sensors and a mobile app. We've already validated the concept with 50+ farmers in the Bo district and have initial funding secured.

**What we're looking for:**
- Experience with IoT hardware development
- Mobile app development (React Native preferred)
- Understanding of agricultural challenges in Sierra Leone
- Passion for social impact

**What we offer:**
- Equity stake as co-founder
- Proven market validation
- Initial funding secured
- Strong network in agricultural sector

If you're interested or know someone who might be, please reach out! Happy to discuss more details.`,
  tags: ["Co-founder", "AgriTech", "IoT", "Hardware", "Mobile Development"],
  likes: 24,
  views: 156,
  timeAgo: "2 hours ago",
  pinned: true,
  createdAt: "2024-12-26T10:00:00Z",
}

const initialReplies = [
  {
    id: 1,
    author: "Mohamed Sesay",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    authorTitle: "Full-Stack Developer",
    district: "Western Area Urban",
    verified: true,
    content:
      "This sounds like an amazing project! I have 5+ years of experience in mobile development and have worked on IoT projects before. I'm particularly interested in the social impact aspect. Would love to learn more about the technical requirements.",
    timeAgo: "1 hour ago",
    timestamp: "2024-12-26T11:00:00Z",
    likes: 8,
    replies: [],
    isEdited: false,
  },
  {
    id: 2,
    author: "Ibrahim Turay",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    authorTitle: "Hardware Engineer",
    district: "Bo",
    verified: true,
    content:
      "Great initiative! I've been working on similar sensor solutions for agriculture. While I'm not available as a co-founder, I'd be happy to provide technical consultation or connect you with hardware suppliers in the region.",
    timeAgo: "45 minutes ago",
    timestamp: "2024-12-26T11:15:00Z",
    likes: 5,
    replies: [
      {
        id: 21,
        author: "Aminata Kamara",
        authorAvatar: "/placeholder.svg?height=32&width=32",
        content: "That would be incredibly helpful! I'll send you a message with more details.",
        timeAgo: "30 minutes ago",
        timestamp: "2024-12-26T11:30:00Z",
        likes: 2,
      },
    ],
    isEdited: false,
  },
  {
    id: 3,
    author: "Fatima Bangura",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    authorTitle: "Business Development",
    district: "Kenema",
    verified: false,
    content:
      "This is exactly what our agricultural sector needs! I work with farmer cooperatives and would be interested in helping with market penetration and farmer onboarding once you have the technical team in place.",
    timeAgo: "30 minutes ago",
    timestamp: "2024-12-26T11:30:00Z",
    likes: 12,
    replies: [],
    isEdited: false,
  },
]

export default function ForumPostPage() {
  const [replies, setReplies] = useState(initialReplies)
  const [newReply, setNewReply] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(postData.likes)
  const [viewCount, setViewCount] = useState(postData.views)
  const [onlineUsers, setOnlineUsers] = useState(12)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [editingReply, setEditingReply] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest")

  const repliesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new replies occasionally
      if (Math.random() < 0.1) {
        const newReplyData = {
          id: Date.now(),
          author: "John Doe",
          authorAvatar: "/placeholder.svg?height=32&width=32",
          authorTitle: "Software Engineer",
          district: "Freetown",
          verified: false,
          content: "Just joined the discussion! This project looks very promising.",
          timeAgo: "Just now",
          timestamp: new Date().toISOString(),
          likes: 0,
          replies: [],
          isEdited: false,
        }
        setReplies((prev) => [...prev, newReplyData])
      }

      // Simulate typing indicators
      if (Math.random() < 0.3) {
        const users = ["Sarah K.", "David M.", "Lisa T."]
        const randomUser = users[Math.floor(Math.random() * users.length)]
        setTypingUsers((prev) => {
          if (!prev.includes(randomUser)) {
            return [...prev, randomUser]
          }
          return prev
        })

        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((user) => user !== randomUser))
        }, 3000)
      }

      // Update view count
      setViewCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom when new replies are added
  useEffect(() => {
    repliesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [replies])

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 2000)
  }

  const handleSubmitReply = () => {
    if (newReply.trim()) {
      const reply = {
        id: Date.now(),
        author: "Jane Doe", // Current user
        authorAvatar: "/placeholder.svg?height=32&width=32",
        authorTitle: "Entrepreneur",
        district: "Bo",
        verified: true,
        content: newReply,
        timeAgo: "Just now",
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: [],
        isEdited: false,
      }

      if (replyingTo) {
        // Add as nested reply
        setReplies((prev) =>
          prev.map((r) => (r.id === replyingTo ? { ...r, replies: [...(r.replies || []), reply] } : r)),
        )
        setReplyingTo(null)
      } else {
        // Add as top-level reply
        setReplies((prev) => [...prev, reply])
      }

      setNewReply("")
      setIsTyping(false)
    }
  }

  const handleLikeReply = (replyId: number) => {
    setReplies((prev) => prev.map((reply) => (reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply)))
  }

  const handleEditReply = (replyId: number, content: string) => {
    setEditingReply(replyId)
    setEditContent(content)
  }

  const handleSaveEdit = (replyId: number) => {
    setReplies((prev) =>
      prev.map((reply) => (reply.id === replyId ? { ...reply, content: editContent, isEdited: true } : reply)),
    )
    setEditingReply(null)
    setEditContent("")
  }

  const handleDeleteReply = (replyId: number) => {
    setReplies((prev) => prev.filter((reply) => reply.id !== replyId))
  }

  const sortedReplies = [...replies].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      case "popular":
        return b.likes - a.likes
      case "newest":
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/network" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Forum
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{onlineUsers} online</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Live Activity Alert */}
        {typingUsers.length > 0 && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Users className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing...`
                : `${typingUsers.slice(0, -1).join(", ")} and ${typingUsers[typingUsers.length - 1]} are typing...`}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Post */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={postData.authorAvatar || "/placeholder.svg"} alt={postData.author} />
                  <AvatarFallback>
                    {postData.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{postData.author}</h3>
                    {postData.verified && <Badge variant="secondary">Verified</Badge>}
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Online"></div>
                  </div>
                  <p className="text-sm text-gray-600">{postData.authorBio}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {postData.timeAgo}
                    </span>
                    <span>{postData.district}</span>
                    {postData.pinned && (
                      <Badge variant="outline" className="text-xs">
                        <Pin className="w-3 h-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="outline">{postData.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{postData.title}</h1>

            <div className="prose prose-gray max-w-none mb-6">
              {postData.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {postData.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsLiked(!isLiked)
                    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
                  }}
                  className={isLiked ? "text-red-600" : ""}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {likeCount}
                </Button>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4" />
                  {replies.length} replies
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  {viewCount} views
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={isBookmarked ? "text-yellow-600" : ""}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{replyingTo ? "Reply to comment" : "Join the Discussion"}</CardTitle>
              {replyingTo && (
                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                  Cancel Reply
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder={
                    replyingTo ? "Write your reply..." : "Share your thoughts, ask questions, or offer help..."
                  }
                  value={newReply}
                  onChange={(e) => {
                    setNewReply(e.target.value)
                    handleTyping()
                  }}
                  className="min-h-[100px] mb-3"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Be respectful and constructive</p>
                    <Button onClick={handleSubmitReply} disabled={!newReply.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      {replyingTo ? "Reply" : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Replies ({replies.length})</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "popular")}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Liked</option>
              </select>
            </div>
          </div>

          <ScrollArea className="max-h-[800px]">
            {sortedReplies.map((reply, index) => (
              <div key={reply.id}>
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <div className="flex space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} alt={reply.author} />
                        <AvatarFallback>
                          {reply.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{reply.author}</h4>
                            {reply.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-gray-600">{reply.authorTitle}</span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-gray-600">{reply.district}</span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(reply.timestamp)}
                              {reply.isEdited && " (edited)"}
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditReply(reply.id, reply.content)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setReplyingTo(reply.id)}>
                                <Reply className="w-4 h-4 mr-2" />
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteReply(reply.id)} className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {editingReply === reply.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveEdit(reply.id)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingReply(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 mb-4">{reply.content}</p>
                        )}

                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" onClick={() => handleLikeReply(reply.id)}>
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            {reply.likes}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setReplyingTo(reply.id)}>
                            <Reply className="w-4 h-4 mr-2" />
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>

                        {/* Nested Replies */}
                        {reply.replies && reply.replies.length > 0 && (
                          <div className="mt-4 ml-6 space-y-3">
                            {reply.replies.map((nestedReply) => (
                              <div key={nestedReply.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={nestedReply.authorAvatar || "/placeholder.svg"}
                                    alt={nestedReply.author}
                                  />
                                  <AvatarFallback>
                                    {nestedReply.author
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{nestedReply.author}</span>
                                    <span className="text-xs text-gray-500">
                                      {formatTimeAgo(nestedReply.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{nestedReply.content}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Button variant="ghost" size="sm" className="text-xs h-6">
                                      <ThumbsUp className="w-3 h-3 mr-1" />
                                      {nestedReply.likes}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-xs h-6">
                                      <Reply className="w-3 h-3 mr-1" />
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < sortedReplies.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
            <div ref={repliesEndRef} />
          </ScrollArea>
        </div>

        {/* Related Posts */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Related Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <h4 className="font-medium">Mobile money integration challenges</h4>
                  <p className="text-sm text-gray-600">Technology • 6 replies • 2 days ago</p>
                </div>
                <Badge variant="outline">Technology</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <h4 className="font-medium">Sustainable packaging suppliers in Sierra Leone?</h4>
                  <p className="text-sm text-gray-600">General • 15 replies • 1 day ago</p>
                </div>
                <Badge variant="outline">General</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <h4 className="font-medium">Grant writing workshop - sharing my experience</h4>
                  <p className="text-sm text-gray-600">Funding • 8 replies • 5 hours ago</p>
                </div>
                <Badge variant="outline">Funding</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
