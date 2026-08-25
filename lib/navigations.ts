import {FacebookGlyph, InstagramGlyph, LinkedinGlyph, XGlyph} from "@/components/icons";
import {Building2, Lightbulb, TrendingUp} from "lucide-react";

export const platformLinks = [
    { label: 'Home', href: '/' },
    { label: 'Vetted Entrepreneurs', href: '/vetted-entrepreneurs' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Next Big Idea', href: '/next-big-idea' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
]

export const getStartedLinks = [
    { label: 'Visit Entrepreneur Portal', href: 'https://app.nawehub.com', icon: Lightbulb },
    { label: 'Register Your Business', href: '/register-business', icon: Building2 },
]

export const socials = [
    { label: 'Facebook', href: 'https://facebook.com/Ewomensl', icon: FacebookGlyph },
    { label: 'X (Twitter)', href: 'https://x.com/Ewomensl', icon: XGlyph },
    { label: 'Instagram', href: 'https://instagram.com/Ewomensl', icon: InstagramGlyph },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/Ewomensl', icon: LinkedinGlyph },
]