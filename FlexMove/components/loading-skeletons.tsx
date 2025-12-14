import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ShipmentListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function MapSkeleton() {
    return (
        <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-muted-foreground">Loading map...</div>
            </div>
        </div>
    )
}

export function ChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16 mt-2" />
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
            </div>
        </div>
    )
}
