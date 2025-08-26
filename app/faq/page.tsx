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
    HelpCircle
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
        <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <AppHeader isVisible={true} />

            {/* Hero Section */}
            <section className="relative py-20 sm:py-32">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5"/>
                <div className="container relative">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                            <HelpCircle className="mr-2 h-4 w-4"/>
                            Frequently Asked Questions
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Everything you need to know about{' '}
                            <span
                                className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                                NaWeHub
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
                            Find answers to common questions about our platform, features, and how to get started
                            with entrepreneurship support and Love Your District contributions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="search-question__wrap py-12 bg-white/50">
                <div className="container">
                    <div className="mx-auto max-w-4xl space-y-8">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                placeholder="Search frequently asked questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-3 justify-center">
                            {faqCategories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200",
                                        selectedCategory === category.id && "shadow-lg scale-105"
                                    )}
                                >
                                    <div className={cn("h-2 w-2 rounded-full", category.color)}/>
                                    <category.icon className="h-4 w-4"/>
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-8">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        {filteredFAQs.length === 0 ? (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                                    <h3 className="text-lg font-medium mb-2">No questions found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Try adjusting your search terms or selecting a different category.
                                    </p>
                                    <Button onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                    }}>
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredFAQs.map((faq, index) => (
                                    <Card
                                        key={faq.id}
                                        className={cn(
                                            "overflow-hidden transition-all duration-300 hover:shadow-lg",
                                            expandedItems.includes(faq.id) && "shadow-lg border-blue-200"
                                        )}
                                        style={{animationDelay: `${index * 50}ms`}}
                                    >
                                        <CardHeader
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => toggleExpanded(faq.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <CardTitle
                                                        className="text-left text-lg font-semibold text-gray-900 pr-4">
                                                        {faq.question}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className={cn(
                                                                "text-xs",
                                                                faq.category === 'general' && "bg-green-100 text-green-700",
                                                                faq.category === 'entrepreneurship' && "bg-purple-100 text-purple-700",
                                                                faq.category === 'lyd' && "bg-red-100 text-red-700",
                                                                faq.category === 'technical' && "bg-orange-100 text-orange-700"
                                                            )}
                                                        >
                                                            {faqCategories.find(cat => cat.id === faq.category)?.name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {expandedItems.includes(faq.id) ? (
                                                        <ChevronUp className="h-5 w-5 text-muted-foreground"/>
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-muted-foreground"/>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        {expandedItems.includes(faq.id) && (
                                            <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-300">
                                                <div
                                                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                                                    {faq.answer.split('. ').map((sentence, idx) => (
                                                        <p key={idx} className="mb-2">
                                                            {sentence.trim()}{sentence.includes(':') ? '' : '.'}
                                                        </p>
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                                                    {faq.tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                            Still have questions?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    Write Us a Message
                                    <ArrowRight className="ml-2 h-5 w-5"/>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}