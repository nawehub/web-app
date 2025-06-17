"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Send, Plus, X, ImageIcon, Paperclip, Hash } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: "general", name: "General Discussion" },
  { id: "funding", name: "Funding & Investment" },
  { id: "tech", name: "Technology" },
  { id: "agriculture", name: "Agriculture" },
  { id: "marketing", name: "Marketing & Sales" },
  { id: "legal", name: "Legal & Compliance" },
]

const suggestedTags = [
  "Co-founder",
  "Partnership",
  "Funding",
  "Grants",
  "Technology",
  "Agriculture",
  "Marketing",
  "Legal",
  "Compliance",
  "Innovation",
  "Startup",
  "SME",
  "Networking",
  "Mentorship",
  "Investment",
  "Business Plan",
]

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [allowComments, setAllowComments] = useState(true)

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    if (title.trim() && content.trim() && category) {
      // Here you would typically submit to your backend
      console.log({
        title,
        content,
        category,
        tags,
        isPinned,
        isAnonymous,
        allowComments,
      })
      // Redirect to the new post or forum
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/network" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Forum
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Create New Discussion</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Start a Discussion</CardTitle>
                <CardDescription>
                  Share your thoughts, ask questions, or start a conversation with the community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Discussion Title *</Label>
                  <Input
                    id="title"
                    placeholder="What would you like to discuss?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Be specific and descriptive. Good titles get more engagement.
                  </p>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, provide context, ask specific questions..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 min-h-[200px]"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Add Image
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach File
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">{content.length}/5000 characters</p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="mt-2">
                    {/* Current Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            #{tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Add New Tag */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddTag(newTag)
                            }
                          }}
                          className="pl-10"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddTag(newTag)}
                        disabled={!newTag.trim() || tags.length >= 10}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Suggested Tags */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags
                          .filter((tag) => !tags.includes(tag))
                          .slice(0, 8)
                          .map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleAddTag(tag)}
                              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              #{tag}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="comments" checked={allowComments} onCheckedChange={(checked) => setAllowComments} />
                    <Label htmlFor="comments" className="text-sm">
                      Allow comments and replies
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous} />
                    <Label htmlFor="anonymous" className="text-sm">
                      Post anonymously
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pinned" checked={isPinned} onCheckedChange={(checked) => setIsPinned} />
                    <Label htmlFor="pinned" className="text-sm">
                      Pin this discussion (moderators only)
                    </Label>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !content.trim() || !category}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Discussion
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/network">Cancel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discussion Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Be respectful and professional</li>
                  <li>• Stay on topic and provide value</li>
                  <li>• Use clear, descriptive titles</li>
                  <li>• Add relevant tags for discoverability</li>
                  <li>• Search existing discussions first</li>
                  <li>• Include context and specific details</li>
                </ul>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Tips for Great Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900">Ask Specific Questions</h4>
                    <p className="text-gray-600">
                      Instead of "Need help with marketing," try "What's the best social media platform for reaching
                      farmers in Bo District?"
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Share Context</h4>
                    <p className="text-gray-600">
                      Include your industry, location, and business stage to get more relevant responses.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Use Tags Wisely</h4>
                    <p className="text-gray-600">Add 3-5 relevant tags to help others find your discussion.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium">Grant writing workshop</h4>
                    <p className="text-gray-600">8 replies • 2 hours ago</p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium">Mobile money integration</h4>
                    <p className="text-gray-600">6 replies • 4 hours ago</p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium">Sustainable packaging suppliers</h4>
                    <p className="text-gray-600">15 replies • 1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
