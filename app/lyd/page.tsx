"use client"

import {useState} from "react"
import {motion} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
    Heart,
    Plus,
    Calendar,
    TrendingUp,
    Users,
    MapPin,
    Trophy,
    Star,
    ArrowUpRight,
    DollarSign,
    Building2,
} from "lucide-react"
import {DonationForm} from "@/app/lyd/_components/donation-form"
import {DonationHistoryComponent} from "@/app/lyd/_components/donation-history"
import AppHeader from "@/components/public/app-header";
import {useListDistrictRankingsQuery, useListTopContributorsQuery} from "@/hooks/repository/use-lyd";
import {allDistricts} from "@/types/demographs";
import {formatCurrency} from "@/utils/formatters";
import {useIsMobile} from "@/hooks/use-mobile";

export default function LYDPage() {
    const [showDonationForm, setShowDonationForm] = useState(false)
    const [showDonationHistory, setShowDonationHistory] = useState(false)
    const [selectedYear, setSelectedYear] = useState("2024")
    const { data: topContributors, refetch: refetchContributors } = useListTopContributorsQuery()
    const { data: districtRankings, refetch: refetchRankings } = useListDistrictRankingsQuery()
    const isMobile = useIsMobile()

    const handleDonationSubmit = () => {
        refetchContributors().then()
        refetchRankings().then()
        setShowDonationForm(false)
    }

    const totalStats = {
        totalContributions: districtRankings?.reduce((sum, district) => sum + district.totalContributions, 0),
        totalContributors: districtRankings?.reduce((sum, district) => sum + district.totalContributors, 0),
        activeDistricts: allDistricts.length,
        fundedProjects: 127,
    }

    if (showDonationForm) {
        return (
            <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
                {/* Navigation */}
                <AppHeader isVisible={true}/>
                <div className={`flex-1 space-y-4 px-4 md:p-8 ${isMobile ? 'mt-20' : 'mt-16'}`}>
                    <DonationForm onSubmitAction={handleDonationSubmit} onCancelAction={() => setShowDonationForm(false)}/>
                </div>
            </div>
        )
    }

    if (showDonationHistory) {
        return (
            <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
                {/* Navigation */}
                <AppHeader isVisible={true}/>
                <div className={`flex-1 space-y-4 px-4 md:p-8 ${isMobile ? 'mt-20' : 'mt-16'}`}>
                    <DonationHistoryComponent onCloseAction={() => setShowDonationHistory(false)}/>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Navigation */}
            <AppHeader isVisible={true}/>
            <div className={`flex-1 space-y-4 px-4 md:p-8 ${isMobile ? 'mt-20' : 'mt-16'}`}>
                {/* Hero Section */}
                <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}}
                            className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-full">
                            <Heart className="h-8 w-8 text-white"/>
                        </div>
                        <h1 className={`${isMobile ? 'text-xl' : 'text-4xl'} font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent`}>
                            Love Your District
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Build a community through voluntary micro-contributions. Every Leone counts towards district
                        development
                        projects that create lasting impact.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
                        <Button
                            size="lg"
                            onClick={() => setShowDonationForm(true)}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-3"
                        >
                            <Plus className="mr-2 h-5 w-5"/>
                            Make a Contribution
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => setShowDonationHistory(true)}>
                            <Calendar className="mr-2 h-5 w-5"/>
                            View Contribution History
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.1}}
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                >
                    <Card
                        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total
                                Contributions</CardTitle>
                            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {formatCurrency(totalStats.totalContributions!)}
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                <span className="text-green-600">+12.5%</span> from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total
                                Contributors</CardTitle>
                            <Users className="h-4 w-4 text-green-600 dark:text-green-400"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                                {totalStats.totalContributors?.toLocaleString()}
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-400">
                                <span className="text-green-600">+8.2%</span> from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Active
                                Districts</CardTitle>
                            <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400"/>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalStats.activeDistricts}</div>
                            <p className="text-xs text-purple-600 dark:text-purple-400">All 16 districts
                                participating</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Funded
                                Projects</CardTitle>
                            <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400"/>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="text-2xl font-bold text-orange-900 dark:text-orange-100">{totalStats.fundedProjects}</div>
                            <p className="text-xs text-orange-600 dark:text-orange-400">
                                <span className="text-green-600">+15.3%</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* District Rankings */}
                    <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}}>
                        <Card>
                            <CardHeader className="px-4 py-4 md:px-6 md:py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Trophy className={`${isMobile ? 'h-3 w-3' : 'h-5 w-5'} text-yellow-600`} />
                                            <span className={isMobile ? 'text-lg' : ''}>District Rankings</span>
                                        </CardTitle>
                                        <CardDescription>Top performing districts by total contributions</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                <div className="space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto pr-1 -mr-1">
                                    {districtRankings?.map((district, index) => {
                                        const percentage = (district.totalContributions / totalStats.totalContributions!) * 100;
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{opacity: 0, x: -20}}
                                                animate={{opacity: 1, x: 0}}
                                                transition={{delay: 0.3 + index * 0.1}}
                                                className="flex items-start md:items-center gap-3 md:gap-4"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1 gap-2">
                                                        <p className="font-medium truncate text-sm md:text-base">{district.district}</p>
                                                        <p className="text-xs md:text-sm font-semibold whitespace-nowrap">
                                                            {formatCurrency(district.totalContributions)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                            <motion.div
                                                                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
                                                                initial={{width: 0}}
                                                                animate={{width: `${percentage}%`}}
                                                                transition={{delay: 0.5 + index * 0.1, duration: 0.8}}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] md:text-xs text-muted-foreground w-10 md:w-12 text-right shrink-0">
                                                            {percentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] md:text-xs text-muted-foreground mt-1">
                                                        {district.totalContributors.toLocaleString()}{" "}
                                                        {district.totalContributors === 1 ? "contributor" : "contributors"}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Top Contributors */}
                    <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}}>
                        <Card>
                            <CardHeader className="px-4 py-4 md:px-6 md:py-6">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Star className={`${isMobile ? 'h-3 w-3' : 'h-5 w-5'} text-blue-600`} />
                                            <span className={isMobile ? 'text-lg' : ''}>Top Contributors</span>
                                        </CardTitle>
                                        <CardDescription>Leading contributors making the biggest impact</CardDescription>
                                    </div>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="w-[90px] md:w-[100px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2023">2023</SelectItem>
                                            <SelectItem value="2022">2022</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                <div className="space-y-2.5 md:space-y-3.5 max-h-[70vh] overflow-y-auto pr-1 -mr-1">
                                    {topContributors?.map((contributor, index) => {
                                        const isAnon = contributor.anonymous;
                                        const fullName = isAnon ? "Anonymous Contributor" : `${contributor.firstName} ${contributor.lastName}`;
                                        const initials = isAnon
                                            ? "AN"
                                            : `${(contributor.firstName || "").charAt(0)}${(contributor.lastName || "").charAt(0)}`.toUpperCase();
                                        const contributionsLabel =
                                            contributor.totalContributionsCount === 1 ? "contribution" : "contributions";

                                        return (
                                            <motion.div
                                                key={`${fullName}-${index}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 + index * 0.06 }}
                                                className="rounded-lg md:rounded-xl border border-blue-100/70 dark:border-blue-800/60 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-2.5 md:p-3"
                                            >
                                                <div className="flex items-start justify-between gap-3 sm:gap-4">
                                                    {/* Left cluster: rank + avatar + name/meta */}
                                                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                                                        {/* Rank */}
                                                        <div className="mt-0.5 flex items-center justify-center w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold ring-2 ring-white/70 dark:ring-white/10 shadow shrink-0">
                                                            {index + 1}
                                                        </div>

                                                        {/* Avatar + text */}
                                                        <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                                                            {/* Avatar */}
                                                            {!isMobile && (
                                                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white text-blue-700 dark:bg-white/10 dark:text-blue-200 flex items-center justify-center text-xs sm:text-sm font-semibold ring-1 ring-blue-200/60 dark:ring-blue-800/60 shrink-0">
                                                                    {initials}
                                                                </div>
                                                            )}

                                                            {/* Texts */}
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium truncate text-sm md:text-base">
                                                                        {fullName}
                                                                    </p>
                                                                </div>

                                                                {/* Meta line + badge (stack on mobile) */}
                                                                <div className="mt-0.5 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                                                    <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                                                                        {isAnon ? "Private contributor" : contributor.nationality}
                                                                    </p>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="mt-1 sm:mt-0 w-fit text-[10px] sm:text-[11px] bg-white/70 dark:bg-white/10 border-blue-200/60 dark:border-blue-800/60"
                                                                    >
                                                                        {contributor.totalContributionsCount} {contributionsLabel}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Amount on the right */}
                                                    <div className="text-right shrink-0">
                                                        <p className="text-sm md:text-base font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                                                            {formatCurrency(contributor.totalContributions)}
                                                        </p>
                                                        <span className="hidden sm:inline-block text-[10px] text-blue-700/80 dark:text-blue-300/80">Total</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                    className="text-center"
                >
                    <Card
                        className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-red-200 dark:border-red-800">
                        <CardContent className="pt-6">
                            <div className="max-w-2xl mx-auto space-y-4">
                                <Heart className="h-12 w-12 text-red-500 mx-auto"/>
                                <h3 className="text-2xl font-bold text-red-900 dark:text-red-100">Join the Movement</h3>
                                <p className="text-red-700 dark:text-red-300">
                                    Your contribution, no matter how small, helps build schools, hospitals, roads, and
                                    other vital
                                    infrastructure that transforms communities across Sierra Leone.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                                    <Button
                                        size="lg"
                                        onClick={() => setShowDonationForm(true)}
                                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                                    >
                                        <Heart className="mr-2 h-5 w-5"/>
                                        Start Contributing Today
                                    </Button>
                                    <Button size="lg" variant="outline" onClick={() => setShowDonationHistory(true)}>
                                        <TrendingUp className="mr-2 h-5 w-5"/>
                                        Track Your Impact
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
