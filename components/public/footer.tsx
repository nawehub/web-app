import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";
import { FaFacebook, FaTwitter } from "react-icons/fa";

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="items-center h-16 mb-8 pt-5">
                           <Link href={"/"}>
                               <img src={"/images/wehub-sample-logo.png"} alt="Logo" className="h-10 w-auto mr-2"/>
                           </Link>
                        </div>
                        <p className="text-gray-400">Empowering businesses and building communities across Sierra
                            Leone.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link href="/" className="hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-white">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href={"/contact"} className="hover:text-white">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href={"/lyd"} className="hover:text-white">
                                    Love Your District
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link href={"/faq"} className="hover:text-white">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href={"#"} className="hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href={"#"} className="hover:text-white">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <p className="text-gray-400 mb-2">Follow us for updates and success stories</p>
                        <div className="flex space-x-4">
                            <Button onClick={() => {
                                window.open("https://www.facebook.com/Ewomensl", "_blank");
                            }} size="sm" variant={"default"}
                                    className="text-white border-gray-600 hover:bg-gray-800">
                                <FaFacebook className={"h-5 w-5"} />
                            </Button>
                            <Button size="sm" variant="default"
                                    className="text-white border-gray-600 hover:bg-gray-800">
                                <FaTwitter className={"h-5 w-5"} />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 eWomen SL. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

// https://www.facebook.com/share/18tzHmzkmp/