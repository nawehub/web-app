import React from 'react';
import {
    Search, Grid, List, ChevronDown, SlidersHorizontal,
    MapPin, Calendar, Clock, DollarSign, Award,
    Bookmark, Share2, Mail, MessageCircle, ArrowRight,
    TrendingUp, GraduationCap, Users, Briefcase, Leaf,
    User, Zap, BookOpen, Bell, ShieldCheck, FileText
} from 'lucide-react';

export default function OpportunitiesPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">

            {/* --- NAVBAR --- */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-900 tracking-tight">
              NaWe<span className="text-emerald-500">Hub</span>
            </span>
                        <span className="text-[10px] block text-emerald-600 font-medium leading-none max-w-[100px] mt-1 hidden md:block">
              Connecting. Empowering. Transforming.
            </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        <a href="#" className="hover:text-blue-900">Home</a>
                        <a href="#" className="hover:text-blue-900">About</a>
                        <a href="#" className="hover:text-blue-900">Startups</a>
                        <a href="#" className="hover:text-blue-900">Events</a>
                        <a href="#" className="text-emerald-600 border-b-2 border-emerald-500 pb-1">Opportunities</a>
                        <a href="#" className="hover:text-blue-900">Community</a>
                        <a href="#" className="hover:text-blue-900 flex items-center gap-1">Resources <ChevronDown size={14} /></a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:text-slate-800"><Search size={20} /></button>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 relative">
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                            <User size={18} />
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition">
                            Login / Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white relative overflow-hidden py-16 lg:py-24">
                {/* Decorative Floating Badges Mockup */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

                    <div className="lg:col-span-7 space-y-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Discover <span className="text-emerald-400">Grants, Events, Competitions</span> & Opportunities for Entrepreneurs
                        </h1>
                        <p className="text-slate-300 text-base md:text-lg max-w-xl font-light leading-relaxed">
                            Explore verified funding calls, innovation challenges, trainings, fellowships, scholarship opportunities across Sierra Leone, Africa, and the world.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium shadow-md flex items-center gap-2 transition">
                                <Grid size={18} /> Browse Opportunities
                            </button>
                            <button className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition">
                                <FileText size={18} /> Submit Opportunity
                            </button>
                            <button className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition">
                                <Calendar size={18} /> Upcoming Events
                            </button>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-emerald-400">250+</div>
                                <div className="text-xs text-slate-400 mt-1">Active Opportunities</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-amber-400">35+</div>
                                <div className="text-xs text-slate-400 mt-1">Upcoming Events</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-sky-400">120+</div>
                                <div className="text-xs text-slate-400 mt-1">Funding Programs</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-purple-400">50+</div>
                                <div className="text-xs text-slate-400 mt-1">Partners & Donors</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Hero Image Column mimicking "opportunities-design.jpeg" */}
                    <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                        <div className="relative w-80 h-96 lg:w-96 lg:h-[420px] rounded-3xl overflow-hidden bg-slate-800 shadow-2xl border-4 border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600"
                                alt="Entrepreneur using laptop"
                                className="w-full h-full object-cover opacity-90"
                            />
                        </div>
                        {/* Overlay badge 1 */}
                        <div className="absolute top-10 -left-6 bg-white text-slate-900 p-3 rounded-xl shadow-lg flex items-center gap-3 border border-slate-100">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><DollarSign size={20} /></div>
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Funding</div>
                                <div className="text-sm font-extrabold text-slate-800">120+ Programs</div>
                            </div>
                        </div>
                        {/* Overlay badge 2 */}
                        <div className="absolute bottom-20 -right-4 bg-white text-slate-900 p-3 rounded-xl shadow-lg flex items-center gap-3 border border-slate-100">
                            <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Award size={20} /></div>
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Competitions</div>
                                <div className="text-sm font-extrabold text-slate-800">45+ Open</div>
                            </div>
                        </div>
                    </div>

                </div>
            </header>

            {/* --- CATEGORIES SECTION --- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Explore by Category</h2>
                    <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        View All Categories <ArrowRight size={16} />
                    </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-4">
                    {[
                        { label: 'Grants & Funding', count: '120+', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
                        { label: 'Competitions', count: '45+', icon: Award, color: 'bg-amber-50 text-amber-600' },
                        { label: 'Events & Conferences', count: '35+', icon: Calendar, color: 'bg-indigo-50 text-indigo-600' },
                        { label: 'Training & Workshops', count: '60+', icon: GraduationCap, color: 'bg-blue-50 text-blue-600' },
                        { label: 'Fellowships', count: '25+', icon: Users, color: 'bg-teal-50 text-teal-600' },
                        { label: 'Scholarships', count: '30+', icon: BookOpen, color: 'bg-rose-50 text-rose-600' },
                        { label: 'Incubators & Accel.', count: '20+', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
                        { label: 'Jobs & Internships', count: '40+', icon: Briefcase, color: 'bg-sky-50 text-sky-600' },
                        { label: 'Climate Economy', count: '25+', icon: Leaf, color: 'bg-green-50 text-green-600' },
                        { label: 'Women Opportunities', count: '35+', icon: User, color: 'bg-pink-50 text-pink-600' },
                        { label: 'Youth Innovation', count: '50+', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
                    ].map((cat, i) => (
                        <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col items-center text-center justify-between hover:shadow-md transition cursor-pointer">
                            <div className={`p-3 rounded-xl ${cat.color} mb-3`}>
                                <cat.icon size={22} />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 leading-tight mb-2 min-h-[32px] flex items-center justify-center">
                {cat.label}
              </span>
                            <span className="text-xs font-bold text-slate-400">{cat.count}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SEARCH & FILTERS CONTROLS --- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                        <div className="lg:col-span-4 relative">
                            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search opportunities, events, grants..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition"
                            />
                        </div>

                        {['All Categories', 'All Locations', 'Anytime', 'All Types'].map((filter, idx) => (
                            <div key={idx} className="lg:col-span-2 relative">
                                <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer">
                                    <option>{filter}</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-4 text-slate-400 pointer-events-none" size={14} />
                            </div>
                        ))}

                        <div className="lg:col-span-2 flex gap-2">
                            <button className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 flex items-center justify-center gap-2">
                                <SlidersHorizontal size={16} /> More
                            </button>
                            <button className="text-sm font-bold text-red-500 hover:text-red-600 px-2">Clear All</button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t border-slate-100 gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>Sort by:</span>
                            <select className="bg-transparent font-bold text-slate-800 focus:outline-none">
                                <option>Newest First</option>
                                <option>Deadline Imminent</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg self-stretch sm:self-auto">
                            <button className="bg-white text-slate-800 shadow-xs px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1">
                                <Grid size={14} /> Grid View
                            </button>
                            <button className="text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1">
                                <List size={14} /> List View
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURED OPPORTUNITIES --- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-900">Featured Opportunities</h2>
                        <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-100">
                          Handpicked for you
                        </span>
                    </div>
                    <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        View All Opportunities <ArrowRight size={16} />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "African Climate Innovation Grant 2026",
                            type: "Grant", location: "Africa", text: "Supporting innovative solutions to climate change across Africa.",
                            funding: "$25,000", deadline: "30 Jun 2026", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400",
                            tags: ["FEATURED", "NEW"], tagColor: "bg-emerald-600"
                        },
                        {
                            title: "Tony Elumelu Foundation Entrepreneurship Programme",
                            type: "Program", location: "Africa", text: "Empowering African entrepreneurs through funding, mentorship and training.",
                            funding: "$5,000", deadline: "15 May 2026", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400",
                            tags: ["FEATURED", "NEW"], tagColor: "bg-blue-600"
                        },
                        {
                            title: "Women in Tech Conference 2026",
                            type: "Event", location: "Sierra Leone", text: "A conference celebrating women innovating in technology.",
                            funding: "20 - 22 Jun 2026", deadline: "Freetown, SL", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400",
                            tags: ["FEATURED", "5 DAYS LEFT"], tagColor: "bg-indigo-600"
                        },
                        {
                            title: "Green Innovation Challenge 2026",
                            type: "Competition", location: "Global", text: "Innovate for a sustainable future. Open to youth and startups.",
                            funding: "$10,000", deadline: "10 Jun 2026", image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=400",
                            tags: ["FEATURED", "2 WEEKS LEFT"], tagColor: "bg-amber-600"
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                            <div className="relative h-44 bg-slate-100">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3 flex gap-1">
                                    {item.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className={`text-[10px] font-extrabold text-white px-2 py-0.5 rounded shadow-sm ${tIdx === 0 ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                                        {item.type} • {item.location}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.text}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400">Funding / Date</div>
                                        <div className="text-xs font-bold text-emerald-600">{item.funding}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400">Deadline</div>
                                        <div className="text-xs font-bold text-red-500">{item.deadline}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button className="flex-1 text-slate-700 hover:bg-slate-50 border border-slate-200 py-2 rounded-lg text-xs font-bold transition">
                                        View Details
                                    </button>
                                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition">
                                        Apply Now
                                    </button>
                                    <button className="p-2 border border-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition">
                                        <Bookmark size={14} />
                                    </button>
                                    <button className="p-2 border border-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition">
                                        <Share2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- UPCOMING EVENTS TICKER ROW --- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Upcoming Events</h2>
                    <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        See all events <ArrowRight size={16} />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { day: "24", month: "MAY", title: "Startup Pitch Night", desc: "5:00 PM - 8:00 PM • Freetown" },
                        { day: "28", month: "MAY", title: "Plastic Circularity Summit", desc: "9:00 AM - 4:00 PM • Hybrid" },
                        { day: "02", month: "JUN", title: "AI for Entrepreneurs Workshop", desc: "10:00 AM - 1:00 PM • Online" },
                        { day: "12", month: "JUN", title: "Women in Business Mixer", desc: "6:00 PM - 9:00 PM • Freetown" },
                        { day: "20", month: "JUN", title: "Climate Innovation Bootcamp", desc: "9:00 AM - 5:00 PM • Freetown" }
                    ].map((evt, i) => (
                        <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl flex items-start gap-4 hover:shadow-xs transition">
                            <div className="bg-red-50 text-red-600 flex flex-col items-center justify-center p-2 rounded-lg min-w-[50px]">
                                <span className="text-[10px] font-bold tracking-wider leading-none">{evt.month}</span>
                                <span className="text-xl font-black mt-0.5">{evt.day}</span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{evt.title}</h4>
                                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{evt.desc}</p>
                                <button className="text-[10px] font-bold text-emerald-600 hover:underline pt-1 block">Register</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- VALUE PROPOSITION BANNER --- */}
            <section className="bg-white border-y border-slate-100 py-10 my-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: ShieldCheck, title: "Verified Opportunities", desc: "All listings are vetted directly by NaWeHub.", color: "text-emerald-500" },
                        { icon: Bell, title: "Never Miss Out", desc: "Enable customized alert updates on new grants.", color: "text-blue-500" },
                        { icon: Bookmark, title: "Save & Track", desc: "Bookmark opportunities and applications milestones.", color: "text-rose-500" },
                        { icon: Share2, title: "Share Opportunities", desc: "Spread value inside your network with single-clicks.", color: "text-amber-500" }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                            <div className={`${item.color} p-2 bg-slate-50 rounded-xl h-fit`}>
                                <item.icon size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-normal">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- NEWSLETTER & COMMUNITY FOOTER CALL TO ACTION --- */}
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
                <div className="bg-gradient-to-r from-blue-950 to-blue-900 rounded-2xl p-6 lg:p-8 text-white grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-4 space-y-1">
                        <h3 className="text-lg font-bold">Stay Updated with New Opportunities</h3>
                        <p className="text-xs text-slate-300">Subscribe to our newsletter for instant delivery ecosystem updates.</p>
                    </div>
                    <div className="lg:col-span-5 flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-400 placeholder:text-slate-400"
                        />
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition">
                            Subscribe
                        </button>
                    </div>
                    <div className="lg:col-span-3 flex items-center justify-start lg:justify-end gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                        <div className="text-emerald-400"><MessageCircle size={32} fill="currentColor" className="text-emerald-400 stroke-blue-950" /></div>
                        <div>
                            <div className="text-xs font-bold">Join our WhatsApp Channel</div>
                            <div className="text-[10px] text-slate-300">Get snapshot updates instantly.</div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM UTILITY SUBMISSION BAR */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg"><Zap size={20} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Do you have an opportunity to share?</h4>
                            <p className="text-xs text-slate-500">Submit funding opportunities, events or tracks to reach thousands of micro-businesses.</p>
                        </div>
                    </div>
                    <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition">
                        <FileText size={14} /> Submit Opportunity
                    </button>
                </div>
            </footer>

        </div>
    );
}