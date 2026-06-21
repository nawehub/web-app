'use client';

import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { appMetadata } from "@/utils/app-metadata";
import ContactForm from "@/components/public/contact-form";

export default function ContactUsSection() {
    return (
        <section className="border-t border-border bg-background py-16 sm:py-20 lg:py-24">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl font-semibold text-foreground [font-family:var(--font-display)] md:text-5xl"
                >
                    Get in Touch with Our Team
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="mb-12 mt-3 max-w-2xl text-lg text-muted-foreground"
                >
                    We&rsquo;re here to answer your questions, explore your business ideas, and
                    support you in formalizing and growing your business sustainably. Connect
                    with us &mdash; let&rsquo;s build successful businesses together.
                </motion.p>

                <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-16">
                    {/* Left: Contact Form */}
                    <motion.div
                        className="w-full min-w-0 lg:max-w-[640px] lg:flex-1"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        viewport={{ once: true }}
                    >
                        <ContactForm />
                    </motion.div>

                    {/* Right: Contact Info & Office Card */}
                    <motion.div
                        className="flex w-full min-w-0 flex-col gap-6 sm:gap-8 lg:flex-1"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        viewport={{ once: true }}
                    >
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-md)] sm:p-8">
                            <h4 className="mb-4 text-lg font-semibold text-foreground [font-family:var(--font-display)]">
                                Prefer a Direct Approach?
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-foreground/80">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                        <Phone className="h-4 w-4" />
                                    </span>
                                    {appMetadata.Authors.phone}
                                </li>
                                <li className="flex items-center gap-3 text-foreground/80">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                        <Mail className="h-4 w-4" />
                                    </span>
                                    {appMetadata.Authors.email}
                                </li>
                                <li className="flex items-center gap-3 text-foreground/80">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                        <Clock className="h-4 w-4" />
                                    </span>
                                    Monday to Friday, 9 AM &ndash; 6 PM (GMT)
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-border bg-[hsl(var(--color-neutral-900))] p-6 sm:p-8">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                                <MapPin className="h-4 w-4" />
                            </span>
                            <div className="mt-4 font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)]">
                                Visit Our Office
                            </div>
                            <div className="mt-1 text-sm text-[hsl(var(--color-neutral-300))]">
                                {appMetadata.Authors.address}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}