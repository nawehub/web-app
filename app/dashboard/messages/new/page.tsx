"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Search, Send, Users, Building, MapPin } from "lucide-react"
import Link from "next/link"

const connections = [
  {
    id: 1,
    name: "Mohamed Sesay",
    avatar: "/placeholder.svg?height=40&width=40",
    business: "Digital Marketing Pro",
    type: "Services",
    district: "Western Area Urban",
    verified: true,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Fatima Bangura",
    avatar: "/placeholder.svg?height=40&width=40",
    business: "Eco Fashion SL",
    type: "Manufacturing",
    district: "Kenema",
    verified: false,
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Ibrahim Turay",
    avatar: "/placeholder.svg?height=40&width=40",
    business: "FinTech Innovations",
    type: "Technology",
    district: "Bo",
    verified: true,
    lastActive: "Online",
  },
  {
    id: 4,
    name: "Aminata Kamara",
    avatar: "/placeholder.svg?height=40&width=40",
    business: "AgroTech Solutions",
    type: "Agriculture",
    district: "Bo",
    verified: true,
    lastActive: "3 days ago",
  },
  {
    id: 5,
    name: "Sahr Conteh",
    avatar: "/placeholder.svg?height=40&width=40",
    business: "Solar Energy SL",
    type: "Technology",
    district: "Port Loko",
    verified: false,
    lastActive: "1 week ago",
  },
]

export default function NewMessagePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"individual" | "group">("individual")

  const filteredConnections = connections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.district.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRecipientToggle = (connectionId: number) => {
    setSelectedRecipients((prev) =>
      prev.includes(connectionId) ? prev.filter((id) => id !== connectionId) : [...prev, connectionId],
    )
  }

  const handleSendMessage = () => {
    if (selectedRecipients.length > 0 && message.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message to:", selectedRecipients)
      console.log("Subject:", subject)
      console.log("Message:", message)
      // Redirect to messages page or show success message
    }
  }

  const selectedConnectionsData = connections.filter((conn) => selectedRecipients.includes(conn.id))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/messages" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Messages
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">New Message</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recipients Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Select Recipients
                </CardTitle>
                <CardDescription>Choose from your connections to start a conversation</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Message Type Toggle */}
                <div className="flex gap-4 mb-6">
                  <Button
                    variant={messageType === "individual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMessageType("individual")}
                  >
                    Individual Message
                  </Button>
                  <Button
                    variant={messageType === "group" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMessageType("group")}
                  >
                    Group Message
                  </Button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search your connections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Connections List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedRecipients.includes(connection.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (messageType === "individual") {
                          setSelectedRecipients([connection.id])
                        } else {
                          handleRecipientToggle(connection.id)
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedRecipients.includes(connection.id)}
                        onChange={() => handleRecipientToggle(connection.id)}
                        className="pointer-events-none"
                      />
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                        <AvatarFallback>
                          {connection.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{connection.name}</h3>
                          {connection.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{connection.business}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {connection.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {connection.district}
                          </span>
                          <span>Last active: {connection.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredConnections.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No connections found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search or connect with more entrepreneurs</p>
                    <Button asChild>
                      <Link href="/network">Find Connections</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Composition */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>
                  {selectedRecipients.length === 0
                    ? "Select recipients to start composing"
                    : `Sending to ${selectedRecipients.length} ${
                        selectedRecipients.length === 1 ? "person" : "people"
                      }`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Recipients */}
                {selectedRecipients.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">To:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedConnectionsData.map((connection) => (
                        <Badge key={connection.id} variant="secondary" className="flex items-center gap-1">
                          {connection.name}
                          <button
                            onClick={() => handleRecipientToggle(connection.id)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject (for group messages) */}
                {messageType === "group" && selectedRecipients.length > 1 && (
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter message subject..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>

                {/* Quick Templates */}
                <div>
                  <Label className="text-sm font-medium">Quick Templates:</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setMessage(
                          "Hi! I saw your profile and I'm interested in discussing a potential business collaboration. Would you be available for a brief call this week?",
                        )
                      }
                    >
                      Partnership Inquiry
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setMessage(
                          "Hello! I noticed we're both in the same industry and district. I'd love to connect and share experiences. Are you interested in meeting for coffee?",
                        )
                      }
                    >
                      Networking Request
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setMessage(
                          "Hi! I have some experience in your industry and would be happy to share insights or answer any questions you might have. Feel free to reach out!",
                        )
                      }
                    >
                      Mentorship Offer
                    </Button>
                  </div>
                </div>

                {/* Send Button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={selectedRecipients.length === 0 || !message.trim()}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>

                {/* Tips */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Messaging Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be clear about your purpose</li>
                    <li>• Mention specific interests or connections</li>
                    <li>• Keep initial messages concise</li>
                    <li>• Be professional and respectful</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
