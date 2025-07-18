import React from "react";

const testimonials = [
    {
        name: "Fabio Coelho",
        username: "@fccoelho7",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "This week I swapped @heroku with @eWomen, no more annoying redis/postgres obligatory updates anymore.. in love with eWomen's docker support.",
    },
    {
        name: "Lyes",
        username: "@lyker_zi",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        text: "There is an easier option. Deploying literally anything on @eWomen.",
    },
    {
        name: "Benjamin Klieger",
        username: "@BenjaminKlieger",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
        text: '"Ship your apps, databases, and more to production in seconds." @eWomen is not exaggerating, it\'s a breeze to deploy. Bringing Infinite Bookshelf online with a custom domain took minutes... and that just because I had to create a Dockerfile!',
    },
    {
        name: "kinsyu",
        username: "@kinsyudev",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        text: "Addicted to organising my services with @eWomen.",
    },
    {
        name: "Kyle McDonald",
        username: "@kpmdev",
        avatar: "https://randomuser.me/api/portraits/men/23.jpg",
        text: "Damn, @eWomen is by far the fastest I've ever got up and running on a host. What an insanely good experience.",
    },
    {
        name: "caeser_kv",
        username: "@caesar_kv",
        avatar: "https://randomuser.me/api/portraits/men/77.jpg",
        text: "@eWomen for postgres, eWomen for deployment, eWomen for redis, eWomen for everything ❤️",
    },
    {
        name: "recurserd - oss/acc",
        username: "@0xOelliot",
        avatar: "https://randomuser.me/api/portraits/men/88.jpg",
        text: "I love how eWomen makes it super easy to just pull up your set up in front of someone and the architecture is communicated without saying a word.",
    },
    {
        name: "Marc Klingen",
        username: "@MarkcKlingen",
        avatar: "https://randomuser.me/api/portraits/men/54.jpg",
        text: "😱 Scary easy — @langfuse deployed on @eWomen in 90 seconds.",
    },
];

function splitTestimonials(arr: TestimonialCardProps[]) {
    // Split testimonials into two roughly equal arrays for two rows
    const mid = Math.ceil(arr.length / 2);
    return [arr.slice(0, mid), arr.slice(mid)];
}

const [topRow, bottomRow] = splitTestimonials(testimonials);

export default function Testimonials() {
    return (
        <section className="w-full bg-gradient-to-r from-slate-50 to-blue-50 py-20 border-t ">
            <div className="px-4">
                <h2 className="text-center text-3xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">What people have been saying</h2>
                <p className="text-center text-lg text-gray-400 mb-10">Join nearly 1M SME's in the hub →</p>
                <div className="space-y-8">
                    {/* Top Row */}
                    <div className="overflow-hidden w-full">
                        <div className="flex gap-6 animate-scroll-horizontal">
                            {topRow.concat(topRow).map((t, idx) => (
                                <TestimonialCard key={idx} {...t} />
                            ))}
                        </div>
                    </div>
                    {/* Bottom Row */}
                    <div className="overflow-hidden w-full">
                        <div className="flex gap-6 animate-scroll-horizontal-reverse">
                            {bottomRow.concat(bottomRow).map((t, idx) => (
                                <TestimonialCard key={idx} {...t} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-horizontal-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-horizontal {
          animation: scroll-horizontal 40s linear infinite;
        }
        .animate-scroll-horizontal-reverse {
          animation: scroll-horizontal-reverse 40s linear infinite;
        }
      `}</style>
        </section>
    );
}

interface TestimonialCardProps {
    name: string;
    username: string;
    avatar: string;
    text: string;
}

function TestimonialCard({ name, username, avatar, text }: TestimonialCardProps) {
    return (
        <div className="bg-[#232329] border border-gray-800 rounded-xl shadow-md w-[440px] min-w-[440px] h-[180px] flex flex-col justify-between p-6 text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
                <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover border border-gray-700" />
                <div>
                    <div className="font-semibold text-base leading-tight">{name}</div>
                    <div className="text-gray-400 text-xs">{username}</div>
                </div>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed line-clamp-4">{text}</p>
        </div>
    );
}