'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const districts = [
    "Bo", "Bombali", "Bonthe", "Falaba", "Kailahun", "Kambia", "Karene",
    "Kenema", "Koinadugu", "Kono", "Moyamba", "Port Loko", "Pujehun",
    "Tonkolili", "Western Area Rural", "Western Area Urban"
];

const categories = [
    "Infrastructure", "Education", "Agriculture", "Economic Development",
    "Health & Sanitation", "Energy", "Transportation", "Environment", "Other"
];

const priorities = ["High", "Medium", "Low"];

export default function CreateProjectPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [district, setDistrict] = useState('');
    const [category, setCategory] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [objectives, setObjectives] = useState('');
    const [expectedOutcomes, setExpectedOutcomes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a project title',
                variant: 'destructive',
            });
            return;
        }

        if (!description.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a project description',
                variant: 'destructive',
            });
            return;
        }

        if (!district || !category) {
            toast({
                title: 'Error',
                description: 'Please select district and category',
                variant: 'destructive',
            });
            return;
        }

        if (!targetAmount || isNaN(Number(targetAmount))) {
            toast({
                title: 'Error',
                description: 'Please enter a valid target amount',
                variant: 'destructive',
            });
            return;
        }

        if (!deadline) {
            toast({
                title: 'Error',
                description: 'Please select a deadline',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: 'Success',
                description: 'Project created successfully and submitted for review',
            });
            router.push('/dashboard/projects');
        }, 2000);
    };

    return (
        <div className="space-y-6 py-6">
            {/* Header */}
            <div className="items-center gap-4">
                <Link href="/dashboard/projects">
                    <Button variant="ghost" className={'bg-accent-foreground text-muted-foreground mb-2'} size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create New Project</h1>
                    <p className="text-muted-foreground">
                        Submit a new district development project for community voting and funding
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Information</CardTitle>
                                <CardDescription>
                                    Enter the basic details about your project
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Project Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter project title"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Project Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your project in detail"
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="district">District</Label>
                                        <Select value={district} onValueChange={setDistrict}>
                                            <SelectTrigger>
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Select district" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {districts.map((d) => (
                                                    <SelectItem key={d} value={d}>
                                                        {d}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={category} onValueChange={setCategory}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="targetAmount">Target Amount (Le)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="targetAmount"
                                                type="number"
                                                value={targetAmount}
                                                onChange={(e) => setTargetAmount(e.target.value)}
                                                placeholder="Enter target amount"
                                                className="pl-8"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="deadline">Project Deadline</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="deadline"
                                                type="date"
                                                value={deadline}
                                                onChange={(e) => setDeadline(e.target.value)}
                                                className="pl-8"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="priority">Priority Level</Label>
                                    <Select value={priority} onValueChange={setPriority}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorities.map((p) => (
                                                <SelectItem key={p} value={p}>
                                                    {p}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Detailed Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Details</CardTitle>
                                <CardDescription>
                                    Provide additional information about your project
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="objectives">Project Objectives</Label>
                                    <Textarea
                                        id="objectives"
                                        value={objectives}
                                        onChange={(e) => setObjectives(e.target.value)}
                                        placeholder="List the main objectives of this project"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="expectedOutcomes">Expected Outcomes</Label>
                                    <Textarea
                                        id="expectedOutcomes"
                                        value={expectedOutcomes}
                                        onChange={(e) => setExpectedOutcomes(e.target.value)}
                                        placeholder="Describe the expected outcomes and impact"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Project Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Guidelines</CardTitle>
                                <CardDescription>
                                    Important information for project submission
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                        <p>Projects must benefit the local community and align with district development goals.</p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                        <p>All projects will be reviewed by district stakeholders and the public.</p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                        <p>Approved projects will be funded through Love Your District contributions.</p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                        <p>Project progress will be tracked and reported transparently.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Review Process */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Review Process</CardTitle>
                                <CardDescription>
                                    How your project will be evaluated
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                                            1
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Initial Review</p>
                                            <p className="text-xs text-muted-foreground">Admin review for completeness</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                                            2
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Public Voting</p>
                                            <p className="text-xs text-muted-foreground">Community members vote on projects</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                                            3
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Stakeholder Approval</p>
                                            <p className="text-xs text-muted-foreground">District leaders final approval</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-600">
                                            4
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Implementation</p>
                                            <p className="text-xs text-muted-foreground">Project funding and execution</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !title.trim() || !description.trim() || !district || !category || !targetAmount || !deadline}
                                        className="w-full"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Save className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Submit Project
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/dashboard/lyd/projects" className="w-full">
                                        <Button type="button" variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}