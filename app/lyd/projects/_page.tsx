'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Progress} from '@/components/ui/progress';
import {
    Search,
    MapPin,
    Calendar,
    DollarSign,
    Users,
    MessageCircle,
    Eye,
    Filter,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Heart,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import {cn} from '@/lib/utils';
import Link from 'next/link';
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";
import {useIsMobile} from "@/hooks/use-mobile";
import { sampleProjects } from "@/types/project";

const districts = [
    "Bo", "Bombali", "Bonthe", "Falaba", "Kailahun", "Kambia", "Karene",
    "Kenema", "Koinadugu", "Kono", "Moyamba", "Port Loko", "Pujehun",
    "Tonkolili", "Western Area Rural", "Western Area Urban"
];

const categories = [
    "Infrastructure", "Education", "Agriculture", "Economic Development",
    "Health & Sanitation", "Energy", "Transportation", "Environment", "Other"
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'APPROVED - IMPLEMENTATION ONGOING':
            return 'bg-emerald-500 text-white';
        case 'UNDER REVIEW':
            return 'bg-amber-500 text-white';
        case 'PENDING APPROVAL':
            return 'bg-blue-500 text-white';
        case 'COMPLETED':
            return 'bg-violet-500 text-white';
        case 'REJECTED':
            return 'bg-red-500 text-white';
        default:
            return 'bg-zinc-500 text-white';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'APPROVED - IMPLEMENTATION ONGOING':
            return <Clock className="h-3 w-3"/>;
        case 'UNDER REVIEW':
            return <AlertCircle className="h-3 w-3"/>;
        case 'PENDING APPROVAL':
            return <Eye className="h-3 w-3"/>;
        case 'COMPLETED':
            return <CheckCircle className="h-3 w-3"/>;
        default:
            return <Clock className="h-3 w-3"/>;
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'High':
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
        case 'Medium':
            return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
        case 'Low':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
        default:
            return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    }
};

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [activeTab, setActiveTab] = useState('all');
    const isMobile = useIsMobile();

    const filteredProjects = sampleProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDistrict = selectedDistrict === 'all' || project.district === selectedDistrict;
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

        const matchesTab = activeTab === 'all' ||
            (activeTab === 'active' && project.status === 'APPROVED - IMPLEMENTATION ONGOING') ||
            (activeTab === 'review' && project.status === 'UNDER REVIEW') ||
            (activeTab === 'pending' && project.status === 'PENDING APPROVAL');

        return matchesSearch && matchesDistrict && matchesCategory && matchesStatus && matchesTab;
    });

    const formatCurrency = (amount: number) => {
        return `Le ${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getProgressPercentage = (raised: number, target: number) => {
        return Math.round((raised / target) * 100);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true}/>
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-8 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-white to-pink-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-rose-950/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-3xl" />
                
                <div className="container relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                                    <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                    <span className="text-sm font-medium text-rose-700 dark:text-rose-300">
                                        LYD Projects
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                                Love Your District Projects
                            </h1>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Community-driven development projects across Sierra Leone
                            </p>
                        </div>
                        <Link href="/lyd">
                            <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25">
                                <Heart className="mr-2 h-4 w-4" />
                                Contribute Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <main className="flex-1 container py-8 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Projects", value: sampleProjects.length, icon: TrendingUp, gradient: "from-blue-500 to-cyan-500" },
                        { label: "Active Projects", value: sampleProjects.filter(p => p.status === 'APPROVED - IMPLEMENTATION ONGOING').length, icon: Clock, gradient: "from-emerald-500 to-teal-500" },
                        { label: "Total Raised", value: formatCurrency(sampleProjects.reduce((sum, p) => sum + p.raisedAmount, 0)), icon: DollarSign, gradient: "from-violet-500 to-purple-500" },
                        { label: "Total Supporters", value: sampleProjects.reduce((sum, p) => sum + p.supporters, 0), icon: Users, gradient: "from-orange-500 to-amber-500" }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                                            <Icon className="h-5 w-5 text-white"/>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900">All Projects</TabsTrigger>
                            <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900">Active</TabsTrigger>
                            <TabsTrigger value="review" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900">Under Review</TabsTrigger>
                            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900">Pending</TabsTrigger>
                        </TabsList>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"/>
                                <Input
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
                                />
                            </div>

                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl border-zinc-200 dark:border-zinc-800">
                                    <MapPin className="h-4 w-4 mr-2 text-zinc-400"/>
                                    <SelectValue placeholder="District"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Districts</SelectItem>
                                    {districts.map((district) => (
                                        <SelectItem key={district} value={district}>
                                            {district}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl border-zinc-200 dark:border-zinc-800">
                                    <Filter className="h-4 w-4 mr-2 text-zinc-400"/>
                                    <SelectValue placeholder="Category"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="space-y-6 mt-0">
                        {filteredProjects.length === 0 ? (
                            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                        <TrendingUp className="h-8 w-8 text-zinc-400"/>
                                    </div>
                                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No projects found</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                                        {searchQuery ? 'No projects match your search criteria.' : 'No projects available in this category.'}
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedDistrict('all');
                                            setSelectedCategory('all');
                                        }}
                                        className="rounded-xl"
                                    >
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {filteredProjects.map((project) => (
                                    <Card 
                                        key={project.id}
                                        className="overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300"
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <CardTitle className="text-lg font-semibold line-clamp-2 text-zinc-900 dark:text-white">
                                                        {project.title}
                                                    </CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {project.description}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant="outline" className={cn("shrink-0", getPriorityColor(project.priority))}>
                                                    {project.priority}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                                <Badge variant="outline" className="flex items-center gap-1 border-zinc-200 dark:border-zinc-700">
                                                    <MapPin className="h-3 w-3"/>
                                                    {project.district}
                                                </Badge>
                                                <Badge variant="outline" className="border-zinc-200 dark:border-zinc-700">
                                                    {project.category}
                                                </Badge>
                                                <Badge className={cn(getStatusColor(project.status))}>
                                                    {getStatusIcon(project.status)}
                                                    <span className="ml-1 text-xs">{project.status.split(' - ')[0]}</span>
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Funding Progress */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Funding Progress</span>
                                                    <span className="text-zinc-500 dark:text-zinc-400">
                                                        {getProgressPercentage(project.raisedAmount, project.targetAmount)}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${getProgressPercentage(project.raisedAmount, project.targetAmount)}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                                                    <span>{formatCurrency(project.raisedAmount)} raised</span>
                                                    <span>of {formatCurrency(project.targetAmount)}</span>
                                                </div>
                                            </div>

                                            {/* Project Stats */}
                                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                                {[
                                                    // { icon: MessageCircle, value: project.comments, label: "Comments", color: "text-blue-500" },
                                                    { icon: Users, value: project.supporters, label: "Supporters", color: "text-violet-500" },
                                                ].map((stat, index) => {
                                                    const Icon = stat.icon;
                                                    return (
                                                        <div key={index} className="text-center">
                                                            <div className="flex items-center justify-center gap-1 text-sm font-medium text-zinc-900 dark:text-white">
                                                                <Icon className={cn("h-4 w-4", stat.color)}/>
                                                                {stat.value}
                                                            </div>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Deadline & Action */}
                                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                                <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                                                    <Calendar className="h-4 w-4"/>
                                                    <span>Deadline: {formatDate(project.deadline)}</span>
                                                </div>
                                                <Link href={`/app/lyd/projects/${project.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-700 dark:hover:text-rose-200"
                                                    >
                                                        View Details
                                                        <ArrowRight className="ml-1 h-3 w-3" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>

            <Footer />
        </div>
    );
}
