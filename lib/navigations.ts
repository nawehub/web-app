import {FacebookGlyph, InstagramGlyph, LinkedinGlyph, XGlyph} from "@/components/icons";
import {Building2, Lightbulb, TrendingUp} from "lucide-react";

export const platformLinks = [
    { label: 'Home', href: '/web' },
    { label: 'Opportunities', href: '/web/opportunities' },
    { label: 'Vetted Entrepreneurs', href: '/web/vetted-entrepreneurs' },
    { label: 'Next Big Idea', href: '/web/next-big-idea' },
    { label: 'FAQ', href: '/web/faq' },
    { label: 'Contact', href: '/web/contact' },
]

export const getStartedLinks = [
    { label: 'Register as Investor', href: '/web/register/investor', icon: TrendingUp },
    { label: 'Register as Entrepreneur', href: '/web/register/entrepreneur', icon: Lightbulb },
    { label: 'Register Your Business', href: '/web/register-business', icon: Building2 },
]

export const socials = [
    { label: 'Facebook', href: 'https://facebook.com', icon: FacebookGlyph },
    { label: 'X (Twitter)', href: 'https://x.com', icon: XGlyph },
    { label: 'Instagram', href: 'https://instagram.com', icon: InstagramGlyph },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: LinkedinGlyph },
]