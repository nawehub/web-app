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
    Sparkles,
    ArrowRight
} from "lucide-react"
import {DonationForm} from "@/app/lyd/_components/donation-form"
import {DonationHistoryComponent} from "@/app/lyd/_components/donation-history"
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";
import {useListDistrictRankingsQuery, useListTopContributorsQuery} from "@/hooks/repository/use-lyd";
import {allDistricts} from "@/types/demographs";
import {formatCurrency} from "@/utils/formatters";
import {useIsMobile} from "@/hooks/use-mobile";
import Link from "next/link";

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
            <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
                <AppHeader isVisible={true}/>
                <div className={`flex-1 container mx-auto px-4 py-8 ${isMobile ? 'mt-20' : 'mt-16'}`}>
                    <DonationForm onSubmitAction={handleDonationSubmit} onCancelAction={() => setShowDonationForm(false)}/>
                </div>
                <Footer />
            </div>
        )
    }

    if (showDonationHistory) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
                <AppHeader isVisible={true}/>
                <div className={`flex-1 container mx-auto px-4 py-8 ${isMobile ? 'mt-20' : 'mt-16'}`}>
                    <DonationHistoryComponent onCloseAction={() => setShowDonationHistory(false)}/>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true}/>
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-white to-pink-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-rose-950/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-3xl" />
                
                <div className="container relative">
                    <motion.div 
                        initial={{opacity: 0, y: 20}} 
                        animate={{opacity: 1, y: 0}}
                        className="text-center space-y-6 max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20">
                            <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            <span className="text-sm font-medium text-rose-700 dark:text-rose-300">
                                Community Impact Program
                            </span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white">
                            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                                Love Your District
                            </span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Build a community through voluntary micro-contributions. Every Leone counts towards district
                            development projects that create lasting impact.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                            <Button
                                size="lg"
                                onClick={() => setShowDonationForm(true)}
                                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 h-12 px-8"
                            >
                                <Plus className="mr-2 h-5 w-5"/>
                                Make a Contribution
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                onClick={() => setShowDonationHistory(true)}
                                className="border-2 border-zinc-200 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-600 rounded-xl h-12 px-8"
                            >
                                <Calendar className="mr-2 h-5 w-5"/>
                                View History
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="py-8 container">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.1}}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {[
                        {
                            title: "Total Contributions",
                            value: formatCurrency(totalStats.totalContributions!),
                            change: "+12.5%",
                            icon: DollarSign,
                            gradient: "from-blue-500 to-cyan-500"
                        },
                        {
                            title: "Total Contributors",
                            value: totalStats.totalContributors?.toLocaleString(),
                            change: "+8.2%",
                            icon: Users,
                            gradient: "from-emerald-500 to-teal-500"
                        },
                        {
                            title: "Active Districts",
                            value: totalStats.activeDistricts,
                            label: "All 16 districts participating",
                            icon: MapPin,
                            gradient: "from-violet-500 to-purple-500"
                        },
                        {
                            title: "Funded Projects",
                            value: totalStats.fundedProjects,
                            change: "+15.3%",
                            icon: Building2,
                            gradient: "from-orange-500 to-amber-500"
                        }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card 
                                key={index}
                                className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 hover:shadow-xl transition-all duration-300"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                                        <Icon className="h-5 w-5 text-white"/>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                        {stat.change && <span className="text-emerald-500">{stat.change}</span>}
                                        {stat.change && " from last month"}
                                        {stat.label}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </motion.div>
            </section>

            {/* Rankings Section */}
            <section className="py-8 container">
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* District Rankings */}
                    <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}}>
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center">
                                                <Trophy className="h-5 w-5 text-white" />
                                            </div>
                                            District Rankings
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            Top performing districts by total contributions
                                        </CardDescription>
                                    </div>
                                    <Link href="/lyd-projects">
                                        <Button variant="ghost" size="sm" className="rounded-xl">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {districtRankings?.map((district, index) => {
                                        const percentage = (district.totalContributions / totalStats.totalContributions!) * 100;
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{opacity: 0, x: -20}}
                                                animate={{opacity: 1, x: 0}}
                                                transition={{delay: 0.3 + index * 0.05}}
                                                className="flex items-center gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                            >
                                                <div className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold text-sm ${
                                                    index < 3 
                                                        ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white" 
                                                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                                }`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <p className="font-medium truncate text-zinc-900 dark:text-white">
                                                            {district.district}
                                                        </p>
                                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white whitespace-nowrap ml-4">
                                                            {formatCurrency(district.totalContributions)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
                                                            <motion.div
                                                                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full"
                                                                initial={{width: 0}}
                                                                animate={{width: `${percentage}%`}}
                                                                transition={{delay: 0.5 + index * 0.05, duration: 0.8}}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-zinc-500 dark:text-zinc-400 w-12 text-right">
                                                            {percentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
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
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                                <Star className="h-5 w-5 text-white" />
                                            </div>
                                            Top Contributors
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            Leading contributors making the biggest impact
                                        </CardDescription>
                                    </div>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="w-[100px] rounded-xl">
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
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
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
                                                transition={{ delay: 0.2 + index * 0.05 }}
                                                className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold text-sm ${
                                                        index < 3 
                                                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white" 
                                                            : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                    
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                                        {initials}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate text-zinc-900 dark:text-white">
                                                            {fullName}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                                                {isAnon ? "Private contributor" : contributor.nationality}
                                                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-[10px] bg-white/70 dark:bg-zinc-800 border border-blue-200 dark:border-blue-800"
                                                            >
                                                                {contributor.totalContributionsCount} {contributionsLabel}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                            {formatCurrency(contributor.totalContributions)}
                                                        </p>
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
            </section>

            {/* CTA Section */}
            <section className="py-16 container">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                >
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-rose-600 via-pink-600 to-red-600">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <pattern id="heart-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                                    </pattern>
                                </defs>
                                <rect width="100" height="100" fill="url(#heart-grid)" />
                            </svg>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        
                        <CardContent className="relative py-12 px-6 md:px-12">
                            <div className="max-w-2xl mx-auto text-center text-white space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-medium">Join the Movement</span>
                                </div>
                                
                                <h3 className="text-2xl sm:text-3xl font-bold">
                                    Make a Difference Today
                                </h3>
                                
                                <p className="text-white/80 text-lg">
                                    Your contribution, no matter how small, helps build schools, hospitals, roads, and
                                    other vital infrastructure that transforms communities across Sierra Leone.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                                    <Button
                                        size="lg"
                                        onClick={() => setShowDonationForm(true)}
                                        className="bg-white text-rose-600 hover:bg-zinc-100 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 h-12 px-8"
                                    >
                                        <Heart className="mr-2 h-5 w-5"/>
                                        Start Contributing Today
                                    </Button>
                                    <Button 
                                        size="lg" 
                                        variant="outline" 
                                        onClick={() => setShowDonationHistory(true)}
                                        className="border-2 border-white/30 text-white hover:text-white hover:bg-white/20 rounded-xl h-12 px-8"
                                    >
                                        <TrendingUp className="mr-2 h-5 w-5"/>
                                        Track Your Impact
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </section>

            <Footer />
        </div>
    )
}
