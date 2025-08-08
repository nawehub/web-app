"use client"

import {useState, useTransition} from "react"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Textarea} from "@/components/ui/textarea"
import {Label} from "@/components/ui/label"
import {
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    DollarSign,
    User,
    Building,
    Phone,
    Mail,
} from "lucide-react"
import {FundingApplication, FundingOpportunity, formatDate} from "@/types/funding"
import {useChangeApplicationStatusMutation} from "@/hooks/repository/use-funding";
import {useToast} from "@/hooks/use-toast";
import {IfAllowed} from "@/components/auth/IfAllowed";

interface ApplicantsListProps {
    opportunity: FundingOpportunity
    applications: FundingApplication[]
}

export function ApplicantsList({opportunity, applications}: ApplicantsListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedApplication, setSelectedApplication] = useState<FundingApplication | null>(null)
    const [rejectionReason, setRejectionReason] = useState("")
    const changeStatus = useChangeApplicationStatusMutation()
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
    const [rejectStatus, setRejectStatus] = useState(false)

    const filteredApplications = applications
        .filter((app) => app.opportunityId === opportunity.id)
        .filter((app) => {
            const matchesSearch =
                app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === "all" || app.applicationStatus === statusFilter
            return matchesSearch && matchesStatus
        })
        .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Submitted":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            case "Under_Review":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            case "Approved":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "Rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            case "Withdrawn":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Submitted":
                return <Clock className="h-4 w-4"/>
            case "Under_Review":
                return <Eye className="h-4 w-4"/>
            case "Approved":
                return <CheckCircle className="h-4 w-4"/>
            case "Rejected":
                return <XCircle className="h-4 w-4"/>
            default:
                return <Clock className="h-4 w-4"/>
        }
    }

    const handleStatusUpdate = (applicationId: string, action: "Review" | "Approve" | "Reject") => {
        startTransition(async () => {
            try {
                const response = await changeStatus.mutateAsync({
                    applicationId,
                    action,
                    rejectionReason,
                })
                toast({
                    title: `Application ${action}`,
                    description: `Application ${action.toLowerCase()} successfully`,
                    variant: 'default'
                })
                setSelectedApplication(response.provider)
            } catch (e) {
                toast({
                    title: `${action} Error`,
                    description: `${e instanceof Error ? e.message : 'An unknown error occurred'}`,
                    variant: 'destructive'
                })
            }
        })
    }

    const updateSelectedApplicationStatusToRejected = () => {
        setRejectStatus(rejectStatus => !rejectStatus)
    }

    const getApplicationStats = () => {
        const total = filteredApplications.length
        const submitted = filteredApplications.filter((app) => app.applicationStatus === "Submitted").length
        const underReview = filteredApplications.filter((app) => app.applicationStatus === "Under_Review").length
        const approved = filteredApplications.filter((app) => app.applicationStatus === "Approved").length
        const rejected = filteredApplications.filter((app) => app.applicationStatus === "Rejected").length

        return {total, submitted, underReview, approved, rejected}
    }

    const stats = getApplicationStats()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Applications for {opportunity.title}</h3>
                <p className="text-muted-foreground">Manage and review applications for this funding opportunity</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.submitted}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                        <Eye className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.underReview}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approved}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.rejected}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                                <Input
                                    placeholder="Search applications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="Under_Review">Under Review</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Applications Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Business</TableHead>
                            {/*<TableHead>Requested Amount</TableHead>*/}
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredApplications.map((application) => (
                            <TableRow key={application.id} className="hover:bg-muted/50">
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{application.applicantName}</div>
                                        <div
                                            className="text-sm text-muted-foreground">{application.applicantEmail}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{application.businessName}</div>
                                        <Badge variant="outline" className="text-xs">
                                            {application.businessStage}
                                        </Badge>
                                    </div>
                                </TableCell>
                                {/*<TableCell>*/}
                                {/*    <div className="font-medium">*/}
                                {/*        {formatCurrency(application.funding_amount_requested, opportunity.currency)}*/}
                                {/*    </div>*/}
                                {/*</TableCell>*/}
                                <TableCell>
                                    <Badge className={getStatusColor(application.applicationStatus)}>
                                        <div className="flex items-center space-x-1">
                                            {getStatusIcon(application.applicationStatus)}
                                            <span>{application.applicationStatus.replace("_", " ")}</span>
                                        </div>
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">{formatDate(application.submissionDate.toString())}</div>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm"
                                            onClick={() => setSelectedApplication(application)}>
                                        <Eye className="h-4 w-4 mr-1"/>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {filteredApplications.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Filter className="h-12 w-12 text-muted-foreground mb-4"/>
                        <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your search criteria or filters."
                                : "No applications have been submitted for this opportunity yet."}
                        </p>
                        {(searchTerm || statusFilter !== "all") && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("")
                                    setStatusFilter("all")
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Application Detail Modal */}
            <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedApplication && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Application Details</DialogTitle>
                                <DialogDescription>Review and manage this application
                                    for {opportunity.title}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Application Status */}
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <Badge className={getStatusColor(selectedApplication.applicationStatus)}>
                                            <div className="flex items-center space-x-1">
                                                {getStatusIcon(selectedApplication.applicationStatus)}
                                                <span>{selectedApplication.applicationStatus.replace("_", " ")}</span>
                                            </div>
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                          Submitted on {formatDate(selectedApplication.submissionDate.toString())}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        {selectedApplication.applicationStatus === "Submitted" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleStatusUpdate(selectedApplication.id, "Review")
                                                }}
                                            >
                                                Start Review
                                            </Button>
                                        )}
                                        {selectedApplication.applicationStatus === "Under_Review" && (
                                            <IfAllowed permission={"funding:create"}>
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 hover:text-green-700 bg-transparent"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            handleStatusUpdate(selectedApplication.id, "Approve")
                                                        }}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1"/>
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 bg-transparent"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            updateSelectedApplicationStatusToRejected()
                                                        }}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1"/>
                                                        Reject
                                                    </Button>
                                                </>
                                            </IfAllowed>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Applicant Information */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center">
                                                <User className="h-5 w-5 mr-2"/>
                                                Applicant Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <Label className="text-sm font-medium">Name</Label>
                                                <p>{selectedApplication.applicantName}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium">Email</Label>
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground"/>
                                                    <a
                                                        href={`mailto:${selectedApplication.applicantEmail}`}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        {selectedApplication.applicantEmail}
                                                    </a>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium">Phone</Label>
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground"/>
                                                    <span>{selectedApplication.applicantPhone}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Business Information */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center">
                                                <Building className="h-5 w-5 mr-2"/>
                                                Business Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <Label className="text-sm font-medium">Business Name</Label>
                                                <p>{selectedApplication.businessName}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium">Business Stage</Label>
                                                <Badge variant="outline">{selectedApplication.businessStage}</Badge>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium">Requested Amount</Label>
                                                <div className="flex items-center space-x-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                                                    <span className="font-medium">
                                                        {selectedApplication.notes}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Business Description */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Business Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm leading-relaxed">{selectedApplication.businessDescription}</p>
                                    </CardContent>
                                </Card>

                                {/* Rejection Notes */}
                                {rejectStatus && (
                                    <IfAllowed permission="funding:create" fallback={null}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Rejection Reason</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <Textarea
                                                        placeholder="Add your rejection reason here..."
                                                        value={rejectionReason}
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                        rows={4}
                                                    />
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button onClick={(e) => {
                                                    e.preventDefault()
                                                    handleStatusUpdate(selectedApplication.id, "Reject")
                                                }}>
                                                    Reject Application
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </IfAllowed>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
