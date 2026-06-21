'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    ArrowLeft,
    MapPin,
    DollarSign,
    Eye,
    Share2,
    Heart,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Send,
    Check,
    X
} from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Sample project data - in real app this would come from API
const sampleProject = {
    id: '1',
    title: 'Bo Community Market Renovation',
    description: 'Renovate and modernize the central market in Bo to improve trading conditions for local vendors and attract more customers. This comprehensive project will include infrastructure improvements, modern facilities, and enhanced security measures.',
    district: 'Bo',
    category: 'Infrastructure',
    targetAmount: 1000000,
    raisedAmount: 750000,
    status: 'UNDER REVIEW',
    priority: 'High',
    comments: 18,
    views: 1250,
    createdAt: '2024-01-15',
    deadline: '2024-12-31',
    createdBy: 'Bo District Council',
    supporters: 180,
    updates: 5,
    objectives: [
        'Improve market infrastructure and facilities',
        'Enhance security and safety measures',
        'Create better trading conditions for vendors',
        'Attract more customers and boost local economy',
        'Implement modern waste management systems'
    ],
    expectedOutcomes: [
        'Increased vendor satisfaction and productivity',
        'Higher customer footfall and sales',
        'Improved hygiene and sanitation',
        'Enhanced district economic growth',
        'Better organized market operations'
    ],
    timeline: [
        { phase: 'Planning & Design', status: 'completed', date: '2024-01-15' },
        { phase: 'Community Consultation', status: 'completed', date: '2024-02-01' },
        { phase: 'Construction Phase 1', status: 'pending', date: '2024-03-01' },
        { phase: 'Construction Phase 2', status: 'pending', date: '2024-06-01' },
        { phase: 'Final Inspection', status: 'pending', date: '2024-11-01' },
        { phase: 'Project Completion', status: 'pending', date: '2024-12-31' }
    ]
};

interface Comment {
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'APPROVED - IMPLEMENTATION ONGOING':
            return 'bg-green-500 hover:bg-green-600';
        case 'UNDER REVIEW':
            return 'bg-yellow-500 hover:bg-yellow-600';
        case 'PENDING APPROVAL':
            return 'bg-blue-500 hover:bg-blue-600';
        case 'COMPLETED':
            return 'bg-purple-500 hover:bg-purple-600';
        case 'REJECTED':
            return 'bg-red-500 hover:bg-red-600';
        default:
            return 'bg-gray-500 hover:bg-gray-600';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'APPROVED - IMPLEMENTATION ONGOING':
            return <Clock className="h-3 w-3" />;
        case 'UNDER REVIEW':
            return <AlertCircle className="h-3 w-3" />;
        case 'PENDING APPROVAL':
            return <Eye className="h-3 w-3" />;
        case 'COMPLETED':
            return <CheckCircle className="h-3 w-3" />;
        case 'REJECTED':
            return <X className="h-3 w-3" />;
        default:
            return <Clock className="h-3 w-3" />;
    }
};

const getTimelineStatus = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-green-500';
        case 'in-progress':
            return 'bg-blue-500';
        case 'pending':
            return 'bg-gray-300';
        default:
            return 'bg-gray-300';
    }
};

export default function ProjectDetailPage() {
    const params = useParams();
    const [projectStatus, setProjectStatus] = useState(sampleProject.status);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            author: 'Fatmata Sesay',
            avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            content: 'This is exactly what our market needs! The current conditions are really challenging for vendors.',
            timestamp: '2024-02-15T10:30:00Z',
            likes: 12
        },
        {
            id: '2',
            author: 'Mohamed Kamara',
            avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            content: 'Great initiative! I hope the construction will not disrupt business too much during implementation.',
            timestamp: '2024-02-14T15:45:00Z',
            likes: 8
        },
        {
            id: '3',
            author: 'Aminata Bangura',
            avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            content: 'How can local businesses contribute to this project? We want to support our community.',
            timestamp: '2024-02-13T09:20:00Z',
            likes: 15
        }
    ]);

    const project = { ...sampleProject, status: projectStatus };

    const formatCurrency = (amount: number) => {
        return `Le ${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getProgressPercentage = (raised: number, target: number) => {
        return Math.round((raised / target) * 100);
    };

    const handleApprove = () => {
        setProjectStatus('APPROVED - IMPLEMENTATION ONGOING');
        toast('Project Approved', {
            description: 'The project has been approved and is now ready for implementation.',
        });
    };

    const handleReject = () => {
        setProjectStatus('REJECTED');
        toast('Project Rejected', {
            description: 'The project has been rejected and will not proceed.',
        });
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) {
            toast('Error', {
                description: 'Please enter a comment',
            });
            return;
        }

        setIsSubmittingComment(true);

        // Simulate API call
        setTimeout(() => {
            const newCommentObj: Comment = {
                id: Date.now().toString(),
                author: 'Current User',
                avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
                content: newComment.trim(),
                timestamp: new Date().toISOString(),
                likes: 0
            };

            setComments(prev => [newCommentObj, ...prev]);
            setIsSubmittingComment(false);
            setNewComment('');
            toast('Comment posted', {
                description: 'Your comment has been added successfully.',
            });
        }, 1000);
    };

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    const canApproveReject = projectStatus === 'PENDING APPROVAL' || projectStatus === 'UNDER REVIEW';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/lyd/projects">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Button>
                </Link>
            </div>

            {/* Project Header */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                                    <CardDescription className="text-base leading-relaxed">
                                        {project.description}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <Button variant="outline" size="sm">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{project.district} District</span>
                                </div>
                                <Badge variant="outline">{project.category}</Badge>
                                <Badge className={cn("text-white", getStatusColor(project.status))}>
                                    {getStatusIcon(project.status)}
                                    <span className="ml-1">{project.status}</span>
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Admin Actions */}
                    {canApproveReject && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Actions</CardTitle>
                                <CardDescription>
                                    Review and take action on this project
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleApprove}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve Project
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        variant="destructive"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Reject Project
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Funding Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Funding Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Progress</span>
                                    <span className="text-muted-foreground">
                    {getProgressPercentage(project.raisedAmount, project.targetAmount)}%
                  </span>
                                </div>
                                <Progress
                                    value={getProgressPercentage(project.raisedAmount, project.targetAmount)}
                                    className="h-3"
                                />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{formatCurrency(project.raisedAmount)} raised</span>
                                    <span>of {formatCurrency(project.targetAmount)} goal</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{project.supporters}</div>
                                    <p className="text-sm text-muted-foreground">Supporters</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{comments.length}</div>
                                    <p className="text-sm text-muted-foreground">Comments</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{project.updates}</div>
                                    <p className="text-sm text-muted-foreground">Updates</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3">Objectives</h3>
                                <ul className="space-y-2">
                                    {project.objectives.map((objective, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-3">Expected Outcomes</h3>
                                <ul className="space-y-2">
                                    {project.expectedOutcomes.map((outcome, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{outcome}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {project.timeline.map((phase, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-4 h-4 rounded-full flex-shrink-0",
                                            getTimelineStatus(phase.status)
                                        )} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{phase.phase}</span>
                                                <span className="text-sm text-muted-foreground">
                          {formatDate(phase.date)}
                        </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "mt-1 text-xs",
                                                    phase.status === 'completed' && "border-green-500 text-green-700",
                                                    phase.status === 'in-progress' && "border-blue-500 text-blue-700",
                                                    phase.status === 'pending' && "border-gray-300 text-gray-500"
                                                )}
                                            >
                                                {phase.status.replace('-', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Comments ({comments.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Add Comment Form */}
                            <form onSubmit={handleSubmitComment} className="space-y-4">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your thoughts about this project..."
                                    rows={3}
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmittingComment || !newComment.trim()}
                                    size="sm"
                                >
                                    {isSubmittingComment ? (
                                        <>
                                            <Send className="h-4 w-4 mr-2 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Post Comment
                                        </>
                                    )}
                                </Button>
                            </form>

                            <Separator />

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={comment.avatar} alt={comment.author} />
                                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{comment.author}</span>
                                                <span className="text-xs text-muted-foreground">
                          {timeAgo(comment.timestamp)}
                        </span>
                                            </div>
                                            <p className="text-sm text-gray-700">{comment.content}</p>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                    <Heart className="h-3 w-3 mr-1" />
                                                    {comment.likes}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                    Reply
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Project Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Support This Project</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href="/dashboard/lyd/donate" className="w-full block">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Contribute Funds
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Project Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created by:</span>
                                    <span className="font-medium">{project.createdBy}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created:</span>
                                    <span>{formatDate(project.createdAt)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Deadline:</span>
                                    <span>{formatDate(project.deadline)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Priority:</span>
                                    <Badge variant="outline" className={cn(
                                        project.priority === 'High' && "border-red-500 text-red-700",
                                        project.priority === 'Medium' && "border-yellow-500 text-yellow-700",
                                        project.priority === 'Low' && "border-green-500 text-green-700"
                                    )}>
                                        {project.priority}
                                    </Badge>
                                </div>

                                <Separator />

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Views:</span>
                                    <span>{project.views.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Comments:</span>
                                    <span>{comments.length}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Projects */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Projects</CardTitle>
                            <CardDescription>
                                Other projects in {project.district}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <h4 className="font-medium text-sm">Bo Youth Skills Center</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Education • Le 800,000</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Progress value={65} className="h-1 flex-1" />
                                        <span className="text-xs text-muted-foreground">65%</span>
                                    </div>
                                </div>

                                <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                    <h4 className="font-medium text-sm">Bo Water Supply Project</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Infrastructure • Le 1,200,000</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Progress value={40} className="h-1 flex-1" />
                                        <span className="text-xs text-muted-foreground">40%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}