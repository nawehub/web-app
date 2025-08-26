import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Building2, DollarSign, TrendingUp, Users} from "lucide-react";

interface StatsCardProps {
    opportunities: number,
     users: number,
     businesses: number,
     projects?: number,
}

export const StatsCards = ({opportunities, users, businesses, projects}: StatsCardProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className={"transition-all duration-200 hover:scale-[1.02]"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{users}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">15 Registered</span> this month
                    </p>
                </CardContent>
            </Card>
            <Card className={"transition-all duration-200 hover:scale-[1.02]"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Funding Opportunities</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{opportunities}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">31 Added</span> this month
                    </p>
                </CardContent>
            </Card>
            <Card className={"transition-all duration-200 hover:scale-[1.02]"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Registered Businesses</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{businesses}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">100 Registered</span> this month
                    </p>
                </CardContent>
            </Card>
            <Card className={"transition-all duration-200 hover:scale-[1.02]"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Funded Projects</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{projects || 89}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">3 projects</span> this month
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}