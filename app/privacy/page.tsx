'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Shield,
    Eye,
    Users,
    Lock,
    Database,
    UserCheck,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    FileText,
    Zap,
    ArrowRight,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Globe,
    Building,
    Heart,
    Scale
} from 'lucide-react';
import Link from 'next/link';
import {Footer} from "@/components/public/footer";
import AppHeader from "@/components/public/app-header";
import {useIsMobile} from "@/hooks/use-mobile";

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const isMobile = useIsMobile()

    const privacySections = [
        {
            id: 'information-collect',
            icon: <Database className="h-6 w-6" />,
            title: 'Information We Collect',
            color: 'from-blue-500 to-cyan-500',
            content: [
                {
                    subtitle: 'Personal Information',
                    description: 'Name, email address, phone number, and business details provided during registration.'
                },
                {
                    subtitle: 'Usage Data',
                    description: 'How you interact with the app (features used, pages visited, session length).'
                },
                {
                    subtitle: 'Device Information',
                    description: 'Device type, operating system, and basic technical data for troubleshooting and app improvement.'
                }
            ]
        },
        {
            id: 'how-we-use',
            icon: <Eye className="h-6 w-6" />,
            title: 'How We Use Your Information',
            color: 'from-purple-500 to-pink-500',
            content: [
                {
                    subtitle: 'Account Management',
                    description: 'To create and manage your account.'
                },
                {
                    subtitle: 'Connection Services',
                    description: 'To connect entrepreneurs with resources, partners, and funding opportunities.'
                },
                {
                    subtitle: 'App Improvement',
                    description: 'To improve app performance and user experience.'
                },
                {
                    subtitle: 'Communications',
                    description: 'To send important updates, notifications, and support messages.'
                }
            ]
        },
        {
            id: 'sharing-info',
            icon: <Users className="h-6 w-6" />,
            title: 'Sharing of Information',
            color: 'from-green-500 to-emerald-500',
            content: [
                {
                    subtitle: 'Partners',
                    description: 'Only when necessary to connect you with resources, mentors, or opportunities you request.'
                },
                {
                    subtitle: 'Service Providers',
                    description: 'For technical support, hosting, and analytics.'
                },
                {
                    subtitle: 'Legal Authorities',
                    description: 'If required by law or to protect user safety.'
                }
            ]
        },
        {
            id: 'data-security',
            icon: <Lock className="h-6 w-6" />,
            title: 'Data Security',
            color: 'from-orange-500 to-red-500',
            content: [
                {
                    subtitle: 'Protection Measures',
                    description: 'We use reasonable technical and organizational measures to protect your data. However, no system is 100% secure, and we cannot guarantee absolute security.'
                }
            ]
        },
        {
            id: 'data-retention',
            icon: <RefreshCw className="h-6 w-6" />,
            title: 'Data Retention',
            color: 'from-indigo-500 to-purple-500',
            content: [
                {
                    subtitle: 'Storage Duration',
                    description: 'Your personal information will be stored only as long as necessary to provide services or as required by law.'
                }
            ]
        },
        {
            id: 'your-rights',
            icon: <UserCheck className="h-6 w-6" />,
            title: 'Your Rights',
            color: 'from-teal-500 to-cyan-500',
            content: [
                {
                    subtitle: 'Access & Update',
                    description: 'Access and update your information in the app.'
                },
                {
                    subtitle: 'Data Deletion',
                    description: 'Request deletion of your account and associated data.'
                },
                {
                    subtitle: 'Communication Preferences',
                    description: 'Opt out of non-essential communications.'
                }
            ]
        },
        {
            id: 'policy-changes',
            icon: <AlertTriangle className="h-6 w-6" />,
            title: 'Changes to This Policy',
            color: 'from-yellow-500 to-orange-500',
            content: [
                {
                    subtitle: 'Temporary Status',
                    description: 'This is a temporary privacy policy. It may be updated or replaced once the full legal policy is finalized. We will notify users within the app when major updates are made.'
                }
            ]
        }
    ];

    const termsSections = [
        {
            id: 'purpose',
            icon: <Globe className="h-6 w-6" />,
            title: 'Purpose of NaWeHub',
            color: 'from-blue-500 to-indigo-500',
            content: [
                {
                    subtitle: 'Entrepreneur Showcase',
                    description: 'Entrepreneurs to showcase their ideas and businesses.'
                },
                {
                    subtitle: 'Partner Discovery',
                    description: 'Partners and investors to discover opportunities.'
                },
                {
                    subtitle: 'Community Support',
                    description: 'Citizens to support local initiatives (e.g., Love Your District).'
                }
            ]
        },
        {
            id: 'responsibilities',
            icon: <CheckCircle className="h-6 w-6" />,
            title: 'User Responsibilities',
            color: 'from-green-500 to-teal-500',
            content: [
                {
                    subtitle: 'Accurate Information',
                    description: 'Provide accurate and honest information when creating an account or posting content.'
                },
                {
                    subtitle: 'Lawful Use',
                    description: 'Use the platform for lawful purposes only.'
                },
                {
                    subtitle: 'Respectful Behavior',
                    description: 'Respect other users and avoid abusive, harmful, or misleading behavior.'
                }
            ]
        },
        {
            id: 'donations',
            icon: <Heart className="h-6 w-6" />,
            title: 'Contributions & Donations',
            color: 'from-pink-500 to-rose-500',
            content: [
                {
                    subtitle: 'Voluntary Donations',
                    description: 'Donations made through Love Your District or other features are voluntary and non-refundable.'
                },
                {
                    subtitle: 'Transparency',
                    description: 'NaWeHub will make reasonable efforts to ensure transparency on how funds are applied.'
                }
            ]
        },
        {
            id: 'content-ownership',
            icon: <FileText className="h-6 w-6" />,
            title: 'Content Ownership',
            color: 'from-purple-500 to-indigo-500',
            content: [
                {
                    subtitle: 'User Ownership',
                    description: 'Users retain ownership of the content they share.'
                },
                {
                    subtitle: 'Platform Permission',
                    description: 'By posting on NaWeHub, you grant us permission to display and share your content within the app for community purposes.'
                }
            ]
        },
        {
            id: 'liability',
            icon: <Scale className="h-6 w-6" />,
            title: 'Limitation of Liability',
            color: 'from-orange-500 to-yellow-500',
            content: [
                {
                    subtitle: 'As-Is Service',
                    description: 'NaWeHub is provided "as is". While we work to maintain reliability, we are not liable for technical interruptions or errors.'
                },
                {
                    subtitle: 'User Responsibility',
                    description: 'We are not liable for losses resulting from user reliance on information or services within the app.'
                }
            ]
        },
        {
            id: 'terms-updates',
            icon: <RefreshCw className="h-6 w-6" />,
            title: 'Updates to Terms',
            color: 'from-cyan-500 to-blue-500',
            content: [
                {
                    subtitle: 'Temporary Terms',
                    description: 'These Terms of Use are temporary and may be updated as the platform grows. Continued use of NaWeHub means you accept any changes.'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <AppHeader isVisible={true} />

            <div className={`flex-1 space-y-4 px-4 md:p-8 ${isMobile ? 'mt-20' : 'mt-16'}`}>

                {/* Hero Section */}
                <section className="relative py-16 sm:py-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5" />
                    <div className="container relative">
                        <div className="mx-auto max-w-4xl text-center">
                            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
                                <Shield className="mr-2 h-4 w-4" />
                                Privacy & Terms
                            </Badge>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                Privacy Policy &{' '}
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Terms of Use
              </span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
                                Your privacy and trust are fundamental to our mission of supporting entrepreneurs
                                and communities across Sierra Leone.
                            </p>

                            {/* Policy Dates */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full backdrop-blur-sm">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">Effective: October 1, 2025</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full backdrop-blur-sm">
                                    <RefreshCw className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium">Updated: August 1, 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Introduction */}
                <section className="py-12 bg-white/50">
                    <div className="container">
                        <div className={`mx-auto max-w-4xl ${isMobile ? '-mx-4' : ''}`}>
                            <Card className={`border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 ${isMobile ? 'rounded-none' : ''}`}>
                                <CardContent className="p-8">
                                    <div className={`items-start gap-4`}>
                                        <div className="flex items-center justify-start gap-4 mb-3 ">
                                            <div className={'flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600'}>
                                                <AlertTriangle className="h-6 w-6 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Temporary Policy Notice</h2>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-700 leading-relaxed">
                                                At NaWeHub, we value your privacy and are committed to protecting your personal information.
                                                This temporary privacy policy explains how we collect, use, and safeguard data while you use
                                                the NaWeHub app. A more detailed and permanent privacy policy will be published after the app's official launch.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Privacy Policy Sections */}
                <section className="py-16">
                    <div className="container">
                        <div className="mx-auto max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                                    Privacy Policy
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Understanding how we protect and handle your personal information
                                </p>
                            </div>

                            <div className={`grid gap-6 lg:grid-cols-2 ${isMobile ? '-mx-4' : ''}`}>
                                {privacySections.map((section, index) => (
                                    <Card
                                        key={section.id}
                                        className={`group relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl w-full ${isMobile ? 'rounded-none' : ''}`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                                        <CardHeader className="relative">
                                            <div className="flex items-center gap-4">
                                                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${section.color} text-white`}>
                                                    {section.icon}
                                                </div>
                                                <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="relative space-y-4">
                                            {section.content.map((item, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <h4 className="font-medium text-gray-900">{item.subtitle}</h4>
                                                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                                    {idx < section.content.length - 1 && <Separator className="my-3" />}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Terms of Use Sections */}
                <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="container">
                        <div className="mx-auto max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                                    Terms of Use
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Guidelines for using NaWeHub platform responsibly and effectively
                                </p>
                            </div>

                            <div className={`grid gap-6 lg:grid-cols-2 ${isMobile ? '-mx-4' : ''}`}>
                                {termsSections.map((section, index) => (
                                    <Card
                                        key={section.id}
                                        className={`group relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl w-full ${isMobile ? 'rounded-none' : ''}`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                                        <CardHeader className="relative">
                                            <div className="flex items-center gap-4">
                                                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${section.color} text-white`}>
                                                    {section.icon}
                                                </div>
                                                <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="relative space-y-4">
                                            {section.content.map((item, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <h4 className="font-medium text-gray-900">{item.subtitle}</h4>
                                                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                                    {idx < section.content.length - 1 && <Separator className="my-3" />}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Love Your District Special Section */}
                <section className="py-16">
                    <div className="container">
                        <div className={`mx-auto max-w-4xl ${isMobile ? '-mx-4' : ''}`}>
                            <Card className={`border-0 shadow-xl bg-gradient-to-r from-pink-50 to-rose-50 ${isMobile ? 'rounded-none' : ''}`}>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                                            <Heart className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold">Love Your District Fund Management</CardTitle>
                                            <CardDescription className="text-lg">
                                                Transparent community project funding and administration
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Fund Administration</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Funds raised through Love Your District (LYD) are directed toward community projects.
                                            The administration of the NaWeHub system, managed by eWomen, oversees this process.
                                            Leveraging its expertise in innovation, eWomen can recommend potential projects for
                                            each district or chiefdom to local stakeholders.
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Project Approval Process</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            For each district, there is a curated list of potential projects. These projects,
                                            created and published by the NaWeHub admin, are open for online voting—even for
                                            users who access the system as guests (not logged in). Once projects are reviewed
                                            and approved by both stakeholders and the public, they will be funded through LYD.
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Transparency & Accountability</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Approved projects are marked as "APPROVED – IMPLEMENTATION ONGOING," while
                                            successfully completed projects are showcased as success stories to highlight
                                            impact and accountability.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-16 bg-white/50">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                                    Contact Us
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Have questions about our privacy policy or terms? We're here to help.
                                </p>
                            </div>

                            <div className={`grid gap-6 md:grid-cols-3 ${isMobile ? '-mx-4' : ''}`}>
                                <Card className={`border-0 shadow-lg bg-white/80 backdrop-blur-sm ${isMobile ? 'rounded-none' : ''}`}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                                                <Mail className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Email</h3>
                                                <p className="text-gray-600">info@ewomensl.com</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={`border-0 shadow-lg bg-white/80 backdrop-blur-sm ${isMobile ? 'rounded-none' : ''}`}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600">
                                                <Phone className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Phone</h3>
                                                <p className="text-gray-600">+232 78 976369</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={`border-0 shadow-lg bg-white/80 backdrop-blur-sm ${isMobile ? 'rounded-none' : ''}`}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-pink-600">
                                                <MapPin className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Address</h3>
                                                <p className="text-gray-600">59 Rogbaneh Road, Makeni City</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="container">
                        <div className={`mx-auto max-w-2xl text-center ${isMobile ? '-mx-4' : ''}`}>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                                Ready to Transform Your Business?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Join thousands of entrepreneurs across Sierra Leone who trust NaWeHub
                                with their business growth and community development.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        Get Started Today
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" size="lg">
                                        Contact Support
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}