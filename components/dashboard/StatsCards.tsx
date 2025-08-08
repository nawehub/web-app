import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Building2, DollarSign, TrendingUp, Users} from "lucide-react";

const stats = [
    {
        title: "Total Active Users",
        value: "2,847",
        change: 12.5,
        icon: Users
    },
    {
        title: "Funding Opportunities",
        value: "156",
        change: 8.2,
        icon: DollarSign
    },
    {
        title: "Registered Businesses",
        value: "1,234",
        change: 15.3,
        icon: Building2
    },
    {
        title: "Funded Projects",
        value: "89",
        change: 23.1,
        icon: TrendingUp
    }
]

export const StatsCards = () => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
                <Card key={idx} className={"transition-all duration-200 hover:scale-[1.02]"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+{stat.change}%</span> this month
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}