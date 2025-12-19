'use client';

import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {
    ChevronDown,
    ChevronUp,
    Search,
    ArrowRight,
    HelpCircle,
    Sparkles,
    MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import {cn} from '@/lib/utils';
import {faqCategories, faqs} from "@/types/faq";
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedItems, setExpandedItems] = useState<number[]>([]);

    const toggleExpanded = (id: number) => {
        setExpandedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-purple-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-violet-950/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl" />
                
                <div className="container relative">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                            <HelpCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                Frequently Asked Questions
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
                            Everything you need to know about{' '}
                            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                NaWeHub
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Find answers to common questions about our platform, features, and how to get started
                            with entrepreneurship support and Love Your District contributions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-8 sticky top-16 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
                <div className="container">
                    <div className="mx-auto max-w-4xl space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"/>
                            <Input
                                placeholder="Search frequently asked questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-14 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-800 focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {faqCategories.map((category) => {
                                const Icon = category.icon;
                                const isActive = selectedCategory === category.id;
                                return (
                                    <Button
                                        key={category.id}
                                        variant={isActive ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={cn(
                                            "flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 h-10",
                                            isActive 
                                                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 scale-105" 
                                                : "border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-600"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-2 w-2 rounded-full transition-colors",
                                            isActive ? "bg-white" : category.color
                                        )}/>
                                        <Icon className="h-4 w-4"/>
                                        <span>{category.name}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 flex-1">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        {filteredFAQs.length === 0 ? (
                            <Card className="text-center py-16 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                <CardContent>
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                                        <HelpCircle className="h-8 w-8 text-zinc-400"/>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">No questions found</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                        Try adjusting your search terms or selecting a different category.
                                    </p>
                                    <Button 
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCategory('all');
                                        }}
                                        className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl"
                                    >
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredFAQs.map((faq, index) => {
                                    const isExpanded = expandedItems.includes(faq.id);
                                    return (
                                        <Card
                                            key={faq.id}
                                            className={cn(
                                                "overflow-hidden transition-all duration-300 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
                                                isExpanded 
                                                    ? "shadow-xl shadow-violet-500/10 border-violet-200 dark:border-violet-800 ring-1 ring-violet-500/20" 
                                                    : "hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50"
                                            )}
                                            style={{animationDelay: `${index * 50}ms`}}
                                        >
                                            <CardHeader
                                                className="cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors p-6"
                                                onClick={() => toggleExpanded(faq.id)}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <CardTitle className="text-left text-lg font-semibold text-zinc-900 dark:text-white">
                                                            {faq.question}
                                                        </CardTitle>
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant="secondary"
                                                                className={cn(
                                                                    "text-xs font-medium",
                                                                    faq.category === 'general' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                                                    faq.category === 'entrepreneurship' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                                                                    faq.category === 'lyd' && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
                                                                    faq.category === 'technical' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                                )}
                                                            >
                                                                {faqCategories.find(cat => cat.id === faq.category)?.name}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                                        isExpanded 
                                                            ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rotate-180" 
                                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                                    )}>
                                                        <ChevronDown className="h-5 w-5"/>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            {isExpanded && (
                                                <CardContent className="pt-0 pb-6 px-6 animate-in slide-in-from-top-2 duration-300">
                                                    <div className="pl-0 border-l-2 border-violet-200 dark:border-violet-800 ml-0 -ml-6 pl-6">
                                                        <div className="prose prose-sm max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                                            {faq.answer.split('. ').map((sentence, idx) => (
                                                                <p key={idx} className="mb-3 last:mb-0">
                                                                    {sentence.trim()}{sentence.includes(':') ? '' : '.'}
                                                                </p>
                                                            ))}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                                            {faq.tags.map((tag) => (
                                                                <Badge 
                                                                    key={tag} 
                                                                    variant="outline" 
                                                                    className="text-xs border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                                                                >
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
                <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

                <div className="container relative">
                    <div className="mx-auto max-w-2xl text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Need more help?</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Still have questions?
                        </h2>
                        <p className="text-lg text-white/80 mb-8">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <Button 
                                    size="lg" 
                                    className="bg-white text-violet-600 hover:bg-zinc-100 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 h-12 px-8"
                                >
                                    Contact Support
                                    <ArrowRight className="ml-2 h-5 w-5"/>
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="border-2 border-white/30 text-white hover:text-white hover:bg-white/20 font-semibold rounded-xl h-12 px-8"
                                >
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
