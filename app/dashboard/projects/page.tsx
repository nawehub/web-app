'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    Plus,
    Search,
    MapPin,
    Calendar,
    DollarSign,
    Users,
    ThumbsUp,
    MessageCircle,
    Eye,
    Filter,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Sample project data
const sampleProjects = [
    {
        id: '1',
        title: 'Bo Community Market Renovation',
        description: 'Renovate and modernize the central market in Bo to improve trading conditions for local vendors and attract more customers.',
        district: 'Bo',
        category: 'Infrastructure',
        targetAmount: 1000000,
        raisedAmount: 750000,
        status: 'APPROVED - IMPLEMENTATION ONGOING',
        priority: 'High',
        votes: 245,
        comments: 18,
        views: 1250,
        createdAt: '2024-01-15',
        deadline: '2024-12-31',
        createdBy: 'Bo District Council',
        supporters: 180,
        updates: 5
    },
    {
        id: '2',
        title: 'Freetown Youth Tech Center',
        description: 'Establish a technology center to provide digital skills training for young people in Freetown, focusing on coding, digital marketing, and entrepreneurship.',
        district: 'Western Area Urban',
        category: 'Education',
        targetAmount: 1200000,
        raisedAmount: 900000,
        status: 'APPROVED - IMPLEMENTATION ONGOING',
        priority: 'High',
        votes: 312,
        comments: 24,
        views: 1890,
        createdAt: '2024-02-01',
        deadline: '2024-11-30',
        createdBy: 'Freetown City Council',
        supporters: 210,
        updates: 7
    },
    {
        id: '3',
        title: 'Kenema Agricultural Training Program',
        description: 'Develop a comprehensive agricultural training program for farmers in Kenema district, including modern farming techniques and equipment.',
        district: 'Kenema',
        category: 'Agriculture',
        targetAmount: 800000,
        raisedAmount: 600000,
        status: 'APPROVED - IMPLEMENTATION ONGOING',
        priority: 'Medium',
        votes: 189,
        comments: 12,
        views: 980,
        createdAt: '2024-01-20',
        deadline: '2024-10-15',
        createdBy: 'Kenema District Council',
        supporters: 150,
        updates: 3
    },
    {
        id: '4',
        title: 'Makeni Women\'s Business Hub',
        description: 'Create a dedicated space for women entrepreneurs in Makeni to access business training, mentorship, and networking opportunities.',
        district: 'Bombali',
        category: 'Economic Development',
        targetAmount: 600000,
        raisedAmount: 450000,
        status: 'UNDER REVIEW',
        priority: 'Medium',
        votes: 156,
        comments: 9,
        views: 720,
        createdAt: '2024-02-10',
        deadline: '2024-09-30',
        createdBy: 'Makeni City Council',
        supporters: 120,
        updates: 2
    },
    {
        id: '5',
        title: 'Koidu Clean Water Initiative',
        description: 'Install clean water systems and boreholes in underserved communities in Koidu to improve access to safe drinking water.',
        district: 'Kono',
        category: 'Health & Sanitation',
        targetAmount: 500000,
        raisedAmount: 350000,
        status: 'UNDER REVIEW',
        priority: 'High',
        votes: 203,
        comments: 15,
        views: 1100,
        createdAt: '2024-01-25',
        deadline: '2024-08-31',
        createdBy: 'Kono District Council',
        supporters: 95,
        updates: 1
    },
    {
        id: '6',
        title: 'Port Loko Solar Energy Project',
        description: 'Install solar panels and energy storage systems to provide reliable electricity to rural communities in Port Loko district.',
        district: 'Port Loko',
        category: 'Energy',
        targetAmount: 1500000,
        raisedAmount: 200000,
        status: 'PENDING APPROVAL',
        priority: 'Medium',
        votes: 89,
        comments: 6,
        views: 450,
        createdAt: '2024-02-15',
        deadline: '2025-03-31',
        createdBy: 'Port Loko District Council',
        supporters: 45,
        updates: 0
    }
];

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
            return <Clock className="h-3 w-3" />;
        case 'UNDER REVIEW':
            return <AlertCircle className="h-3 w-3" />;
        case 'PENDING APPROVAL':
            return <Eye className="h-3 w-3" />;
        case 'COMPLETED':
            return <CheckCircle className="h-3 w-3" />;
        default:
            return <Clock className="h-3 w-3" />;
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
        <div className="space-y-8 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                            District Projects
                        </h1>
                        <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        >
                            <TrendingUp className="w-3 h-3 mr-1" />
                            LYD
                        </Badge>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Community-driven development projects across Sierra Leone
                    </p>
                </div>

                <Link href="/dashboard/projects/create">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Total Projects",
                        value: sampleProjects.length,
                        icon: TrendingUp,
                        gradient: "from-blue-500 to-cyan-500",
                    },
                    {
                        label: "Active Projects",
                        value: sampleProjects.filter((p) => p.status === "APPROVED - IMPLEMENTATION ONGOING").length,
                        icon: Clock,
                        gradient: "from-emerald-500 to-teal-500",
                    },
                    {
                        label: "Total Raised",
                        value: formatCurrency(sampleProjects.reduce((sum, p) => sum + p.raisedAmount, 0)),
                        icon: DollarSign,
                        gradient: "from-violet-500 to-purple-500",
                    },
                    {
                        label: "Total Supporters",
                        value: sampleProjects.reduce((sum, p) => sum + p.supporters, 0),
                        icon: Users,
                        gradient: "from-orange-500 to-amber-500",
                    },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={index}
                            className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50"
                        >
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0">
                                        <div className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-white truncate">
                                            {stat.value}
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                                        <Icon className="h-5 w-5 text-white" />
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
                    <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-full sm:w-auto max-w-full justify-start overflow-x-auto">
                        <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900">
                            All Projects
                        </TabsTrigger>
                        <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900">
                            Active
                        </TabsTrigger>
                        <TabsTrigger value="review" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900">
                            Under Review
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900">
                            Pending
                        </TabsTrigger>
                    </TabsList>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger className="w-full sm:w-[170px] h-10 rounded-xl border-zinc-200 dark:border-zinc-800">
                                    <MapPin className="h-4 w-4 mr-2 text-zinc-400" />
                                    <SelectValue placeholder="District" />
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
                                <SelectTrigger className="w-full sm:w-[170px] h-10 rounded-xl border-zinc-200 dark:border-zinc-800">
                                    <Filter className="h-4 w-4 mr-2 text-zinc-400" />
                                    <SelectValue placeholder="Category" />
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

                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-full sm:w-[170px] h-10 rounded-xl border-zinc-200 dark:border-zinc-800">
                                    <AlertCircle className="h-4 w-4 mr-2 text-zinc-400" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="APPROVED - IMPLEMENTATION ONGOING">Active</SelectItem>
                                    <SelectItem value="UNDER REVIEW">Under Review</SelectItem>
                                    <SelectItem value="PENDING APPROVAL">Pending</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <TabsContent value={activeTab} className="space-y-4">
                    {filteredProjects.length === 0 ? (
                        <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                    <TrendingUp className="h-7 w-7 text-zinc-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                                    No projects found
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 mb-5 max-w-md">
                                    {searchQuery ? "No projects match your search criteria." : "No projects available in this category."}
                                </p>
                                <Link href="/dashboard/projects/create">
                                    <Button className="rounded-xl">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Project
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredProjects.map((project) => (
                                <Card
                                    key={project.id}
                                    className="overflow-hidden rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 text-zinc-900 dark:text-white">
                                                    {project.title}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-3">
                                                    {project.description}
                                                </CardDescription>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn("ml-2 shrink-0", getPriorityColor(project.priority))}
                                            >
                                                {project.priority}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                                                <MapPin className="h-4 w-4" />
                                                <span>{project.district}</span>
                                            </div>
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
                                                <span className="font-medium">Funding Progress</span>
                                                <span className="text-zinc-500 dark:text-zinc-400">
                                                    {getProgressPercentage(project.raisedAmount, project.targetAmount)}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={getProgressPercentage(project.raisedAmount, project.targetAmount)}
                                                className="h-2"
                                            />
                                            <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                                                <span>{formatCurrency(project.raisedAmount)} raised</span>
                                                <span>of {formatCurrency(project.targetAmount)}</span>
                                            </div>
                                        </div>

                                        {/* Project Stats */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-sm font-medium text-zinc-900 dark:text-white">
                                                    <ThumbsUp className="h-4 w-4 text-emerald-500" />
                                                    {project.votes}
                                                </div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Votes</p>
                                            </div>

                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-sm font-medium text-zinc-900 dark:text-white">
                                                    <MessageCircle className="h-4 w-4 text-blue-500" />
                                                    {project.comments}
                                                </div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Comments</p>
                                            </div>

                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-sm font-medium text-zinc-900 dark:text-white">
                                                    <Users className="h-4 w-4 text-purple-500" />
                                                    {project.supporters}
                                                </div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Supporters</p>
                                            </div>

                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-sm font-medium text-zinc-900 dark:text-white">
                                                    <Eye className="h-4 w-4 text-orange-500" />
                                                    {project.views}
                                                </div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Views</p>
                                            </div>
                                        </div>

                                        {/* Project Details */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Deadline: {formatDate(project.deadline)}</span>
                                            </div>
                                            <span>By {project.createdBy}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                            <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                                                <Button
                                                    variant="outline"
                                                    className="w-full rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-200"
                                                >
                                                    View Details
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 sm:w-auto w-full"
                                            >
                                                <ThumbsUp className="h-4 w-4 mr-1" />
                                                Vote
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}