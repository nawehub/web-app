'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { districts } from "@/types/demographs";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
        district: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: replace with your real submission endpoint
        setTimeout(() => {
            setIsSubmitting(false);
            toast("Message sent successfully!", {
                description: "We'll get back to you within 24 hours.",
            });

            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                category: '',
                message: '',
                district: ''
            });
        }, 2000);
    };

    return (
        <Card className="border-border bg-card shadow-[var(--shadow-lg)]">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold [font-family:var(--font-display)]">
                    Send Us a Message
                </CardTitle>
                <CardDescription className="text-base">
                    Fill out the form below and we&apos;ll get back to you within 24 hours.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+232 XX XXX XXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="district">District (Optional)</Label>
                            <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your district" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem key={district} value={district}>
                                            {district}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select inquiry type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="entrepreneurship">Entrepreneurship Support</SelectItem>
                                    <SelectItem value="lyd">Next Big Idea</SelectItem>
                                    <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                                    <SelectItem value="technical">Technical Support</SelectItem>
                                    <SelectItem value="general">General Inquiry</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                placeholder="Brief subject of your message"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Tell us more about how we can help you..."
                            rows={6}
                            required
                        />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-base sm:text-lg">
                        {isSubmitting ? (
                            <>
                                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-primary-foreground" />
                                Sending Message...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-5 w-5" />
                                Send Message
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}