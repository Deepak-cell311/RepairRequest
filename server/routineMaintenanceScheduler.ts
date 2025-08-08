import { db } from "./db";
import { routineMaintenance, requests } from "@shared/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { addDays, addWeeks, addMonths, isSameDay, startOfDay, endOfDay, addYears } from "date-fns";

export class RoutineMaintenanceScheduler {
  /**
   * Check and create tickets for routine maintenance tasks
   * This should be called by a cron job (e.g., daily at midnight)
   */
  static async checkAndCreateTickets() {
    try {
      console.log("Starting routine maintenance ticket creation check...");
      
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);
      
      // Get all active routine maintenance tasks
      const activeTasks = await db
        .select()
        .from(routineMaintenance)
        .where(eq(routineMaintenance.isActive, true));
      
      console.log(`Found ${activeTasks.length} active routine maintenance tasks`);
      
      for (const task of activeTasks) {
        await this.processTask(task, todayStart, todayEnd);
      }
      
      console.log("Routine maintenance ticket creation check completed");
    } catch (error) {
      console.error("Error in routine maintenance scheduler:", error);
    }
  }
  
  /**
   * Process a single routine maintenance task
   */
  private static async processTask(task: any, todayStart: Date, todayEnd: Date) {
    try {
      const nextDueDate = this.calculateNextDueDate(task);
      
      // Check if the task is due today
      if (nextDueDate >= todayStart && nextDueDate <= todayEnd) {
        console.log(`Task ${task.id} (${task.facility} - ${task.event}) is due today`);
        
        // Check if a ticket already exists for today
        const existingTicket = await this.checkExistingTicket(task, todayStart, todayEnd);
        
        if (!existingTicket) {
          await this.createTicket(task);
        } else {
          console.log(`Ticket already exists for task ${task.id} today`);
        }
      }
    } catch (error) {
      console.error(`Error processing task ${task.id}:`, error);
    }
  }
  
  /**
   * Calculate the next due date for a task based on its recurrence
   */
  private static calculateNextDueDate(task: any): Date {
    const startDate = new Date(task.dateBegun);
    const today = new Date();
    
    // If the start date is in the future, return it
    if (startDate > today) {
      return startDate;
    }
    
    // Calculate next occurrence based on recurrence
    let nextDate: Date = new Date(startDate);
    
    while (nextDate <= today) {
      switch (task.recurrence) {
        case 'daily':
          nextDate = addDays(nextDate, 1);
          // nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate = addWeeks(nextDate, 1);
          break;
        case 'monthly':
          nextDate = addMonths(nextDate, 1);
          break;
        case 'biweekly':
          nextDate = addDays(nextDate, 14);
          break;
        case 'quarterly':
          nextDate = addMonths(nextDate, 3);
          break;
        case 'yearly':
          nextDate = addYears(nextDate, 1);
        case 'custom':
          // For custom recurrence, use the customRecurrence field
          if (task.customRecurrence) {
            const days = parseInt(task.customRecurrence) || 7;
            nextDate = addDays(nextDate, days);
          } else {
            nextDate = addDays(nextDate, 7); // Default to weekly
          }
          break;
        default:
          nextDate = addDays(nextDate, 7); // Default to weekly
      }
    }
    
    return nextDate;
  }
  
  /**
   * Check if a ticket already exists for this task today
   */
  private static async checkExistingTicket(task: any, todayStart: Date, todayEnd: Date) {
    const existingTicket = await db
      .select()
      .from(requests)
      .where(
        and(
          eq(requests.requestType, 'routine_maintenance'),
          eq(requests.organizationId, task.organizationId),
          gte(requests.createdAt, todayStart),
          lte(requests.createdAt, todayEnd)
        )
      )
      .limit(1);
    
    return existingTicket.length > 0;
  }
  
  /**
   * Create a new ticket for the routine maintenance task
   */
  private static async createTicket(task: any) {
    try {
      const [newTicket] = await db
        .insert(requests)
        .values({
          requestType: 'routine_maintenance',
          organizationId: task.organizationId,
          requestorId: task.createdById,
          title: `Routine: ${task.facility} - ${task.event}`,
          description: task.description || `Scheduled routine maintenance for ${task.facility}`,
          priority: 'medium',
          status: 'pending',
          building: task.facility,
          roomNumber: task.roomNumber || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      
      console.log(`✅ Created ticket ${newTicket.id} for routine maintenance task ${task.id}`);
      return newTicket;
    } catch (error) {
      console.error(`❌ Error creating ticket for task ${task.id}:`, error);
      throw error;
    }
  }
}

// Export for use in cron jobs or manual execution
export default RoutineMaintenanceScheduler;
