import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency for India (INR)
export function formatCurrencyINR(value: number, options?: Intl.NumberFormatOptions) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0, ...options }).format(value)
  } catch {
    // Fallback if Intl is unavailable
    return `₹${Math.round(value).toLocaleString('en-IN')}`
  }
}

// Get vehicle icon helper (extracted from interactive-map)
export function getVehicleIcon(type: string) {
  const icons = {
    truck: '🚚',
    ship: '🚢',
    plane: '✈️',
    ev: '⚡'
  }
  return icons[type as keyof typeof icons] || '🚚'
}

// Get status color helper (extracted from interactive-map)
export function getStatusColor(status: string) {
  const colors = {
    idle: 'bg-gray-500',
    'in-transit': 'bg-blue-500',
    loading: 'bg-yellow-500',
    unloading: 'bg-orange-500',
    pending: 'bg-gray-400',
    delivered: 'bg-green-500',
    delayed: 'bg-red-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500'
}

// Memoization helper for expensive computations
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map()
  return ((...args: any[]) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Debounce helper for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Format date helper
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    ...options
  }).format(d)
}

// Calculate percentage helper
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
