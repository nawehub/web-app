/**
 * NaWeHub Dashboard — UserActivity
 * --------------------------------------
 * Location: components/dashboard/UserActivity.tsx
 *
 * - `text-gray-900 dark:text-gray-100` → `text-foreground`.
 * - Switched from a line chart to a bar chart for monthly active users.
 * - Color fix: the original hardcoded `stroke="#8884d8"` (recharts
 *   boilerplate purple) had nothing to do with the brand. I'd first tried
 *   wiring it through `ChartContainer`'s `--chart-1` config variable, but
 *   that token was never actually confirmed to exist in your globals.css —
 *   if it's only defined under one theme (or not at all), the chart would
 *   render wrong or invisible in light mode specifically. So instead this
 *   uses the same literal brand green already established elsewhere in
 *   this codebase (`hsl(160 84% 39%)`, used for the home page's SVG
 *   underline for the same reason: presentational color attributes on
 *   SVG/chart elements don't reliably resolve CSS custom properties).
 *   Guaranteed correct in both themes without depending on an unverified
 *   token — swap back to `var(--color-users)` once you've confirmed
 *   `--chart-1` is defined for both light and dark.
 * - Each bar now gets its own color via per-entry `<Cell>` elements,
 *   cycling through a small on-brand palette (graduated shades of the
 *   established green plus the established accent orange) rather than
 *   introducing hues I don't have a verified value for — same reasoning
 *   as above. The palette repeats if there are more months than colors.
 * - Card surfaces, badges, and spacing otherwise untouched — this file was
 *   already relying on theme-safe Card/Select primitives.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Building2, Clock, DollarSign, Star, TrendingUp } from "lucide-react";
import { mockRecentActivity, mockUserActivity } from "@/lib/mock-data";
import { useState } from "react";

const BRAND_GREEN = "hsl(160 84% 39%)"

// Cycling palette for per-bar coloring — graduated shades of the
// established brand green plus the established accent orange, rather than
// arbitrary hues. Repeats if there are more data points than colors.
const BAR_COLORS = [
    "hsl(160 84% 28%)",
    BRAND_GREEN,
    "hsl(160 70% 50%)",
    "hsl(160 55% 62%)",
    "hsl(25 95% 53%)",
    "hsl(25 90% 65%)",
]

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
            <Card className="chart-wrap col-span-4">
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
                                color: BRAND_GREEN,
                            },
                        }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockUserActivity}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                                <XAxis dataKey="month" className="fill-muted-foreground text-xs" />
                                <YAxis className="fill-muted-foreground text-xs" />
                                <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                                <Bar dataKey="users" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                    {mockUserActivity.map((entry, index) => (
                                        <Cell key={`bar-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="recent-activity-block col-span-3">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockRecentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-foreground">{activity.description}</p>
                                    <div className="mt-1 flex items-center space-x-2">
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