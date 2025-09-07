import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {ArrowUpRight} from "lucide-react";
import Image from "next/image";
import { services } from "@/utils/benefits";
export default function Blogs () {
    return (
        <section className="py-20 bg-[#F1F0FB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Platform Benefits
                    </h2>
                    <p className="text-[#000] max-w-2xl mx-auto">
                        Benefits of NaWeHub for Development Partners, Entrepreneurs and Community/Diaspora
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-shadow duration-300 border-2 border-indigo-300">
                            <div className="relative overflow-hidden">
                                <Image
                                    src={service.illustration}
                                    alt={service.title}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className={"w-full h-48 transform object-cover group-hover:scale-105 transition-transform duration-300"}
                                />
                                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                    {service.badge}
                                </div>
                            </div>
                            <CardHeader>
                                <div className="flex items-center text-[#8E9196] text-sm mb-2">
                                    <ArrowUpRight className="w-4 h-4 mr-2" />
                                    {service.subTitle}
                                </div>
                                <CardTitle className="text-xl font-bold hover:text-primary transition-colors duration-300">
                                    {service.title}
                                </CardTitle>
                                <CardDescription className="text-[#8E9196]">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};