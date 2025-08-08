import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {SelectContent, SelectItem, SelectTrigger, SelectValue, Select} from "@/components/ui/select";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {Building2, Clock, DollarSign, Star, TrendingUp} from "lucide-react";
import {mockRecentActivity, mockUserActivity} from "@/lib/mock-data";
import {useState} from "react";

export const UserActivity = () => {
    const [selectedYear, setSelectedYear] = useState("2024")

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date)
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "application":
                return <DollarSign className="h-4 w-4" />
            case "funding":
                return <TrendingUp className="h-4 w-4" />
            case "registration":
                return <Building2 className="h-4 w-4" />
            case "approval":
                return <Star className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* User Activity Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Active Users</CardTitle>
                            <CardDescription>Monthly active users for {selectedYear}</CardDescription>
                        </div>
                        <Select value={selectedYear} onValueChange={(value: string) => setSelectedYear(value)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer
                        config={{
                            users: {
                                label: "Active Users",
                                color: "hsl(var(--chart-1))",
                            },
                        }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockUserActivity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={{ fill: "#82ca9d" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockRecentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.description}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {activity.user && <p className="text-xs text-muted-foreground">{activity.user}</p>}
                                        <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}