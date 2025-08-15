import {Briefcase, Heart, HelpCircle, Shield, Users} from "lucide-react";

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: 'general' | 'entrepreneurship' | 'lyd' | 'technical';
    tags: string[];
}

export const faqs: FAQ[] = [
    {
        id: 1,
        question: "What is the NaWeHub app?",
        answer: "NaWeHub is an innovative platform developed by eWomen to support entrepreneurs, especially those in Sierra Leone. It offers access to funding, resources, events, and tools for business growth while also promoting community-driven district development.",
        category: 'general',
        tags: ['platform', 'eWomen', 'entrepreneurs', 'Sierra Leone']
    },
    {
        id: 2,
        question: "Who can use NaWeHub?",
        answer: "The app is designed for: Entrepreneurs in Sierra Leone and beyond, Lovers of Sierra Leone who want to support district-level development, Development partners, hubs, and organizations seeking to reach local innovators.",
        category: 'general',
        tags: ['users', 'entrepreneurs', 'partners', 'access']
    },
    {
        id: 3,
        question: "What are the main features of the app?",
        answer: "NaWeHub offers two key features: 1. Entrepreneurship Support – Centralized access to funding opportunities, events, business resources, and online business registration. 2. Love Your District – A micro-contribution system where anyone can donate as little as 5 SLE to support entrepreneurs and impactful district projects.",
        category: 'general',
        tags: ['features', 'entrepreneurship', 'love your district', 'funding']
    },
    {
        id: 4,
        question: "How does the \"Entrepreneurship Support\" feature work?",
        answer: "This feature provides: Funding options posted by development partners worldwide, Event updates from hubs and organizations, Downloadable resources such as business plan templates, Assistance in registering your business online.",
        category: 'entrepreneurship',
        tags: ['support', 'funding', 'events', 'resources', 'registration']
    },
    {
        id: 5,
        question: "What is \"Love Your District\" and why is it important?",
        answer: "It's a transparent development fund where contributions (minimum 5 SLE) go toward: Supporting young entrepreneurs, Funding impactful district projects, Promoting local economic growth. Contributors are automatically registered as taxpayers, with the minimum contribution matching the local tax cost.",
        category: 'lyd',
        tags: ['love your district', 'development', 'contributions', 'taxpayers']
    },
    {
        id: 6,
        question: "Is my contribution safe and transparent?",
        answer: "Yes. All funds are managed transparently, with reports and project updates available to contributors.",
        category: 'lyd',
        tags: ['safety', 'transparency', 'reports', 'updates']
    },
    {
        id: 7,
        question: "Why is NaWeHub calling \"Love Your District\" the 'GoFundMe' of Sierra Leone?",
        answer: "Because it's designed to be Sierra Leone's own community funding platform—filling the gap left by international crowdfunding sites that often exclude Sierra Leone from participation.",
        category: 'lyd',
        tags: ['GoFundMe', 'crowdfunding', 'community', 'Sierra Leone']
    },
    {
        id: 8,
        question: "How much can I contribute?",
        answer: "You can contribute as little as 5 SLE or more, depending on your capacity and interest.",
        category: 'lyd',
        tags: ['contribution', 'amount', 'minimum', '5 SLE']
    },
    {
        id: 9,
        question: "What benefits do I get as a contributor?",
        answer: "Recognition as a taxpayer for the year, Updates on funded projects and their impact, The satisfaction of directly supporting your district's growth.",
        category: 'lyd',
        tags: ['benefits', 'taxpayer', 'updates', 'impact']
    },
    {
        id: 10,
        question: "How do I access the app?",
        answer: "NaWeHub will be available for download on mobile platforms and accessible via the web (details provided on launch). Simply register, choose your preferred feature, and start contributing or benefiting from entrepreneurship support.",
        category: 'technical',
        tags: ['access', 'download', 'mobile', 'web', 'registration']
    }
];

export const faqCategories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle, color: 'bg-blue-500' },
    { id: 'general', name: 'General', icon: Briefcase, color: 'bg-green-500' },
    { id: 'entrepreneurship', name: 'Entrepreneurship', icon: Users, color: 'bg-purple-500' },
    { id: 'lyd', name: 'Love Your District', icon: Heart, color: 'bg-red-500' },
    { id: 'technical', name: 'Technical', icon: Shield, color: 'bg-orange-500' }
];