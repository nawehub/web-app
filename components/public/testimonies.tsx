import {Quote} from "lucide-react";
import {Badge} from '@/components/ui/badge';
import {testimonials} from "@/types/testimonies";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Testimonies() {
    return (
        <section id="testimonials" className="py-20 sm:py-32 bg-white overflow-hidden">
            <div className="container">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
                        <Quote className="mr-2 h-4 w-4"/>
                        What Our Community Says
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Trusted by Leaders Across{' '}
                        <span
                            className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                            Sierra Leone
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        From entrepreneurs to government officials, see how NaWeHub is transforming communities and
                        businesses.
                    </p>
                </div>

                {/* Auto-scrolling testimonials */}
                <div className="relative">
                    <div className="flex animate-scroll space-x-6">
                        {/* First set of testimonials */}
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={`first-${index}`}
                                className="flex-shrink-0 w-96 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg group-hover:ring-blue-100 transition-all duration-300"
                                            />
                                            <div
                                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                <Quote className="w-3 h-3 text-white"/>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                                                {testimonial.name}
                                            </CardTitle>
                                            <CardDescription className="text-sm font-medium text-blue-600 truncate">
                                                {testimonial.position}
                                            </CardDescription>
                                            <CardDescription className="text-xs text-gray-500 truncate">
                                                {testimonial.company}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <blockquote className="text-gray-700 leading-relaxed line-clamp-6">
                                        "{testimonial.message}"
                                    </blockquote>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Duplicate set for seamless loop */}
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={`second-${index}`}
                                className="flex-shrink-0 w-96 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg group-hover:ring-blue-100 transition-all duration-300"
                                            />
                                            <div
                                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                <Quote className="w-3 h-3 text-white"/>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                                                {testimonial.name}
                                            </CardTitle>
                                            <CardDescription className="text-sm font-medium text-blue-600 truncate">
                                                {testimonial.position}
                                            </CardDescription>
                                            <CardDescription className="text-xs text-gray-500 truncate">
                                                {testimonial.company}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <blockquote className="text-gray-700 leading-relaxed line-clamp-6">
                                        "{testimonial.message}"
                                    </blockquote>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/*    /!* Gradient overlays for a smooth fade effect *!/*/}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"/>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"/>
                </div>
            </div>
        </section>
    );
}