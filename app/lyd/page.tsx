  "use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Trophy,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  Crown,
  Medal,
  Award,
  Smartphone,
  CreditCard,
} from "lucide-react"
  import AppHeader from "@/components/public/app-header";

const districts = [
  { name: "Bo", total: 2450000, contributors: 1250, rank: 1, change: 5 },
  { name: "Western Area Urban", total: 2100000, contributors: 2100, rank: 2, change: 2 },
  { name: "Kenema", total: 1850000, contributors: 980, rank: 3, change: -1 },
  { name: "Kailahun", total: 1650000, contributors: 850, rank: 4, change: 3 },
  { name: "Port Loko", total: 1400000, contributors: 720, rank: 5, change: -2 },
  { name: "Bombali", total: 1250000, contributors: 650, rank: 6, change: 1 },
  { name: "Tonkolili", total: 1100000, contributors: 580, rank: 7, change: -1 },
  { name: "Moyamba", total: 950000, contributors: 490, rank: 8, change: 2 },
]

const topContributors = [
  { name: "Aminata K.", district: "Bo", amount: 125000, rank: 1 },
  { name: "Mohamed S.", district: "Western Area Urban", amount: 98000, rank: 2 },
  { name: "Fatima B.", district: "Kenema", amount: 87000, rank: 3 },
  { name: "Ibrahim T.", district: "Bo", amount: 76000, rank: 4 },
  { name: "Mariama J.", district: "Kailahun", amount: 65000, rank: 5 },
]

const fundedProjects = [
  {
    title: "Bo District Youth Tech Hub",
    district: "Bo",
    category: "Technology",
    funded: 850000,
    goal: 1000000,
    status: "Active",
  },
  {
    title: "Kenema Agricultural Processing Center",
    district: "Kenema",
    category: "Agriculture",
    funded: 1200000,
    goal: 1200000,
    status: "Completed",
  },
  {
    title: "Port Loko Women's Cooperative",
    district: "Port Loko",
    category: "Business",
    funded: 450000,
    goal: 800000,
    status: "Funding",
  },
]

export default function LYDPage() {
  const [donationAmount, setDonationAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("Bo")

  const quickAmounts = [1, 5, 10, 25, 50, 100]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <AppHeader isVisible={true}/>

      <header className="bg-white border-b mt-8">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Love Your District</span>
          </div>
          <Button variant="outline" asChild className={'bg-blue-600 hover:bg-blue-300 text-white hover:text-white'}>
            <a href="/lyd/history">Donation History</a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Love Your District</h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Build your community through voluntary micro-contributions. Every Leone counts towards district development
            projects that create lasting impact.
          </p>
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">Le 15.2M</div>
              <div className="text-gray-600">Total Raised</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">8,450</div>
              <div className="text-gray-600">Contributors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">16</div>
              <div className="text-gray-600">Districts</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="donate" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="donate">Make Donation</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          {/* Donation Tab */}
          <TabsContent value="donate" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-blue-600" />
                    Make a Contribution
                  </CardTitle>
                  <CardDescription>Support your district with a micro-donation starting from Le 1</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="district">Select District</Label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.name} value={district.name}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Donation Amount (Le)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                    />
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setDonationAmount(amount.toString())}
                        >
                          Le {amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payment">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orange">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Orange Money
                          </div>
                        </SelectItem>
                        <SelectItem value="africell">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Africell Money
                          </div>
                        </SelectItem>
                        <SelectItem value="bank">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Bank Transfer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" size="lg" disabled={!donationAmount || !paymentMethod}>
                    Donate Le {donationAmount || "0"}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <p>🔒 Secure payment processing</p>
                    <p>📧 Instant receipt via email/SMS</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {/* Current Month Challenge */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      December Challenge
                    </CardTitle>
                    <CardDescription>"Boost Bo District" - Help Bo reach Le 3M this month!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>Le 2.45M / Le 3M</span>
                        </div>
                        <Progress value={81.7} className="h-3" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">18.3%</div>
                          <div className="text-xs text-gray-600">Remaining</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-emerald-600">9</div>
                          <div className="text-xs text-gray-600">Days Left</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Your Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Contributed</span>
                        <span className="font-semibold">Le 25,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District Rank</span>
                        <span className="font-semibold">#3 in Bo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Projects Supported</span>
                        <span className="font-semibold">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Streak</span>
                        <span className="font-semibold">6 months</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* District Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    District Rankings
                  </CardTitle>
                  <CardDescription>Total contributions by district this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {districts.slice(0, 8).map((district, index) => (
                      <div key={district.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0
                                ? "bg-yellow-100"
                                : index === 1
                                  ? "bg-gray-100"
                                  : index === 2
                                    ? "bg-orange-100"
                                    : "bg-blue-50"
                            }`}
                          >
                            {index === 0 ? (
                              <Crown className="w-4 h-4 text-yellow-600" />
                            ) : index === 1 ? (
                              <Medal className="w-4 h-4 text-gray-600" />
                            ) : index === 2 ? (
                              <Award className="w-4 h-4 text-orange-600" />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">#{district.rank}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{district.name}</div>
                            <div className="text-sm text-gray-600">{district.contributors} contributors</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">Le {district.total.toLocaleString()}</div>
                          <div
                            className={`text-sm flex items-center ${
                              district.change > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {district.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {Math.abs(district.change)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Top Contributors
                  </CardTitle>
                  <CardDescription>Individual leaders this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div
                        key={contributor.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0
                                ? "bg-yellow-100"
                                : index === 1
                                  ? "bg-gray-100"
                                  : index === 2
                                    ? "bg-orange-100"
                                    : "bg-emerald-50"
                            }`}
                          >
                            {index === 0 ? (
                              <Crown className="w-4 h-4 text-yellow-600" />
                            ) : index === 1 ? (
                              <Medal className="w-4 h-4 text-gray-600" />
                            ) : index === 2 ? (
                              <Award className="w-4 h-4 text-orange-600" />
                            ) : (
                              <span className="text-sm font-medium text-emerald-600">#{contributor.rank}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{contributor.name}</div>
                            <div className="text-sm text-gray-600">{contributor.district}</div>
                          </div>
                        </div>
                        <div className="font-semibold">Le {contributor.amount.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Full Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-6">
              {fundedProjects.map((project, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span>{project.district}</span>
                          <Badge variant="secondary">{project.category}</Badge>
                          <Badge
                            variant={
                              project.status === "Completed"
                                ? "default"
                                : project.status === "Active"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">
                          {Math.round((project.funded / project.goal) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Funded</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>
                            Le {project.funded.toLocaleString()} / Le {project.goal.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={(project.funded / project.goal) * 100} />
                      </div>
                      {project.status === "Funding" && <Button className="w-full">Support This Project</Button>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Overall Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">Le 15.2M</div>
                      <div className="text-gray-600">Total Funds Raised</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">23</div>
                        <div className="text-sm text-gray-600">Projects Funded</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">8,450</div>
                        <div className="text-sm text-gray-600">Total Contributors</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Agriculture Projects</span>
                        <span className="font-semibold">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Technology Initiatives</span>
                        <span className="font-semibold">6</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Youth Programs</span>
                        <span className="font-semibold">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Infrastructure</span>
                        <span className="font-semibold">4</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-emerald-500 pl-4">
                      <h4 className="font-semibold">Kenema Agricultural Center</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Fully funded processing center now serves 200+ farmers, increasing income by 40% on average.
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        Completed
                      </Badge>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">Bo Youth Tech Hub</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        85% funded. Training 50 young people in digital skills and entrepreneurship.
                      </p>
                      <Badge variant="outline" className="mt-2">
                        Active
                      </Badge>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold">Port Loko Women's Cooperative</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        56% funded. Supporting 30 women entrepreneurs with microfinance and business training.
                      </p>
                      <Badge variant="outline" className="mt-2">
                        Funding
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
