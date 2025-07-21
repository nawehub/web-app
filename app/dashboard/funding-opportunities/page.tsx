"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
    DollarSign,
    Plus,
    Search,
    Filter,
    Calendar,
    Building,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    Users,
    Globe,
    Award,
    Briefcase,
    Target
} from "lucide-react";

interface FundingOpportunity {
    id: string;
    title: string;
    description: string;
    providerId: string;
    amountMin: number;
    amountMax: number;
    currency: string;
    applicationDeadline: string;
    status: 'open' | 'closed' | 'upcoming';
    type: 'grant' | 'loan' | 'equity' | 'competition' | 'subsidy';
    eligibilitySummary: string;
    isFeatured: boolean;
}

const initialOpportunities: FundingOpportunity[] = [
    {
        id: "1",
        title: "Women Entrepreneurs Growth Fund",
        description: "Supporting women-led SMEs across Sierra Leone with growth capital and business development support. Focus on technology, agriculture, and manufacturing sectors.",
        providerId: "World Bank",
        amountMin: 50000,
        amountMax: 500000,
        currency: "Le",
        applicationDeadline: "2025-03-15",
        status: "open",
        type: "grant",
        eligibilitySummary: "Women-owned businesses, operational for 2+ years, revenue >Le 10M annually",
        isFeatured: true
    },
    {
        id: "2",
        title: "Youth Innovation Challenge",
        description: "Annual competition for young entrepreneurs developing innovative solutions to local challenges. Includes mentorship and incubation support.",
        providerId: "UNDP Sierra Leone",
        amountMin: 25000,
        amountMax: 150000,
        currency: "Le",
        applicationDeadline: "2025-02-28",
        status: "open",
        type: "competition",
        eligibilitySummary: "Entrepreneurs aged 18-35, innovative business model, social impact focus",
        isFeatured: true
    },
    {
        id: "3",
        title: "Agricultural Modernization Loan",
        description: "Low-interest loans for agricultural businesses looking to modernize equipment and expand operations. Includes technical assistance.",
        providerId: "AfDB",
        amountMin: 100000,
        amountMax: 2000000,
        currency: "Le",
        applicationDeadline: "2025-04-30",
        status: "open",
        type: "loan",
        eligibilitySummary: "Agricultural businesses, collateral required, 3+ years operational history",
        isFeatured: false
    },
    {
        id: "4",
        title: "Tech Startup Equity Fund",
        description: "Equity investment for early-stage technology startups with high growth potential. Includes access to international markets.",
        providerId: "IFC",
        amountMin: 200000,
        amountMax: 1000000,
        currency: "USD",
        applicationDeadline: "2025-01-31",
        status: "upcoming",
        type: "equity",
        eligibilitySummary: "Technology startups, scalable business model, experienced team",
        isFeatured: false
    },
    {
        id: "5",
        title: "Green Energy Subsidy Program",
        description: "Government subsidies for businesses investing in renewable energy solutions and sustainable practices.",
        providerId: "Ministry of Energy",
        amountMin: 30000,
        amountMax: 300000,
        currency: "Le",
        applicationDeadline: "2025-05-15",
        status: "closed",
        type: "subsidy",
        eligibilitySummary: "All business sizes, renewable energy focus, environmental impact assessment required",
        isFeatured: false
    }
];

const fundingTypes = ["grant", "loan", "equity", "competition", "subsidy"];
const currencies = ["Le", "USD", "EUR", "GBP"];
const providers = [
    "World Bank", "UNDP Sierra Leone", "AfDB", "IFC", "USAID", "EU", "DFID",
    "Ministry of Energy", "Ministry of Trade", "Bank of Sierra Leone", "Private Investors"
];

export default function FundingOpportunitiesPage() {
    const [opportunities, setOpportunities] = useState<FundingOpportunity[]>(initialOpportunities);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { toast } = useToast();

    // New opportunity form state
    const [newOpportunity, setNewOpportunity] = useState({
        title: "",
        description: "",
        providerId: "",
        amountMin: "",
        amountMax: "",
        currency: "Le",
        applicationDeadline: "",
        status: "open" as const,
        type: "grant" as const,
        eligibilitySummary: "",
        isFeatured: false
    });

    const filteredOpportunities = useMemo(() => {
        return opportunities.filter(opportunity => {
            const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opportunity.providerId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || opportunity.status === statusFilter;
            const matchesType = typeFilter === "all" || opportunity.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [opportunities, searchTerm, statusFilter, typeFilter]);

    const featuredOpportunities = filteredOpportunities.filter(opp => opp.isFeatured);
    const regularOpportunities = filteredOpportunities.filter(opp => !opp.isFeatured);

    const handleCreateOpportunity = () => {
        if (!newOpportunity.title || !newOpportunity.description || !newOpportunity.providerId) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        const opportunity: FundingOpportunity = {
            id: Date.now().toString(),
            ...newOpportunity,
            amountMin: parseInt(newOpportunity.amountMin) || 0,
            amountMax: parseInt(newOpportunity.amountMax) || 0,
        };

        setOpportunities([opportunity, ...opportunities]);
        setNewOpportunity({
            title: "",
            description: "",
            providerId: "",
            amountMin: "",
            amountMax: "",
            currency: "Le",
            applicationDeadline: "",
            status: "open",
            type: "grant",
            eligibilitySummary: "",
            isFeatured: false
        });
        setIsSheetOpen(false);

        toast({
            title: "Opportunity Created",
            description: "The funding opportunity has been successfully added."
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "open":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "upcoming":
                return <Clock className="h-4 w-4 text-blue-500" />;
            case "closed":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
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
            case "grant":
                return <Award className="h-4 w-4 text-emerald-600" />;
            case "loan":
                return <DollarSign className="h-4 w-4 text-blue-600" />;
            case "equity":
                return <TrendingUp className="h-4 w-4 text-purple-600" />;
            case "competition":
                return <Target className="h-4 w-4 text-orange-600" />;
            case "subsidy":
                return <Globe className="h-4 w-4 text-teal-600" />;
            default:
                return <Briefcase className="h-4 w-4 text-gray-600" />;
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
        <div className="space-y-6 py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Funding Opportunities
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Discover grants, loans, and investment opportunities for your business
                    </p>
                </div>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Opportunity
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold">Add Funding Opportunity</SheetTitle>
                            <SheetDescription>
                                Create a new funding opportunity for entrepreneurs
                            </SheetDescription>
                        </SheetHeader>

                        <Tabs defaultValue="basic" className="w-full mt-6">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                                <TabsTrigger value="details">Details & Eligibility</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4 mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Opportunity Title *</Label>
                                    <Input
                                        id="title"
                                        value={newOpportunity.title}
                                        onChange={(e) => setNewOpportunity({...newOpportunity, title: e.target.value})}
                                        placeholder="Enter opportunity title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <textarea
                                        id="description"
                                        value={newOpportunity.description}
                                        onChange={(e) => setNewOpportunity({...newOpportunity, description: e.target.value})}
                                        placeholder="Describe the funding opportunity"
                                        className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="providerId">Provider *</Label>
                                        <Select
                                            value={newOpportunity.providerId}
                                            onValueChange={(value) => setNewOpportunity({...newOpportunity, providerId: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select provider" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {providers.map((provider) => (
                                                    <SelectItem key={provider} value={provider}>
                                                        {provider}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Funding Type *</Label>
                                        <Select
                                            value={newOpportunity.type}
                                            onValueChange={(value) => setNewOpportunity({...newOpportunity, type: value as any})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
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

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select
                                            value={newOpportunity.currency}
                                            onValueChange={(value) => setNewOpportunity({...newOpportunity, currency: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencies.map((currency) => (
                                                    <SelectItem key={currency} value={currency}>
                                                        {currency}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amountMin">Minimum Amount</Label>
                                        <Input
                                            id="amountMin"
                                            type="number"
                                            value={newOpportunity.amountMin}
                                            onChange={(e) => setNewOpportunity({...newOpportunity, amountMin: e.target.value})}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amountMax">Maximum Amount</Label>
                                        <Input
                                            id="amountMax"
                                            type="number"
                                            value={newOpportunity.amountMax}
                                            onChange={(e) => setNewOpportunity({...newOpportunity, amountMax: e.target.value})}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="details" className="space-y-4 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="applicationDeadline">Application Deadline</Label>
                                        <Input
                                            id="applicationDeadline"
                                            type="date"
                                            value={newOpportunity.applicationDeadline}
                                            onChange={(e) => setNewOpportunity({...newOpportunity, applicationDeadline: e.target.value})}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={newOpportunity.status}
                                            onValueChange={(value) => setNewOpportunity({...newOpportunity, status: value as any})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="open">Open</SelectItem>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="closed">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eligibilitySummary">Eligibility Summary</Label>
                                    <textarea
                                        id="eligibilitySummary"
                                        value={newOpportunity.eligibilitySummary}
                                        onChange={(e) => setNewOpportunity({...newOpportunity, eligibilitySummary: e.target.value})}
                                        placeholder="Summarize eligibility requirements"
                                        className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isFeatured"
                                        checked={newOpportunity.isFeatured}
                                        onCheckedChange={(checked) => setNewOpportunity({...newOpportunity, isFeatured: checked})}
                                    />
                                    <Label htmlFor="isFeatured">Featured opportunity</Label>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateOpportunity} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                Create Opportunity
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Filters and Search */}
            <Card className="border-2 border-slate-100 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search opportunities, providers, or descriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <Building className="h-4 w-4 mr-2" />
                                    <SelectValue />
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

            {/* Featured Opportunities */}
            {featuredOpportunities.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <h2 className="text-xl font-semibold">Featured Opportunities</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {featuredOpportunities.map((opportunity) => (
                            <Card key={opportunity.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Featured</Badge>
                                            </div>
                                            <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
                                                {opportunity.title}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                                <Building className="h-3 w-3" />
                                                {opportunity.providerId}
                                            </CardDescription>
                                        </div>
                                        {getStatusBadge(opportunity.status)}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-sm text-slate-600 line-clamp-3">{opportunity.description}</p>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(opportunity.type)}
                                                <span className="text-sm font-medium capitalize">{opportunity.type}</span>
                                            </div>
                                            <div className="text-sm font-semibold text-emerald-600">
                                                {formatAmount(opportunity.amountMin, opportunity.amountMax, opportunity.currency)}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                                            {isDeadlineApproaching(opportunity.applicationDeadline) && (
                                                <Badge variant="destructive" className="ml-2">Urgent</Badge>
                                            )}
                                        </div>

                                        <div className="text-sm text-slate-600">
                                            <strong>Eligibility:</strong> {opportunity.eligibilitySummary}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t">
                                        <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                            Apply Now
                                        </Button>
                                        <Button variant="outline" className="flex-1">
                                            Learn More
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Regular Opportunities */}
            <div className="space-y-4">
                {featuredOpportunities.length > 0 && (
                    <h2 className="text-xl font-semibold">All Opportunities</h2>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {regularOpportunities.map((opportunity) => (
                        <Card key={opportunity.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-slate-100 hover:border-emerald-200">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
                                            {opportunity.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1 mt-1">
                                            <Building className="h-3 w-3" />
                                            {opportunity.providerId}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(opportunity.status)}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-sm text-slate-600 line-clamp-3">{opportunity.description}</p>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(opportunity.type)}
                                            <span className="text-sm font-medium capitalize">{opportunity.type}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-emerald-600">
                                            {formatAmount(opportunity.amountMin, opportunity.amountMax, opportunity.currency)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                                        {isDeadlineApproaching(opportunity.applicationDeadline) && (
                                            <Badge variant="destructive" className="ml-2">Urgent</Badge>
                                        )}
                                    </div>

                                    <div className="text-sm text-slate-600">
                                        <strong>Eligibility:</strong> {opportunity.eligibilitySummary}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t">
                                    <Button size="sm" className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                        Apply Now
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {filteredOpportunities.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No funding opportunities found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : "Be the first to add a funding opportunity"}
                        </p>
                        {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
                            <Button onClick={() => setIsSheetOpen(true)} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Opportunity
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}