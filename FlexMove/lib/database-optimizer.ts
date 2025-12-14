import { supabase } from './supabase'

// Optimized database query helpers
export class DatabaseOptimizer {
    // Batch fetch shipment with all related data in one query
    static async getShipmentWithDetails(shipmentId: string) {
        const { data, error } = await supabase
            .from('shipments')
            .select(`
        *,
        supplier:users!shipments_supplier_id_fkey(id, name, email, company),
        transporter:users!shipments_transporter_id_fkey(id, name, email, company),
        customer:users!shipments_customer_id_fkey(id, name, email, company),
        disruptions(*)
      `)
            .eq('id', shipmentId)
            .single()

        if (error) throw error
        return data
    }

    // Batch fetch multiple shipments with pagination
    static async getShipmentsWithPagination(
        userId: string,
        userRole: string,
        page: number = 1,
        pageSize: number = 20
    ) {
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        let query = supabase
            .from('shipments')
            .select(`
        *,
        supplier:users!shipments_supplier_id_fkey(id, name, company),
        transporter:users!shipments_transporter_id_fkey(id, name, company),
        customer:users!shipments_customer_id_fkey(id, name, company)
      `, { count: 'exact' })
            .range(from, to)
            .order('created_at', { ascending: false })

        // Filter based on user role
        if (userRole === 'supplier') {
            query = query.eq('supplier_id', userId)
        } else if (userRole === 'transporter') {
            query = query.eq('transporter_id', userId)
        } else if (userRole === 'customer') {
            query = query.eq('customer_id', userId)
        }

        const { data, error, count } = await query

        if (error) throw error

        return {
            shipments: data || [],
            total: count || 0,
            page,
            pageSize,
            totalPages: Math.ceil((count || 0) / pageSize)
        }
    }

    // Get user dashboard stats in one query
    static async getDashboardStats(userId: string, userRole: string) {
        const { data, error } = await supabase.rpc('get_dashboard_stats', {
            p_user_id: userId,
            p_user_role: userRole
        })

        if (error) {
            // Fallback to individual queries if RPC doesn't exist
            return this.getDashboardStatsFallback(userId, userRole)
        }

        return data
    }

    // Fallback method for dashboard stats
    private static async getDashboardStatsFallback(userId: string, userRole: string) {
        const column = `${userRole}_id`

        const [totalResult, activeResult, deliveredResult] = await Promise.all([
            supabase.from('shipments').select('id', { count: 'exact', head: true }).eq(column, userId),
            supabase.from('shipments').select('id', { count: 'exact', head: true }).eq(column, userId).eq('status', 'in-transit'),
            supabase.from('shipments').select('id', { count: 'exact', head: true }).eq(column, userId).eq('status', 'delivered')
        ])

        return {
            total: totalResult.count || 0,
            active: activeResult.count || 0,
            delivered: deliveredResult.count || 0
        }
    }

    // Batch create notifications
    static async createNotifications(notifications: Array<{
        user_id: string
        title: string
        message: string
        type: string
    }>) {
        const { data, error } = await supabase
            .from('notifications')
            .insert(notifications)
            .select()

        if (error) throw error
        return data
    }

    // Get unread notifications count efficiently
    static async getUnreadNotificationsCount(userId: string) {
        const { count, error } = await supabase
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false)

        if (error) throw error
        return count || 0
    }

    // Mark multiple notifications as read
    static async markNotificationsAsRead(notificationIds: string[]) {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .in('id', notificationIds)

        if (error) throw error
    }
}
