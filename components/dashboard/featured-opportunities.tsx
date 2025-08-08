import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {mockFundingOpportunities} from "@/lib/mock-data";

export const FeaturedOpportunities = () => {
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date)
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Featured Funding Opportunities</CardTitle>
                            <CardDescription>Highlighted opportunities for businesses</CardDescription>
                        </div>
                        <Link href="/dashboard/funding-opportunities">
                            <Button variant="outline" size="sm">
                                View All <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mockFundingOpportunities.map((opportunity) => (
                            <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <Badge variant={opportunity.status === "Open" ? "default" : "secondary"}>
                                            {opportunity.status}
                                        </Badge>
                                        <Badge variant="outline">{opportunity.type}</Badge>
                                    </div>
                                    <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{opportunity.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Amount:</span>
                                            <span className="font-medium">
                        {formatCurrency(opportunity.amountMin, opportunity.currency)} -{" "}
                                                {formatCurrency(opportunity.amountMax, opportunity.currency)}
                      </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Deadline:</span>
                                            <span className="font-medium">{formatDate(opportunity.applicationDeadline)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Provider:</span>
                                            <span className="font-medium">{opportunity.provider?.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {opportunity.tags.slice(0, 2).map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                        {opportunity.tags.length > 2 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{opportunity.tags.length - 2}
                                            </Badge>
                                        )}
                                    </div>
                                    <Link href={`/dashboard/funding-opportunities/${opportunity.id}`}>
                                        <Button className="w-full mt-4" size="sm">
                                            View Details
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}