"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  BookOpen,
  DollarSign,
  Scale,
  TrendingUp,
  FileText,
  Download,
  Bookmark,
  Filter,
  Clock,
  Star,
  Eye,
} from "lucide-react"
import { ResourcePreview } from "@/components/resources/resource-preview"
import {Resource} from "@/lib/database";
import {generateId} from "@/lib/database/comprehensive-db";

const categories = [
  { id: "finance", name: "Finance", icon: DollarSign, count: 45 },
  { id: "marketing", name: "Marketing", icon: TrendingUp, count: 32 },
  { id: "legal", name: "Legal", icon: Scale, count: 28 },
  { id: "innovation", name: "Innovation", icon: BookOpen, count: 38 },
  { id: "compliance", name: "Compliance", icon: FileText, count: 22 },
]

const resources: Resource[] = [
  {
    id: generateId(),
    title: "Business Plan Template for SMEs",
    category: "finance",
    type: "Template",
    description: "Comprehensive business plan template specifically designed for Sierra Leone SMEs",
    downloads: 1250,
    rating: 4.8,
    featured: true,
    tags: ["Business Plan", "Template", "SME"],
    fileUrl: "/resources/business-plan-template.docx",
    uploadedBy: "teyutqw65qw765",
    uploadedAt: new Date(),
    fileSize: 0,
    mimeType: "application/msword",
    fileFormat: "docx",
    isRestricted: false,
    accessLevel: "public",
    views: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: "Digital Marketing Guide for Local Businesses",
    category: "marketing",
    type: "Guide",
    description: "Step-by-step guide to digital marketing strategies that work in Sierra Leone",
    downloads: 890,
    rating: 4.6,
    featured: true,
    tags: ["Digital Marketing", "Social Media", "Local Business"],
    fileUrl: "/resources/digital-marketing-guide.pdf",
    uploadedBy: "aaas",
    uploadedAt: new Date(),
    fileSize: 0,
    mimeType: "application/pdf",
    fileFormat: "pdf",
    isRestricted: false,
    accessLevel: "public",
    views: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: "Tax Compliance Checklist 2024",
    category: "legal",
    type: "Checklist",
    description: "Updated checklist for tax compliance requirements for businesses in Sierra Leone",
    downloads: 675,
    rating: 4.7,
    featured: false,
    tags: ["Tax", "Compliance", "2024"],
    fileUrl: "",
    uploadedBy: "",
    uploadedAt: new Date(),
    fileSize: 0,
    mimeType: "application/pdf",
    fileFormat: "pdf",
    isRestricted: false,
    accessLevel: "public",
    views: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: "Grant Application Writing Workshop",
    category: "finance",
    type: "Video Course",
    description: "Learn how to write compelling grant applications with real examples",
    downloads: 445,
    rating: 4.9,
    featured: true,
    tags: ["Grants", "Funding", "Writing"],
    fileUrl: "",
    uploadedBy: "",
    uploadedAt: new Date(),
    fileSize: 0,
    mimeType: "application/msword",
    fileFormat: "docx",
    isRestricted: false,
    accessLevel: "public",
    views: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: "Innovation Framework for Tech Startups",
    category: "innovation",
    type: "Framework",
    description: "Structured approach to innovation for technology startups in West Africa",
    downloads: 320,
    rating: 4.5,
    featured: false,
    tags: ["Innovation", "Tech", "Startups"],
    fileUrl: "",
    uploadedBy: "",
    uploadedAt: new Date(),
    fileSize: 0,
    mimeType: "application/msword",
    fileFormat: "docx",
    isRestricted: false,
    accessLevel: "public",
    views: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: "Licensing Requirements Guide",
    category: "compliance",
    type: "Guide",
    description: "Complete guide to business licensing requirements across all districts",
    downloads: 580,
    rating: 4.4,
    featured: false,
    tags: ["Licensing", "Requirements", "Districts"],
    fileUrl: "",
    uploadedBy: "",
    uploadedAt: new Date(),
    fileSize: 0,
    mimeType: "application/msword",
    fileFormat: "docx",
    isRestricted: false,
    accessLevel: "public",
    views: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
]

const fundingOpportunities = [
  {
    title: "UNDP SME Growth Fund",
    amount: "$50,000 - $200,000",
    deadline: "January 15, 2025",
    type: "Grant",
    status: "Open",
    eligibility: "SMEs with 2+ years operation",
  },
  {
    title: "Women Entrepreneurs Support Grant",
    amount: "$5,000 - $25,000",
    deadline: "December 30, 2024",
    type: "Grant",
    status: "Closing Soon",
    eligibility: "Women-led businesses",
  },
  {
    title: "Youth Innovation Challenge",
    amount: "$10,000 - $50,000",
    deadline: "February 28, 2025",
    type: "Competition",
    status: "Open",
    eligibility: "Entrepreneurs under 35",
  },
]

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([])
  const [previewResource, setPreviewResource] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleBookmark = (resourceId: string) => {
    setBookmarkedItems((prev) =>
      prev.includes(resourceId) ? prev.filter((id) => id !== resourceId) : [...prev, resourceId],
    )
  }

  const handlePreviewResource = (resource: any) => {
    setPreviewResource(resource)
    setIsPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setPreviewResource(null)
  }

  const handleResourceDownload = (resource: any) => {
    console.log("Downloaded:", resource.title)
    // The download is handled within the preview component
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Resource Library</span>
          </div>
          <Button variant="outline" asChild>
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resources, guides, templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Resources
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            {/*<TabsTrigger value="funding">Funding</TabsTrigger>*/}
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            {/* Featured Resources */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources
                  .filter((r) => r.featured)
                  .map((resource) => (
                    <Card key={resource.id} className="border-2 border-emerald-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary">{resource.type}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(resource.id)}
                            className={bookmarkedItems.includes(resource.id) ? "text-yellow-600" : "text-gray-400"}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              {resource.downloads}
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {resource.rating}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => handlePreviewResource(resource)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button onClick={() => handlePreviewResource(resource)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* All Resources */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All Resources ({filteredResources.length})</h2>
              <div className="grid gap-4">
                {filteredResources.map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary">{resource.type}</Badge>
                            {resource.featured && <Badge variant="default">Featured</Badge>}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                          <p className="text-gray-600 mb-3">{resource.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              {resource.downloads} downloads
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {resource.rating}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(resource.id)}
                            className={bookmarkedItems.includes(resource.id) ? "text-yellow-600" : "text-gray-400"}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handlePreviewResource(resource)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button size="sm" onClick={() => handlePreviewResource(resource)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Bookmarks ({bookmarkedItems.length})</h2>
              {bookmarkedItems.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
                    <p className="text-gray-600 mb-4">Start bookmarking resources to access them quickly later</p>
                    <Button onClick={() => setSelectedCategory("all")}>Browse Resources</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {resources
                    .filter((resource) => bookmarkedItems.includes(resource.id))
                    .map((resource) => (
                      <Card key={resource.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="secondary">{resource.type}</Badge>
                                {resource.featured && <Badge variant="default">Featured</Badge>}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                              <p className="text-gray-600 mb-3">{resource.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Download className="w-4 h-4 mr-1" />
                                  {resource.downloads} downloads
                                </div>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                  {resource.rating}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleBookmark(resource.id)}
                                className="text-yellow-600"
                              >
                                <Bookmark className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handlePreviewResource(resource)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                              <Button size="sm" onClick={() => handlePreviewResource(resource)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {previewResource && (
          <ResourcePreview
            resource={previewResource}
            isOpen={isPreviewOpen}
            onCloseAction={handleClosePreview}
            onDownloadAction={handleResourceDownload}
          />
        )}
      </div>
    </div>
  )
}
