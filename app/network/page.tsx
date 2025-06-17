"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Users,
  MessageSquare,
  Search,
  Filter,
  MapPin,
  Building,
  Calendar,
  Star,
  Send,
  Plus,
  ArrowRight,
  Eye,
  ThumbsUp,
  Reply,
  Bookmark,
  Share2,
} from "lucide-react"
import Link from "next/link"

const businessProfiles = [
  {
    id: 1,
    name: "Aminata Kamara",
    business: "AgroTech Solutions",
    type: "Agriculture",
    district: "Bo",
    description: "Developing smart farming solutions for smallholder farmers in Sierra Leone",
    skills: ["Agriculture", "Technology", "IoT", "Data Analytics"],
    lookingFor: ["Tech Partners", "Investors", "Distribution Partners"],
    experience: "5+ years",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    rating: 4.8,
    connections: 45,
    projects: 3,
  },
  {
    id: 2,
    name: "Mohamed Sesay",
    business: "Digital Marketing Pro",
    type: "Services",
    district: "Western Area Urban",
    description: "Helping local businesses grow through digital marketing and e-commerce solutions",
    skills: ["Digital Marketing", "E-commerce", "Social Media", "SEO"],
    lookingFor: ["Clients", "Collaborators", "Mentors"],
    experience: "3+ years",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    rating: 4.6,
    connections: 32,
    projects: 8,
  },
  {
    id: 3,
    name: "Fatima Bangura",
    business: "Eco Fashion SL",
    type: "Manufacturing",
    district: "Kenema",
    description: "Sustainable fashion brand using locally sourced materials and traditional techniques",
    skills: ["Fashion Design", "Sustainability", "Manufacturing", "Export"],
    lookingFor: ["Suppliers", "Retail Partners", "Funding"],
    experience: "2+ years",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: false,
    rating: 4.9,
    connections: 28,
    projects: 2,
  },
  {
    id: 4,
    name: "Ibrahim Turay",
    business: "FinTech Innovations",
    type: "Technology",
    district: "Bo",
    description: "Building mobile payment solutions for rural communities and small businesses",
    skills: ["FinTech", "Mobile Development", "Blockchain", "Financial Services"],
    lookingFor: ["Co-founders", "Investors", "Regulatory Partners"],
    experience: "4+ years",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    rating: 4.7,
    connections: 67,
    projects: 1,
  },
]

const forumCategories = [
  { id: "general", name: "General Discussion", posts: 245, icon: MessageSquare },
  { id: "funding", name: "Funding & Investment", posts: 89, icon: Building },
  { id: "tech", name: "Technology", posts: 156, icon: Users },
  { id: "agriculture", name: "Agriculture", posts: 78, icon: Users },
  { id: "marketing", name: "Marketing & Sales", posts: 134, icon: Users },
  { id: "legal", name: "Legal & Compliance", posts: 67, icon: Users },
]

const forumPosts = [
  {
    id: 1,
    title: "Looking for tech co-founder for AgriTech startup",
    category: "tech",
    author: "Aminata K.",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    district: "Bo",
    content:
      "I'm building an IoT solution for smallholder farmers and looking for a technical co-founder with experience in hardware and mobile development. The solution helps farmers monitor soil conditions and optimize irrigation...",
    tags: ["Co-founder", "AgriTech", "IoT", "Hardware"],
    replies: 12,
    likes: 24,
    views: 156,
    timeAgo: "2 hours ago",
    pinned: true,
  },
  {
    id: 2,
    title: "Grant writing workshop - sharing my experience",
    category: "funding",
    author: "Mohamed S.",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    district: "Western Area Urban",
    content:
      "Just completed a successful grant application for UNDP funding. Happy to share tips and templates with fellow entrepreneurs. Key things I learned: 1) Start early, 2) Focus on impact metrics...",
    tags: ["Grants", "Funding", "Tips", "UNDP"],
    replies: 8,
    likes: 31,
    views: 203,
    timeAgo: "5 hours ago",
    pinned: false,
  },
  {
    id: 3,
    title: "Sustainable packaging suppliers in Sierra Leone?",
    category: "general",
    author: "Fatima B.",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    district: "Kenema",
    content:
      "Looking for local suppliers of eco-friendly packaging materials for my fashion business. Specifically need biodegradable bags and recycled cardboard boxes. Any recommendations?",
    tags: ["Suppliers", "Packaging", "Sustainability", "Fashion"],
    replies: 15,
    likes: 18,
    views: 89,
    timeAgo: "1 day ago",
    pinned: false,
  },
  {
    id: 4,
    title: "Mobile money integration challenges",
    category: "tech",
    author: "Ibrahim T.",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    district: "Bo",
    content:
      "Working on integrating Orange Money and Africell Money APIs into our platform. Has anyone dealt with the regulatory requirements and technical documentation? The process seems complex...",
    tags: ["Mobile Money", "API", "Integration", "FinTech"],
    replies: 6,
    likes: 14,
    views: 67,
    timeAgo: "2 days ago",
    pinned: false,
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Women in Tech Networking Meetup",
    date: "Dec 28, 2024",
    time: "2:00 PM",
    location: "Freetown",
    type: "In-Person",
    attendees: 45,
    category: "Technology",
  },
  {
    id: 2,
    title: "Agricultural Innovation Workshop",
    date: "Jan 5, 2025",
    time: "10:00 AM",
    location: "Bo",
    type: "Hybrid",
    attendees: 32,
    category: "Agriculture",
  },
  {
    id: 3,
    title: "Digital Marketing Masterclass",
    date: "Jan 12, 2025",
    time: "3:00 PM",
    location: "Virtual",
    type: "Online",
    attendees: 78,
    category: "Marketing",
  },
]

export default function NetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDistrict, setSelectedDistrict] = useState("all")
  const [selectedBusinessType, setSelectedBusinessType] = useState("all")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState("")

  const districts = ["Bo", "Western Area Urban", "Kenema", "Kailahun", "Port Loko", "Bombali"]
  const businessTypes = ["Agriculture", "Technology", "Services", "Manufacturing", "Retail"]

  const filteredProfiles = businessProfiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDistrict = selectedDistrict === "all" || profile.district === selectedDistrict
    const matchesType = selectedBusinessType === "all" || profile.type === selectedBusinessType

    return matchesSearch && matchesDistrict && matchesType
  })

  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Business Network</span>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect & Collaborate</h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Find business partners, share knowledge, and grow your network within Sierra Leone's entrepreneurial
            community.
          </p>
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{businessProfiles.length}+</div>
              <div className="text-gray-600">Entrepreneurs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{forumPosts.length}+</div>
              <div className="text-gray-600">Forum Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
              <div className="text-gray-600">Upcoming Events</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="matchmaking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="matchmaking">Business Matchmaking</TabsTrigger>
            <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="my-network">My Network</TabsTrigger>
          </TabsList>

          {/* Business Matchmaking Tab */}
          <TabsContent value="matchmaking" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Find Business Partners
                </CardTitle>
                <CardDescription>
                  Discover entrepreneurs, potential partners, and collaborators in your industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Name, business, skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="business-type">Business Type</Label>
                    <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Profiles */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                          <AvatarFallback>
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{profile.name}</h3>
                            {profile.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{profile.business}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {profile.district}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {profile.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {profile.rating}
                        </div>
                        <div className="text-xs text-gray-500">{profile.connections} connections</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm">{profile.description}</p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills & Expertise</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Looking For</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.lookingFor.map((item) => (
                            <Badge key={item} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href="/messages/new">
                          <Send className="w-4 h-4 mr-2" />
                          Connect
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProfiles.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedDistrict("all")
                      setSelectedBusinessType("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Discussion Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Forum Categories Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedCategory === "all" ? "bg-purple-50 border-r-2 border-purple-600" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">All Posts</span>
                          <span className="text-sm text-gray-500">{forumPosts.length}</span>
                        </div>
                      </button>
                      {forumCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                            selectedCategory === category.id ? "bg-purple-50 border-r-2 border-purple-600" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <category.icon className="w-4 h-4" />
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">{category.posts}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Create Post Button */}
                <Button className="w-full mt-4" asChild>
                  <Link href="/network/forum/create">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Link>
                </Button>
              </div>

              {/* Forum Posts */}
              <div className="lg:col-span-3 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Posts List */}
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                            <AvatarFallback>
                              {post.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{post.author}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{post.district}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{post.timeAgo}</span>
                              {post.pinned && (
                                <Badge variant="secondary" className="text-xs">
                                  Pinned
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 hover:text-purple-600 cursor-pointer">{post.title}</h3>

                      <p className="text-gray-600 mb-3 line-clamp-3">{post.content}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <button className="flex items-center gap-1 hover:text-purple-600">
                            <ThumbsUp className="w-4 h-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-purple-600">
                            <Reply className="w-4 h-4" />
                            {post.replies}
                          </button>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/network/forum/${post.id}`}>
                            View Discussion
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredPosts.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                      <p className="text-gray-600 mb-4">Be the first to start a discussion in this category</p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Networking Events
                </CardTitle>
                <CardDescription>Join events to meet fellow entrepreneurs and expand your network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="border-2 hover:border-purple-200 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Badge variant="outline">{event.category}</Badge>
                          <Badge variant={event.type === "Online" ? "secondary" : "default"}>{event.type}</Badge>
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {event.date} at {event.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            {event.attendees} attending
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1">
                            Register
                          </Button>
                          <Button size="sm" variant="outline">
                            Learn More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create Event */}
            <Card>
              <CardHeader>
                <CardTitle>Host Your Own Event</CardTitle>
                <CardDescription>Organize networking events for your industry or district</CardDescription>
              </CardHeader>
              <CardContent>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Network Tab */}
          <TabsContent value="my-network" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Network Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Connections</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Messages</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Events Attended</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Forum Posts</span>
                      <span className="font-semibold">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Connections */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businessProfiles.slice(0, 3).map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                            <AvatarFallback>
                              {profile.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{profile.name}</div>
                            <div className="text-sm text-gray-600">{profile.business}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/messages">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Connections
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Connections</CardTitle>
                <CardDescription>
                  People you might want to connect with based on your interests and location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {businessProfiles.slice(2, 4).map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                          <AvatarFallback>
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{profile.name}</div>
                          <div className="text-sm text-gray-600">{profile.business}</div>
                          <div className="text-xs text-gray-500">{profile.district}</div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Users className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
