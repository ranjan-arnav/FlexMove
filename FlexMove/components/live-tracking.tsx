"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, TruckIcon, Clock } from 'lucide-react'

interface Location {
    latitude: number
    longitude: number
    timestamp: string
    speed?: number
    heading?: number
}

interface LiveTrackingProps {
    shipmentId: string
    vehicleId?: string
}

export function LiveTracking({ shipmentId, vehicleId }: LiveTrackingProps) {
    const [location, setLocation] = useState<Location | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    useEffect(() => {
        if (!vehicleId) return

        // Subscribe to real-time location updates
        const channel = supabase
            .channel(`vehicle:${vehicleId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'vehicle_locations',
                    filter: `vehicle_id=eq.${vehicleId}`
                },
                (payload) => {
                    setLocation(payload.new as Location)
                    setLastUpdate(new Date())
                    setIsConnected(true)
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true)
                } else if (status === 'CLOSED') {
                    setIsConnected(false)
                }
            })

        // Fetch initial location
        const fetchInitialLocation = async () => {
            const { data } = await supabase
                .from('vehicle_locations')
                .select('*')
                .eq('vehicle_id', vehicleId)
                .order('timestamp', { ascending: false })
                .limit(1)
                .single()

            if (data) {
                setLocation(data as Location)
                setLastUpdate(new Date(data.timestamp))
            }
        }

        fetchInitialLocation()

        return () => {
            channel.unsubscribe()
        }
    }, [vehicleId])

    if (!vehicleId) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Live Tracking
                    </CardTitle>
                    <CardDescription>No vehicle assigned to this shipment</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Live Tracking
                    </CardTitle>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                        {isConnected ? "● Live" : "○ Offline"}
                    </Badge>
                </div>
                <CardDescription>Real-time vehicle location updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {location ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Latitude</p>
                                <p className="text-lg font-semibold">{location.latitude.toFixed(6)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Longitude</p>
                                <p className="text-lg font-semibold">{location.longitude.toFixed(6)}</p>
                            </div>
                        </div>

                        {location.speed !== undefined && (
                            <div className="flex items-center gap-2">
                                <TruckIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    Speed: <span className="font-semibold">{location.speed} km/h</span>
                                </span>
                            </div>
                        )}

                        {lastUpdate && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Last updated: {lastUpdate.toLocaleTimeString()}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        Waiting for location data...
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
