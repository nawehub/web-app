import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function ContactUsSection() {
    const cardRef = useRef(null);
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Parallax effect for card
    const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
    const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);

    function handleMouseMove(e: { clientX: number; clientY: number; }) {
        // @ts-ignore
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseX.set(x);
        mouseY.set(y);
    }

    function handleMouseLeave() {
        mouseX.set(0.5);
        mouseY.set(0.5);
    }

    return (
        <section className="w-full bg-white dark:bg-gray-950 py-24 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-8">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-primary text-sm font-medium mb-2"
                >
                    Contact us
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3"
                >
                    Get in Touch with Our Team
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl"
                >
                    We’re here to answer your questions, explore your business ideas,
                    and support you in formalizing and growing your business sustainably. Connect with us--let’s
                    build successful businesses together.                </motion.p>
                <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                    {/* Left: Contact Form */}
                    <motion.div
                        ref={cardRef}
                        className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 relative"
                        style={{ rotateX, rotateY }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        initial={{ opacity: 0, scale: 0.97, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Let's Talk About Your Project</h3>
                        <form className="space-y-5">
                            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Name</label>
                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/60 transition" placeholder="Your full name" required />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }} viewport={{ once: true }}>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Email Address</label>
                                <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/60 transition" placeholder="We'll get back to you here" required />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Company Name</label>
                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/60 transition" placeholder="Let us know who you represent" />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.35 }} viewport={{ once: true }}>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Subject *</label>
                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/60 transition" placeholder="What's this about?" />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Message</label>
                                <textarea className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[90px]" placeholder="Tell us how we can help" required />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }}>
                                <button type="submit" className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-lg shadow hover:bg-primary/90 transition">Send Message</button>
                            </motion.div>
                        </form>
                    </motion.div>
                    {/* Right: Contact Info & Map */}
                    <motion.div
                        className="w-full md:w-1/2 flex flex-col gap-8"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-white dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 pb-3 pt-8 border border-gray-200 dark:border-gray-800 mb-2">
                            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Prefer a Direct Approach?</h4>
                            <ul className="space-y-3 text-gray-700 dark:text-gray-200">
                                <li className="flex items-center gap-2"><span role="img" aria-label="phone">📞</span> +23278976369</li>
                                <li className="flex items-center gap-2"><span role="img" aria-label="email">✉️</span> info@ewomensl.com</li>
                                <li className="flex items-center gap-2"><span role="img" aria-label="clock">🕒</span> Monday to Friday, 9 AM – 6 PM (GMT)</li>
                            </ul>
                        </div>
                        <motion.div
                            className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            viewport={{ once: true }}
                            style={{ minHeight: 100, maxHeight: 720 }}
                        >
                            {/* Static map image for demo; replace with real map if needed */}
                            <img
                                src="https://maps.googleapis.com/maps/api/staticmap?center=Innovation+City,Techland&zoom=14&size=600x220&key=AIzaSyD-EXAMPLE"
                                alt="Map"
                                className="w-full h-1/2 object-cover"
                                style={{ minHeight: 180, maxHeight: 450 }}
                            />
                            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 rounded-xl p-4 shadow flex flex-col gap-2 max-w-[80%]">
                                <div className="font-semibold text-gray-900 dark:text-white text-base">Visit Our Office</div>
                                <div className="text-gray-700 dark:text-gray-200 text-sm">59 Rogbaneh Road, Makeni, Sierra Leone</div>
                                {/*<button className="mt-2 px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm shadow hover:bg-primary/90 transition w-max flex items-center gap-2">*/}
                                {/*    Get a Direction <span aria-hidden>→</span>*/}
                                {/*</button>*/}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}