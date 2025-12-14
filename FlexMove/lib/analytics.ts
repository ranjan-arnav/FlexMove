// Analytics tracking utilities
export const analytics = {
    track: (event: string, properties?: Record<string, any>) => {
        if (typeof window !== 'undefined') {
            // Vercel Analytics
            if (window.va) {
                window.va('event', { name: event, data: properties })
            }

            // Console log in development
            if (process.env.NODE_ENV === 'development') {
                console.log('[Analytics]', event, properties)
            }
        }
    },

    page: (name: string, properties?: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.va) {
            window.va('pageview', { page: name, ...properties })
        }
    },

    identify: (userId: string, traits?: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.va) {
            // Store user traits for analytics
            console.log('[Analytics] Identify:', userId, traits)
        }
    }
}

// Event types for type safety
export const AnalyticsEvents = {
    // Shipment events
    SHIPMENT_CREATED: 'shipment_created',
    SHIPMENT_UPDATED: 'shipment_updated',
    SHIPMENT_VIEWED: 'shipment_viewed',
    SHIPMENT_TRACKED: 'shipment_tracked',

    // User events
    USER_SIGNED_UP: 'user_signed_up',
    USER_LOGGED_IN: 'user_logged_in',
    USER_LOGGED_OUT: 'user_logged_out',

    // AI events
    AI_CHAT_OPENED: 'ai_chat_opened',
    AI_MESSAGE_SENT: 'ai_message_sent',
    AI_SUGGESTION_CLICKED: 'ai_suggestion_clicked',

    // Dashboard events
    DASHBOARD_VIEWED: 'dashboard_viewed',
    TAB_CHANGED: 'tab_changed',
    FILTER_APPLIED: 'filter_applied',

    // Map events
    MAP_VIEWED: 'map_viewed',
    VEHICLE_CLICKED: 'vehicle_clicked',
    ROUTE_VIEWED: 'route_viewed',
} as const

// Extend Window type for TypeScript
declare global {
    interface Window {
        va?: (event: string, ...args: any[]) => void
    }
}
