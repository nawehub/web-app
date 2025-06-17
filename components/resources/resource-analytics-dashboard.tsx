"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, Eye, TrendingUp, Users, FileText, Star } from "lucide-react"
import type { Resource } from "@/lib/database/types"
import { comprehensiveDb } from "@/lib/database/comprehensive-db"
import { useAuth } from "@/lib/auth/auth-context"
import { formatDistanceToNow } from "date-fns"

interface ResourceAnalyticsDashboardProps {
  resources: Resource[]
}

export function ResourceAnalyticsDashboard({ resources }: ResourceAnalyticsDashboardProps) {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>({})
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  useEffect(() => {
    if (resources.length > 0) {
      const analyticsData: any = {}
      resources.forEach((resource) => {
        analyticsData[resource.id] = comprehensiveDb.getResourceAnalytics(resource.id)
      })
      setAnalytics(analyticsData)
      setSelectedResource(resources[0])
    }
  }, [resources])

  const getTotalStats = () => {
    const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0)
    const totalViews = resources.reduce((sum, r) => sum + r.views.length, 0)
    const totalResources = resources.length
    const avgRating = resources.length > 0 ? resources.reduce((sum, r) => sum + r.rating, 0) / resources.length : 0

    return { totalDownloads, totalViews, totalResources, avgRating }
  }

  const getTopResources = () => {
    return [...resources]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 5)
      .map((resource) => ({
        name: resource.title.length > 30 ? resource.title.substring(0, 30) + "..." : resource.title,
        downloads: resource.downloads,
        views: resource.views.length,
      }))
  }

  const getResourceTypeDistribution = () => {
    const typeCount: Record<string, number> = {}
    resources.forEach((resource) => {
      typeCount[resource.type] = (typeCount[resource.type] || 0) + 1
    })

    return Object.entries(typeCount).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: Math.round((count / resources.length) * 100),
    }))
  }

  const stats = getTotalStats()
  const topResources = getTopResources()
  const typeDistribution = getResourceTypeDistribution()

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"]

  if (!user || resources.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Yet</h3>
          <p className="text-gray-600 mb-4">Create your first resource to see analytics</p>
          <Button>Create Resource</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads.toLocaleString()}</p>
              </div>
              <Download className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Resources Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Resources</CardTitle>
                <CardDescription>Resources by download count</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topResources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="downloads" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resource Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Type Distribution</CardTitle>
                <CardDescription>Breakdown by resource type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Individual Resource Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Performance</CardTitle>
              <CardDescription>Detailed analytics for each resource</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources.map((resource) => {
                  const resourceAnalytics = analytics[resource.id] || {}
                  const conversionRate =
                    resourceAnalytics.totalViews > 0
                      ? Math.round((resourceAnalytics.totalDownloads / resourceAnalytics.totalViews) * 100)
                      : 0

                  return (
                    <div key={resource.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{resource.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{resource.type}</Badge>
                            <Badge variant="outline">{resource.fileFormat.toUpperCase()}</Badge>
                            {resource.featured && <Badge>Featured</Badge>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            Created {formatDistanceToNow(resource.createdAt, { addSuffix: true })}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Views</div>
                          <div className="font-semibold">{resourceAnalytics.totalViews || 0}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Downloads</div>
                          <div className="font-semibold">{resource.downloads}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Conversion Rate</div>
                          <div className="font-semibold">{conversionRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Rating</div>
                          <div className="font-semibold flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {resource.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {selectedResource && analytics[selectedResource.id] && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics: {selectedResource.title}</CardTitle>
                <CardDescription>In-depth analytics for this resource</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Detailed stats for selected resource */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{analytics[selectedResource.id].totalViews}</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Download className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{analytics[selectedResource.id].totalDownloads}</div>
                      <div className="text-sm text-gray-600">Downloads</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{analytics[selectedResource.id].uniqueViewers}</div>
                      <div className="text-sm text-gray-600">Unique Viewers</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {analytics[selectedResource.id].totalViews > 0
                          ? Math.round(
                              (analytics[selectedResource.id].totalDownloads /
                                analytics[selectedResource.id].totalViews) *
                                100,
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-semibold mb-3">Recent Activity</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {analytics[selectedResource.id].recentActivity.map((activity: any, index: number) => {
                        const activityUser = comprehensiveDb.getUser(activity.userId)
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                activity.type === "download" ? "bg-green-500" : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <span className="text-sm">
                                <strong>{activityUser?.name || "Unknown User"}</strong>{" "}
                                {activity.type === "download" ? "downloaded" : "viewed"} this resource
                              </span>
                              <div className="text-xs text-gray-500">
                                {formatDistanceToNow(activity.date, { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
