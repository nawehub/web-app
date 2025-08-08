import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48 mt-2" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-3 w-20 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>

            {/* Results count */}
            <Skeleton className="h-4 w-48" />

            {/* Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <div>
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48 mt-1" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-20" />
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-32" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-16" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-20" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-1">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
