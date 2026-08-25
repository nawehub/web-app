import {FacebookGlyph, InstagramGlyph, LinkedinGlyph, XGlyph} from "@/components/icons";
import {Building2, Lightbulb, TrendingUp} from "lucide-react";

export const platformLinks = [
    { label: 'Home', href: '/web' },
    { label: 'Vetted Entrepreneurs', href: '/web/vetted-entrepreneurs' },
    { label: 'Opportunities', href: '/web/opportunities' },
    { label: 'Next Big Idea', href: '/web/next-big-idea' },
    { label: 'FAQ', href: '/web/faq' },
    { label: 'Contact', href: '/web/contact' },
]

export const getStartedLinks = [
    { label: 'Visit Entrepreneur Portal', href: 'https://app.nawehub.com', icon: Lightbulb },
    { label: 'Register Your Business', href: '/web/register-business', icon: Building2 },
]

export const socials = [
    { label: 'Facebook', href: 'https://facebook.com/Ewomensl', icon: FacebookGlyph },
    { label: 'X (Twitter)', href: 'https://x.com/Ewomensl', icon: XGlyph },
    { label: 'Instagram', href: 'https://instagram.com/Ewomensl', icon: InstagramGlyph },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/Ewomensl', icon: LinkedinGlyph },
]