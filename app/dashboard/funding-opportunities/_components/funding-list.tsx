import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    AlertCircle,
    Award,
    Briefcase,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    EuroIcon,
    Globe,
    InfinityIcon,
    Plus,
    Search,
    Target,
    TrendingUp,
    XCircle
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useMemo, useState} from "react";
import {useListOpportunitiesQuery} from "@/hooks/repository/use-funding";
import {fundingTypes} from "@/types/funding";
import {useRouter} from "next/navigation";
import { IfAllowed } from "@/components/auth/IfAllowed";

interface FundingListProps {
    viewType: string;
}

export default function FundingList({ viewType }: FundingListProps) {
    const { data, isLoading } = useListOpportunitiesQuery(viewType)
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const router = useRouter();

    const filteredOpportunities = useMemo(() => {
        return data?.opportunities.filter(opportunity => {
            return opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opportunity.provider?.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [data?.opportunities, searchTerm]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Open":
                return <CheckCircle className="h-4 w-4 text-green-500"/>;
            case "Upcoming":
                return <Clock className="h-4 w-4 text-blue-500"/>;
            case "Closed":
                return <XCircle className="h-4 w-4 text-red-500"/>;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500"/>;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            open: "bg-green-100 text-green-800 border-green-200",
            upcoming: "bg-blue-100 text-blue-800 border-blue-200",
            closed: "bg-red-100 text-red-800 border-red-200"
        };

        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
            </Badge>
        );
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Grant":
                return <Award className="h-4 w-4 text-emerald-600"/>;
            case "Loan":
                return <DollarSign className="h-4 w-4 text-blue-600"/>;
            case "Accelerator":
                return <TrendingUp className="h-4 w-4 text-purple-600"/>;
            case "Pitch_Competition":
                return <Target className="h-4 w-4 text-orange-600"/>;
            case "Venture_Capital":
                return <Globe className="h-4 w-4 text-teal-600"/>;
            case "Angel_Investment":
                return <InfinityIcon className="h-4 w-4 text-green-400"/>;
            case "Crowdfunding":
                return <EuroIcon className="h-4 w-4 text-blue-950"/>;
            default:
                return <Briefcase className="h-4 w-4 text-gray-600"/>;
        }
    };

    const formatAmount = (min: number, max: number, currency: string) => {
        if (min === max) {
            return `${currency} ${min.toLocaleString()}`;
        }
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    };

    const isDeadlineApproaching = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
    };

    return (
        <div>
            {/* Filters and Search */}
            <Card className="border-2 border-slate-100 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search opportunities, providers, or descriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <Building className="h-4 w-4 mr-2"/>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {fundingTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(type)}
                                                <span className="capitalize">{type}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Regular Opportunities */}
            <div className="space-y-4">
                {filteredOpportunities?.length && filteredOpportunities.length > 0 && (
                    <h2 className="text-xl font-semibold">All Opportunities</h2>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOpportunities?.map((opportunity) => (
                        <Card key={opportunity.id}
                              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-slate-100 hover:border-emerald-200">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle
                                            className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
                                            {opportunity.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1 mt-1">
                                            <Building className="h-3 w-3"/>
                                            {opportunity.provider?.name}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge("Open")}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-sm text-slate-600 line-clamp-3">{opportunity.description}</p>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4"/>
                                        <span>Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                                        {isDeadlineApproaching(opportunity.applicationDeadline.toString()) && (
                                            <Badge variant="destructive" className="ml-2">Urgent</Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t">
                                    <Button
                                        onClick={() => window.open(opportunity.applyLink, "_blank")}
                                        size="sm"
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                    >
                                        Apply Now
                                    </Button>
                                    <Button
                                        onClick={() => router.push(`/dashboard/funding-opportunities/${opportunity.id}`)}
                                        variant="outline" size="sm" className="flex-1"
                                    >
                                        Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {filteredOpportunities?.length == 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                        <h3 className="text-lg font-semibold mb-2">No funding opportunities found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : ""}
                        </p>
                        {!searchTerm || statusFilter == "all" || typeFilter === "all" && (
                            <IfAllowed permission={"funding:create"}>
                                <p className="text-muted-foreground mb-4">
                                    Be the first to add a funding opportunity
                                </p>
                            </IfAllowed>
                        )}
                        {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
                            <IfAllowed permission={"funding:create"}>
                                <Button onClick={() => router.push("/dashboard/funding-opportunities/create")}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600">
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Add First Opportunity
                                </Button>
                            </IfAllowed>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}