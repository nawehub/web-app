'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, TrendingUp, Shield, Globe, Smartphone } from "lucide-react"
import Link from "next/link"
import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/public/navbar";
import {Footer} from "@/components/public/footer";

// Dynamically import motion and AnimatePresence
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

export default function HomePage() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Header */}
        <Navbar />

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              Supporting SMEs Across Sierra Leone
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r text-gray-700">
              Empowering SMEs Across Sierra Leone
              <br />
              <span className="text-emerald-600">Building Districts.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive platform connecting entrepreneurs with resources, funding, and community support while
              fostering district-level development through voluntary micro-contributions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className={"text-lg"} asChild>
                <Link href="/register">
                  Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/lyd">Support Your District</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Two Platforms, One Mission</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Business Support */}
              <Card className="border-2 hover:border-emerald-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-2xl">Business Support Hub</CardTitle>
                  <CardDescription>Comprehensive resources and tools for SME growth and development</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      Resource Library & Templates
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      Financing & Grant Information
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      Regulatory Compliance Guides
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      Business Networking
                    </li>
                  </ul>
                  <Button className="w-full mt-6" asChild>
                    <Link href="/dashboard">Access Business Tools</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* LYD Platform */}
              <Card className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Love Your District (LYD)</CardTitle>
                  <CardDescription>Community-driven development through voluntary micro-contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Micro-donations from Le 1
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      District Leaderboards
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Transparent Fund Management
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Community Project Funding
                    </li>
                  </ul>
                  <Button className="w-full mt-6" variant="outline" asChild>
                    <Link href="/lyd">Support Your District</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-emerald-600 text-white">
          <div className="container mx-auto">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Your all-in-one platform for business growth, community development, and district-level innovation.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="text-lg bg-black hover:bg-gray-600">
                    Get Started
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" className="text-lg bg-white hover:bg-gray-200 text-gray-800">
                    Learn More
                  </Button>
                </Link>
              </div>
            </MotionDiv>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Transparent</h3>
                <p className="text-gray-600">
                  End-to-end encryption with full transparency in fund management and project tracking.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile-First Design</h3>
                <p className="text-gray-600">
                  Optimized for mobile devices with offline capabilities and low-bandwidth support.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Networking</h3>
                <p className="text-gray-600">Connect with other entrepreneurs, mentors, and potential partners in your area.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Business Support</h3>
                <p className="text-gray-600">
                  End-to-end encryption with full transparency in fund management and project tracking.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile-First Design</h3>
                <p className="text-gray-600">
                  Optimized for mobile devices with offline capabilities and low-bandwidth support.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Networking</h3>
                <p className="text-gray-600">Connect with other entrepreneurs, mentors, and potential partners in your area.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-emerald-600 text-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">16</div>
                <div className="text-emerald-100">Districts Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">1,000+</div>
                <div className="text-emerald-100">SMEs Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Le 50M+</div>
                <div className="text-emerald-100">Funds Raised</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-emerald-100">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs and community members building a stronger Sierra Leone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/faqs">Get Help</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
  )
}
