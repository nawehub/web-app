'use client';

import {useEffect, useState} from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Search,
    Building2,
    MapPin,
    Phone,
    Mail,
    Calendar,
    User,
    FileText,
    Filter,
    Grid3X3,
    List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {useListApprovedBusinessesQuery} from "@/hooks/repository/use-business";
import Image from "next/image";
import {useIsMobile} from "@/hooks/use-mobile";

const sectors = [
    "Agriculture", "Technology", "Fashion & Textiles", "Food & Beverage",
    "Healthcare", "Education", "Construction", "Transportation", "Retail",
    "Manufacturing", "Services", "Tourism", "Mining", "Energy", "Other"
];

const getSectorColor = (sector: string) => {
    const colors = {
        'Agriculture': 'bg-green-500',
        'Technology': 'bg-blue-500',
        'Fashion & Textiles': 'bg-purple-500',
        'Food & Beverage': 'bg-orange-500',
        'Healthcare': 'bg-red-500',
        'Education': 'bg-indigo-500',
        'Construction': 'bg-yellow-500',
        'Transportation': 'bg-cyan-500',
        'Retail': 'bg-pink-500',
        'Manufacturing': 'bg-gray-500',
        'Services': 'bg-teal-500',
        'Tourism': 'bg-emerald-500',
        'Mining': 'bg-amber-500',
        'Energy': 'bg-lime-500',
        'Other': 'bg-slate-500'
    };
    return colors[sector as keyof typeof colors] || 'bg-gray-500';
};

export default function ApprovedBusinesses() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState<string>('all');
    const isMobile = useIsMobile();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
    const { data, isLoading } = useListApprovedBusinessesQuery();

    const filteredBusinesses = data?.businesses?.filter(business => {
        const matchesSearch = business.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.businessActivities.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSector = selectedSector === 'all' || business.category === selectedSector;

        return matchesSearch && matchesSector;
    });

    useEffect(() => {
        if (isMobile) {
            setViewMode('list');
        }
    }, [isMobile]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className={`space-y-6 ${isMobile ? 'py-6' : 'py-12'}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Top Businesses</h1>
                    <p className="text-muted-foreground">
                        Discover successful businesses across Nawehub
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search businesses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <div className="flex gap-2">
                    <Select value={selectedSector} onValueChange={setSelectedSector}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="All Sectors" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sectors</SelectItem>
                            {sectors.map((sector) => (
                                <SelectItem key={sector} value={sector}>
                                    {sector}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats */}
            {!isMobile && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{filteredBusinesses?.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {selectedSector === 'all' ? 'Total Businesses' : `${selectedSector} Businesses`}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{new Set(data?.businesses?.map(b => b.category)).size}</div>
                            <p className="text-xs text-muted-foreground">Active Sectors</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{data?.businesses?.filter(b => b.status.state === 'Approved').length}</div>
                            <p className="text-xs text-muted-foreground">Active Businesses</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Business Grid/List */}
            <div className="space-y-4">
                {filteredBusinesses?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No businesses found</h3>
                        <p className="text-muted-foreground">
                            {searchQuery ? 'No businesses match your search.' : 'No businesses in this sector.'}
                        </p>
                    </div>
                ) : (
                    <div className={cn(
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                    )}>
                        {filteredBusinesses?.map((business) => (
                            <Card
                                key={business.id}
                                className={cn(
                                    "overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer",
                                    selectedBusiness === business.id && "ring-2 ring-primary",
                                    viewMode === 'list' && "flex"
                                )}
                                onClick={() => setSelectedBusiness(selectedBusiness === business.id ? null : business.id)}
                            >
                                {/* Business Image Placeholder */}
                                <div className={cn(
                                    "flex items-center justify-center",
                                    viewMode === 'grid' ? "h-48" : "w-24 h-24"
                                )}>
                                    <Image
                                        src={"/biz-placeholder.png"}
                                        alt={"Business Logo"}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className={"w-full h-48 transform object-cover group-hover:scale-105 transition-transform duration-300"}
                                    />
                                </div>

                                <div className="flex-1">
                                    <CardHeader className={cn(viewMode === 'list' && "pb-2")}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold line-clamp-1">
                                                    {business.businessName}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2 mt-1">
                                                    {business.businessActivities}
                                                </CardDescription>
                                            </div>
                                            <Badge className={`${getSectorColor(business.category)} hover:opacity-90 text-white ml-2`}>
                                                {business.category}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className={cn("space-y-2", viewMode === 'list' && "pt-0")}>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>{business.ownerName}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>{business.businessAddress}</span>
                                        </div>

                                        {selectedBusiness === business.id && (
                                            <div className="mt-4 space-y-3 pt-4 border-t animate-in slide-in-from-top-2 duration-300">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <span>{business.contactNumber}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        <span className="truncate">{business.email}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span>{business.businessEntityType}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>Registered {formatDate(business.registerDate)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <Badge variant="outline">
                                                        {business.registrationNumber}
                                                    </Badge>
                                                    <Badge
                                                        variant={business.status.state === 'Approved' ? 'default' : 'secondary'}
                                                        className={business.status.state === 'Approved' ? 'bg-green-500 hover:bg-green-600' : ''}
                                                    >
                                                        {business.status.state}
                                                    </Badge>
                                                </div>
                                                {/*Nin Passport details*/}
                                                <div className="flex items-center justify-between pt-2">
                                                    <Badge variant="outline">
                                                        {business.ninOrPassport}
                                                    </Badge>
                                                    <Badge
                                                        variant={business.occupation ? 'default' : 'secondary'}
                                                        className={business.occupation ? 'bg-green-500 hover:bg-green-600' : ''}
                                                    >
                                                        {business.occupation ?? "N/A"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}