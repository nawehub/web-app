"use client"

import {useMemo, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Building, Calendar, Edit, ExternalLink, Eye, Filter, Mail, Phone, Search, Trash2} from "lucide-react"
import {useListProvidersQuery} from "@/hooks/repository/use-funding";
import {FundingProvider, providerTypes} from "@/types/funding";
import {IfAllowed} from "@/components/auth/IfAllowed";

export default function AllProviders() {
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [sortBy, setSortBy] = useState("created_at")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const {data, isLoading} = useListProvidersQuery();

    const filteredProviders = useMemo(() => {
        return data?.providers.filter((provider) => {
            const matchesSearch =
                provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesType = typeFilter === "all" || provider.providerType === typeFilter
            return matchesSearch && matchesType
        }).sort((a, b) => {
            let aValue: any = a[sortBy as keyof FundingProvider]
            let bValue: any = b[sortBy as keyof FundingProvider]

            if (sortBy === "createdAt") {
                aValue = new Date(aValue || 0).getTime()
                bValue = new Date(bValue || 0).getTime()
            } else if (typeof aValue === "string") {
                aValue = aValue.toLowerCase()
                bValue = bValue.toLowerCase()
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })
    }, [data?.providers, searchTerm, typeFilter, sortBy, sortOrder]);

    const formatDate = (date: Date | undefined) => {
        if (!date) return "N/A"
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })?.format(date)
    }

    const getProviderTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            Government: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            NGO: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            Private: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
            Foundation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
            Bank: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
            Corporate: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
            Individual: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
            Other: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        }
        return colors[type] || colors.Other
    }

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(field)
            setSortOrder("asc")
        }
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            {/* Stats Cards */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.1}}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.count}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+2</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Government</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold">{data?.providers?.filter((p) => p.providerType === "Government").length}</div>
                        <p className="text-xs text-muted-foreground">Government agencies</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Private Sector</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.providers?.filter((p) => ["Private", "Corporate", "Bank"]?.includes(p.providerType)).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Private organizations</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">NGOs & Foundations</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.providers?.filter((p) => ["NGO", "Foundation"]?.includes(p.providerType)).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Non-profit organizations</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Filters and Search */}
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}}>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                                    <Input
                                        placeholder="Search providers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Provider Type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {providerTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Sort by"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">Created Date</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="provider_type">Type</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Results */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3}}
                className="flex items-center justify-between"
            >
                <p className="text-sm text-muted-foreground">
                    Showing {filteredProviders?.length} of {data?.count} providers
                </p>
            </motion.div>

            {/* Providers Table */}
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4}}>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer hover:bg-muted/50"
                                           onClick={() => handleSort("name")}>
                                    <div className="flex items-center space-x-1">
                                        <span>Provider Name</span>
                                        {sortBy === "name" &&
                                            <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50"
                                           onClick={() => handleSort("provider_type")}>
                                    <div className="flex items-center space-x-1">
                                        <span>Type</span>
                                        {sortBy === "provider_type" &&
                                            <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                                    </div>
                                </TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Website</TableHead>
                                <TableHead className="cursor-pointer hover:bg-muted/50"
                                           onClick={() => handleSort("created_at")}>
                                    <div className="flex items-center space-x-1">
                                        <span>Created</span>
                                        {sortBy === "created_at" &&
                                            <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                                    </div>
                                </TableHead>
                                <IfAllowed><TableHead>Actions</TableHead></IfAllowed>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!isLoading && data && (
                                <AnimatePresence>
                                    {filteredProviders?.map((provider, index) => (
                                        <motion.tr
                                            key={provider.id}
                                            initial={{opacity: 0, x: -20}}
                                            animate={{opacity: 1, x: 0}}
                                            exit={{opacity: 0, x: 20}}
                                            transition={{delay: index * 0.05}}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{provider.name}</div>
                                                    <div
                                                        className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                                                        {provider.description}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getProviderTypeColor(provider.providerType)}>{provider.providerType}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-1 text-sm">
                                                        <Mail className="h-3 w-3"/>
                                                        <span
                                                            className="truncate max-w-[150px]">{provider.contactEmail}</span>
                                                    </div>
                                                    <div
                                                        className="flex items-center space-x-1 text-sm text-muted-foreground">
                                                        <Phone className="h-3 w-3"/>
                                                        <span>{provider.contactPhone}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {provider.websiteUrl ? (
                                                    <a
                                                        href={provider.websiteUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        <ExternalLink className="h-3 w-3"/>
                                                        <span>Visit</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    className="flex items-center space-x-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3"/>
                                                    <span>{formatDate(new Date(provider.createdAt))}</span>
                                                </div>
                                            </TableCell>
                                            <IfAllowed>
                                                <TableCell>
                                                    <div className="flex items-center space-x-1">
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4"/>
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4"/>
                                                        </Button>
                                                        <Button variant="ghost" size="sm"
                                                                className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </IfAllowed>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </motion.div>

            {filteredProviders?.length === 0 && (
                <motion.div
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{delay: 0.5}}
                >
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Filter className="h-12 w-12 text-muted-foreground mb-4"/>
                            <h3 className="text-lg font-semibold mb-2">No providers found</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Try adjusting your search criteria or filters to find more providers.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("")
                                    setTypeFilter("all")
                                }}
                            >
                                Clear Filters
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}
