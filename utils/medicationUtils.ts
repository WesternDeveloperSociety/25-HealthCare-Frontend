// utils/medicationUtils.ts
// Utility functions for medication tracking and refill status calculation

export interface MedicationRefillStatus {
    daysRemaining: number;
    status: 'Critical' | 'Upcoming' | 'Normal';
    color: string;
    message: string;
  }
  
  /**
   * Calculate refill status based on prescription start date and duration
   * @param startDate - Date when prescription was started (ISO string or Date)
   * @param duration - Duration in days
   * @returns MedicationRefillStatus object with status, color, and message
   */
  export function calculateRefillStatus(
    startDate: string | Date,
    duration: number
  ): MedicationRefillStatus {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const today = new Date();
    
    // Calculate expiry date
    const expiryDate = new Date(start);
    expiryDate.setDate(expiryDate.getDate() + duration);
    
    // Calculate days remaining
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // Determine status based on days remaining
    if (daysRemaining < 0) {
      return {
        daysRemaining: 0,
        status: 'Critical',
        color: '#EF4444', // Red
        message: 'Expired - Refill immediately'
      };
    } else if (daysRemaining < 3) {
      return {
        daysRemaining,
        status: 'Critical',
        color: '#EF4444', // Red
        message: 'Refill urgently needed'
      };
    } else if (daysRemaining < 7) {
      return {
        daysRemaining,
        status: 'Upcoming',
        color: '#F59E0B', // Yellow/Amber
        message: 'Refill soon'
      };
    } else {
      return {
        daysRemaining,
        status: 'Normal',
        color: '#10B981', // Green
        message: 'Supply is good'
      };
    }
  }
  
  /**
   * Calculate progress percentage for circular indicator
   * @param daysRemaining - Days remaining
   * @param totalDuration - Total duration in days
   * @returns Progress percentage (0-100)
   */
  export function calculateProgress(daysRemaining: number, totalDuration: number): number {
    if (totalDuration <= 0) return 0;
    const progress = (daysRemaining / totalDuration) * 100;
    return Math.max(0, Math.min(100, progress));
  }
  
  /**
   * Format days remaining for display
   * @param days - Number of days
   * @returns Formatted string
   */
  export function formatDaysRemaining(days: number): string {
    if (days === 0) return 'Expired';
    if (days === 1) return '1 day';
    return `${days} days`;
  }