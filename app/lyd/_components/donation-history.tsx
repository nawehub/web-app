"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, DollarSign, MapPin, Phone, Mail, Filter } from "lucide-react"
import { currencies } from "@/lib/lyd-data"
import {LYDDonation} from "@/types/lyd";
import {allDistricts} from "@/types/demographs";
import {useListProfileDonationsQuery} from "@/hooks/repository/use-lyd";
import { formatDate } from "@/types/funding";

interface DonationHistoryProps {
    onCloseAction: () => void
}

type SearchResults = {
    donations: LYDDonation[]
    totalAmount: number
    totalDonations: number
}

export function DonationHistoryComponent({ onCloseAction }: DonationHistoryProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchType, setSearchType] = useState<"email" | "phone">("email")
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
    const { data, refetch, isLoading} = useListProfileDonationsQuery(searchTerm);

    const handleSearch = async () => {
        if (!searchTerm) return;

        try {
            const result = await refetch();

            if (result.data) {
                const totalAmount = result.data.donations.reduce((sum, donation) => sum + donation.amount, 0);

                setSearchResults({
                    donations: result.data.donations,
                    totalAmount,
                    totalDonations: result.data.totalCount,
                });
            }
        } catch (error) {
            // Handle error appropriately
            console.error('Failed to fetch donations:', error);
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        const currencyInfo = currencies.find((c) => c.code === currency)
        return `${currencyInfo?.symbol}${amount.toLocaleString()}`
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "Pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            case "Failed":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    const getTargetName = (donation: LYDDonation) => {
        const district = allDistricts.find((d) => d.name === donation.district)
        if (donation.target === "District") {
            return `${district?.name} District`
        } else {
            const chiefdom = district?.chiefdoms.find((c) => c === donation.targetValue)
            return `${chiefdom} (${district?.name} District)`
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Donation History</h1>
                <p className="text-muted-foreground">Search for donation history using email address or phone number</p>
            </motion.div>

            {/* Search Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Search className="h-5 w-5" />
                            <span>Search Donations</span>
                        </CardTitle>
                        <CardDescription>Enter your email address or phone number to view your donation history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Label htmlFor="searchTerm">{searchType === "email" ? "Email Address" : "Phone Number"}</Label>
                                <Input
                                    id="searchTerm"
                                    type={searchType === "email" ? "email" : "tel"}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={searchType === "email" ? "your.email@example.com" : "+232 XX XXX XXX"}
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex flex-col justify-end">
                                <div className="flex border rounded-md mb-1">
                                    <Button
                                        variant={searchType === "email" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setSearchType("email")}
                                        className="rounded-r-none"
                                    >
                                        <Mail className="h-4 w-4 mr-1" />
                                        Email
                                    </Button>
                                    <Button
                                        variant={searchType === "phone" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setSearchType("phone")}
                                        className="rounded-l-none"
                                    >
                                        <Phone className="h-4 w-4 mr-1" />
                                        Phone
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end">
                                <Button onClick={handleSearch} disabled={!searchTerm || isLoading} className="bg-primary">
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="h-4 w-4 mr-2" />
                                            Search
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Search Results */}
            {searchResults && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{searchResults.totalDonations}</div>
                                <p className="text-xs text-muted-foreground">Lifetime donations</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(searchResults.totalAmount, "SLE")}</div>
                                <p className="text-xs text-muted-foreground">Total contributed</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {searchResults.totalDonations > 0
                                        ? formatCurrency(Math.round(searchResults.totalAmount / searchResults.totalDonations), "SLE")
                                        : formatCurrency(0, "SLE")}
                                </div>
                                <p className="text-xs text-muted-foreground">Per donation</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Donations Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5" />
                                <span>Donation History</span>
                            </CardTitle>
                            <CardDescription>
                                {searchResults.totalDonations > 0
                                    ? `Found ${searchResults.totalDonations} donation${searchResults.totalDonations > 1 ? "s" : ""}`
                                    : "No donations found for this search term"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {searchResults.donations.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Target</TableHead>
                                            <TableHead>Payment Method</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {searchResults.donations.map((donation, index) => (
                                            <motion.tr
                                                key={donation.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{formatDate(donation.createdAt.toString())}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{formatCurrency(donation.amount, donation.currency)}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <div className="font-medium text-sm">{getTargetName(donation)}</div>
                                                            <Badge variant="outline" className="text-xs">
                                                                {donation.target}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div className="font-medium">{donation.paymentMethod}</div>
                                                        <div className="text-muted-foreground">{donation.paymentProvider}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(donation.status)}>{donation.status}</Badge>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-12">
                                    <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No donations found</h3>
                                    <p className="text-muted-foreground">
                                        No donation history was found for the provided{" "}
                                        {searchType === "email" ? "email address" : "phone number"}.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Back Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-8">
                <Button variant="outline" onClick={onCloseAction}>
                    Back to LYD Dashboard
                </Button>
            </motion.div>
        </div>
    )
}
