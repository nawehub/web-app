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
    ThumbsUp,
    MessageCircle,
    Eye,
    Filter,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import {cn} from '@/lib/utils';
import Link from 'next/link';
import AppHeader from "@/components/public/app-header";
import {useIsMobile} from "@/hooks/use-mobile";

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
            return 'bg-green-500 hover:bg-green-600';
        case 'UNDER REVIEW':
            return 'bg-yellow-500 hover:bg-yellow-600';
        case 'PENDING APPROVAL':
            return 'bg-blue-500 hover:bg-blue-600';
        case 'COMPLETED':
            return 'bg-purple-500 hover:bg-purple-600';
        case 'REJECTED':
            return 'bg-red-500 hover:bg-red-600';
        default:
            return 'bg-gray-500 hover:bg-gray-600';
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
            return 'text-red-600 bg-red-50 border-red-200';
        case 'Medium':
            return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'Low':
            return 'text-green-600 bg-green-50 border-green-200';
        default:
            return 'text-gray-600 bg-gray-50 border-gray-200';
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
        <div
            className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <AppHeader isVisible={true}/>
            <div className={`flex-1 space-y-4 container mx-auto px-4 md:p-8 ${isMobile ? 'mt-20' : 'mt-16'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Love Your District Projects</h1>
                        <p className="text-muted-foreground">
                            Community-driven development projects across Sierra Leone - Powered by the LYD Community.
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{sampleProjects.length}</div>
                                    <p className="text-xs text-muted-foreground">Total Projects</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-blue-500"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">
                                        {sampleProjects.filter(p => p.status === 'APPROVED - IMPLEMENTATION ONGOING').length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Active Projects</p>
                                </div>
                                <Clock className="h-8 w-8 text-green-500"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(sampleProjects.reduce((sum, p) => sum + p.raisedAmount, 0))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Total Raised</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-purple-500"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">
                                        {sampleProjects.reduce((sum, p) => sum + p.supporters, 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Total Supporters</p>
                                </div>
                                <Users className="h-8 w-8 text-orange-500"/>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Projects</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="review">Under Review</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                    </TabsList>

                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger className="w-[180px]">
                                    <MapPin className="h-4 w-4 mr-2"/>
                                    <SelectValue placeholder="All Districts"/>
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
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2"/>
                                    <SelectValue placeholder="All Categories"/>
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

                    <TabsContent value={activeTab} className="space-y-4">
                        {filteredProjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4"/>
                                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery ? 'No projects match your search criteria.' : 'No projects available in this category.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {filteredProjects.map((project) => (
                                    <Card key={project.id}
                                          className="overflow-hidden hover:shadow-lg transition-all duration-300">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                                                        {project.title}
                                                    </CardTitle>
                                                    <CardDescription className="line-clamp-3">
                                                        {project.description}
                                                    </CardDescription>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={cn("ml-2 text-white border-0", getPriorityColor(project.priority))}
                                                >
                                                    {project.priority}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="h-4 w-4"/>
                                                    <span>{project.district}</span>
                                                </div>
                                                <Badge variant="outline">{project.category}</Badge>
                                                <Badge className={cn("text-white", getStatusColor(project.status))}>
                                                    {getStatusIcon(project.status)}
                                                    <span
                                                        className="ml-1 text-xs">{project.status.split(' - ')[0]}</span>
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Funding Progress */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">Funding Progress</span>
                                                    <span className="text-muted-foreground">
                                                        {getProgressPercentage(project.raisedAmount, project.targetAmount)}%
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={getProgressPercentage(project.raisedAmount, project.targetAmount)}
                                                    className="h-2"
                                                />
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>{formatCurrency(project.raisedAmount)} raised</span>
                                                    <span>of {formatCurrency(project.targetAmount)}</span>
                                                </div>
                                            </div>

                                            {/* Project Stats */}
                                            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                                                <div className="text-center">
                                                    <div
                                                        className="flex items-center justify-center gap-1 text-sm font-medium">
                                                        <MessageCircle className="h-4 w-4 text-blue-500"/>
                                                        {project.comments}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Comments</p>
                                                </div>

                                                <div className="text-center">
                                                    <div
                                                        className="flex items-center justify-center gap-1 text-sm font-medium">
                                                        <Users className="h-4 w-4 text-purple-500"/>
                                                        {project.supporters}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Supporters</p>
                                                </div>

                                                <div className="text-center">
                                                    <div
                                                        className="flex items-center justify-center gap-1 text-sm font-medium">
                                                        <Eye className="h-4 w-4 text-orange-500"/>
                                                        {project.views}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Views</p>
                                                </div>
                                            </div>

                                            {/* Project Details */}
                                            <div
                                                className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4"/>
                                                    <span>Deadline: {formatDate(project.deadline)}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-2">
                                                <Link href={`/lyd-projects/${project.id}`} className="flex-1">
                                                    <Button variant="outline" className="w-full">
                                                        View Details
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
            </div>
        </div>
    );
}