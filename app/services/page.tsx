"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import {Footer} from "@/components/public/footer";
import AppHeader from "@/components/public/app-header";

// Dynamically import motion and AnimatePresence
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

export default function Services() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Navigation */}
            <AppHeader isVisible={true} />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto">
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Our Services
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                            Discover how eWomen Hub can help you grow your business and contribute to your community.
                        </p>
                    </MotionDiv>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <MotionDiv
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-lg bg-card hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                                <p className="text-muted-foreground mb-6">{service.description}</p>
                                <ul className="space-y-3">
                                    {service.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-2">
                                            <span className="text-primary">•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </MotionDiv>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
                <div className="container mx-auto px-4 text-center">
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Join our community of entrepreneurs and start growing your business today.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="text-lg">
                                    Register Now
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="text-lg">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </MotionDiv>
                </div>
            </section>

            {/*  footer  */}
            <Footer />
        </div>
    );
}

const services = [
    {
        title: "Business Support",
        description: "Comprehensive tools and resources to help your business thrive.",
        features: [
            "Access to business development resources",
            "Financial management tools",
            "Marketing and branding support",
            "Legal and compliance guidance",
            "Networking opportunities",
        ],
    },
    {
        title: "Love Your District",
        description: "Make a difference in your community through our innovative micro-donation system.",
        features: [
            "Easy micro-donation system",
            "Real-time impact tracking",
            "Community project funding",
            "District-level leaderboards",
            "Transparent fund management",
        ],
    },
    {
        title: "Resource Library",
        description: "Access a wealth of knowledge and tools to grow your business.",
        features: [
            "Business templates and guides",
            "Financial planning tools",
            "Marketing resources",
            "Legal documentation",
            "Training materials",
        ],
    },
    {
        title: "Networking & Community",
        description: "Connect with other entrepreneurs and build valuable relationships.",
        features: [
            "Business matchmaking",
            "Discussion forums",
            "Virtual events and webinars",
            "Mentorship opportunities",
            "Local meetups",
        ],
    },
];