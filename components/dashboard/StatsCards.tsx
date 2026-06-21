import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, DollarSign, TrendingUp, Users } from "lucide-react";

interface StatsCardProps {
    opportunities: number,
    users: number,
    businesses: number,
    projects?: number,
}

const statDefs = (opportunities: number, users: number, businesses: number, projects?: number) => [
    {
        title: "Total Active Users",
        value: users,
        delta: "15 Registered",
        icon: Users,
    },
    {
        title: "Funding Opportunities",
        value: opportunities,
        delta: "31 Added",
        icon: DollarSign,
    },
    {
        title: "Registered Businesses",
        value: businesses,
        delta: "100 Registered",
        icon: Building2,
    },
    {
        title: "Funded Projects",
        value: projects ?? 89,
        delta: "3 projects",
        icon: TrendingUp,
    },
]

export const StatsCards = ({ opportunities, users, businesses, projects }: StatsCardProps) => {
    const stats = statDefs(opportunities, users, businesses, projects)

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="transition-all duration-200 md:hover:-translate-y-0.5 md:hover:shadow-[var(--shadow-md)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <stat.icon className="h-4 w-4" />
                        </span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold text-foreground [font-family:var(--font-mono)]">
                            {stat.value}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            <span className="font-medium text-[hsl(var(--color-success))]">{stat.delta}</span> this month
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}