import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {mockFundingOpportunities} from "@/lib/mock-data";
import {useListOpportunitiesQuery} from "@/hooks/repository/use-funding";
import {formatDate, FundingOpportunityDto} from "@/types/funding";
import {Dispatch, SetStateAction, useEffect} from "react";

interface FundingOpportunitiesProps {
    setOpportunities: Dispatch<SetStateAction<FundingOpportunityDto[]>>
}

export const FeaturedOpportunities = ({ setOpportunities }: FundingOpportunitiesProps) => {
    const { data, isLoading } = useListOpportunitiesQuery()

    useEffect(() => {
        setOpportunities(data?.opportunities || [])
    }, [ data, setOpportunities])

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount)
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
                                View All <ArrowUpRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data?.opportunities.map((opportunity) => (
                            <Card key={opportunity.id}
                                  className="flex flex-col justify-between hover:shadow-md transition-shadow"
                            >
                                <CardDescription>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <Badge variant='default'>
                                                Open
                                            </Badge>
                                            <Button variant="link" onClick={() => window.open(opportunity.applyLink)}>Apply Now</Button>
                                        </div>
                                        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                                        <CardDescription
                                            className="line-clamp-2">{opportunity.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Amount:</span>
                                                <span className="font-medium">
                                                    {formatCurrency(opportunity.amountMin, "SLE")} -{" "}
                                                                            {formatCurrency(opportunity.amountMax, "SLE")}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Deadline:</span>
                                                <span
                                                    className="font-medium">{formatDate(opportunity.applicationDeadline.toLocaleString())}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Provider:</span>
                                                <span className="font-medium">{opportunity.provider?.name}</span>
                                            </div>
                                        </div>
                                        {/*<div className="flex flex-wrap gap-1 mt-3">*/}
                                        {/*    {opportunity.tags.slice(0, 2).map((tag) => (*/}
                                        {/*        <Badge key={tag} variant="secondary" className="text-xs">*/}
                                        {/*            {tag}*/}
                                        {/*        </Badge>*/}
                                        {/*    ))}*/}
                                        {/*    {opportunity.tags.length > 2 && (*/}
                                        {/*        <Badge variant="secondary" className="text-xs">*/}
                                        {/*            +{opportunity.tags.length - 2}*/}
                                        {/*        </Badge>*/}
                                        {/*    )}*/}
                                        {/*</div>*/}
                                        {/*<Link href={`/dashboard/funding-opportunities/${opportunity.id}`}>
                                        <Button className="w-full mt-4" size="sm">
                                            View Details
                                        </Button>
                                    </Link>*/}
                                    </CardContent>
                                </CardDescription>
                                <CardFooter>
                                    <Link className="w-full"
                                          href={`/dashboard/funding-opportunities/${opportunity.id}`}>
                                        <Button className="w-full mt-4" size="sm">
                                            View Details
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}