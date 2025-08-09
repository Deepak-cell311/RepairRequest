import {
  users,
  requests,
  requestItems,
  buildingRequests,
  assignments,
  messages,
  statusUpdates,
  requestPhotos,
  organizations,
  buildings,
  facilities,
  passwordResetTokens,
  routineMaintenance,
  routineMaintenancePhotos,
  type User,
  type UpsertUser,
  type InsertRequest,
  type Request,
  type InsertRequestItems,
  type RequestItems,
  type InsertBuildingRequest,
  type BuildingRequest,
  type InsertMessage,
  type Message,
  type InsertAssignment,
  type Assignment,
  type InsertStatusUpdate,
  type StatusUpdate,
  type InsertRequestPhoto,
  type RequestPhoto,
  type Organization,
  type InsertOrganization,
  type Building,
  type InsertBuilding,
  type Facility,
  type InsertFacility,
  type InsertRoutineMaintenance,
  type RoutineMaintenance,
  type InsertRoutineMaintenancePhoto,
  type RoutineMaintenancePhoto,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, sql, or, isNull, asc } from "drizzle-orm";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// S3 client setup using env variables
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const S3_BUCKET = process.env.AWS_S3_BUCKET;

// Helper to upload to S3
async function uploadFileToS3(key: string, fileBuffer: Buffer, contentType: string) {
  const params = {
    Bucket: S3_BUCKET!,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

// Interface for storage operations
export interface IStorage {
  // Organization operations
  createOrganization(orgData: InsertOrganization): Promise<Organization>;
  getOrganization(id: number): Promise<Organization | undefined>;
  getOrganizationById(id: number): Promise<Organization | undefined>;
  getOrganizationBySlug(slug: string): Promise<Organization | undefined>;
  getOrganizationByDomain(domain: string): Promise<Organization | undefined>;
  updateOrganization(id: number, updates: Partial<InsertOrganization>): Promise<Organization>;
  getAllOrganizations(): Promise<any[]>;
  deleteOrganization(id: number): Promise<void>;
  
  // Building operations
  createBuilding(buildingData: InsertBuilding): Promise<Building>;
  getBuildingsByOrganization(organizationId: number): Promise<Building[]>;
  updateBuilding(id: number, updates: Partial<InsertBuilding>): Promise<Building>;
  deleteBuilding(id: number): Promise<void>;
  
  // Facility operations
  createFacility(facilityData: InsertFacility): Promise<Facility>;
  getFacilitiesByOrganization(organizationId: number): Promise<Facility[]>;
  updateFacility(id: number, updates: Partial<InsertFacility>): Promise<Facility>;
  deleteFacility(id: number): Promise<void>;
  
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getMaintenanceStaff(organizationId: number): Promise<User[]>;
  getAllUsers(): Promise<any[]>;
  updateUserRole(userId: string, role: string): Promise<User>;
  updateUserOrganization(userId: string, organizationId: number): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  
  // Request operations
  createRequest(requestData: InsertRequest, requestItemsData?: InsertRequestItems): Promise<Request>;
  createBuildingRequest(buildingRequestData: InsertBuildingRequest): Promise<BuildingRequest>;
  getRequestById(id: number): Promise<Request | undefined>;
  getRequestDetails(id: number): Promise<any>;
  
  // Photo uploads
  saveRequestPhoto(photoData: InsertRequestPhoto & { fileBuffer?: Buffer }): Promise<RequestPhoto>;
  getRequestPhotos(requestId: number): Promise<RequestPhoto[]>;
  
  // Dashboard stats
  getUserDashboardStats(userId: string): Promise<any>;
  getAdminDashboardStats(organizationId?: number): Promise<any>;
  
  // Request listings
  getRecentRequests(limit: number, organizationId?: number): Promise<any[]>;
  getUserRequests(userId: string, limit: number): Promise<any[]>;
  getUserRequestsByStatus(userId: string, status?: string): Promise<any[]>;
  getAllRequestsByStatus(status?: string, organizationId?: number): Promise<any[]>;
  getAssignedRequests(userId: string): Promise<any[]>;
  
  // Room history
  getAllBuildings(): Promise<string[]>;
  getRequestsByBuilding(building: string, roomNumber?: string): Promise<any[]>;
  getRoutineMaintenanceByBuilding(building: string, roomNumber?: string): Promise<any[]>;
  
  // Request timeline and messaging
  getRequestTimeline(requestId: number): Promise<any[]>;
  getRequestMessages(requestId: number): Promise<any[]>;
  createMessage(messageData: InsertMessage): Promise<Message>;
  
  // Request assignment and status updates
  assignRequest(assignmentData: InsertAssignment): Promise<Assignment>;
  updateRequestStatus(statusUpdateData: InsertStatusUpdate): Promise<StatusUpdate>;
  updateRequestPriority(requestId: number, priority: string): Promise<void>;
  createStatusUpdate(statusUpdateData: InsertStatusUpdate): Promise<StatusUpdate>;
  
  // Access control
  canAccessRequest(userId: string, requestId: number): Promise<boolean>;
  isRequestor(userId: string, requestId: number): Promise<boolean>;
  
  // Reports
  getReportsData(reportType: string): Promise<any>;
  
  // Email notifications
  getOrganizationAdminEmails(organizationId: number): Promise<string[]>;
  
  // Password reset operations
  storeResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  verifyResetToken(userId: string, token: string): Promise<boolean>;
  clearResetToken(userId: string): Promise<void>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  
  // Routine maintenance operations
  createRoutineMaintenance(maintenanceData: InsertRoutineMaintenance): Promise<RoutineMaintenance>;
  getRoutineMaintenance(id: number): Promise<RoutineMaintenance | undefined>;
  getAllRoutineMaintenance(organizationId: number): Promise<RoutineMaintenance[]>;
  updateRoutineMaintenance(id: number, updates: Partial<InsertRoutineMaintenance>): Promise<RoutineMaintenance>;
  deleteRoutineMaintenance(id: number): Promise<void>;
  saveRoutineMaintenancePhoto(photoData: InsertRoutineMaintenancePhoto & { fileBuffer?: Buffer }): Promise<RoutineMaintenancePhoto>;
  getRoutineMaintenancePhotos(maintenanceId: number): Promise<RoutineMaintenancePhoto[]>;
 

}

export class DatabaseStorage implements IStorage {
  // Organization operations
  async createOrganization(orgData: InsertOrganization): Promise<Organization> {
    const [org] = await db.insert(organizations).values(orgData).returning();
    return org;
  }

  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async getOrganizationById(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
    return org;
  }

  async getOrganizationByDomain(domain: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.domain, domain));
    return org;
  }

  async updateOrganization(id: number, updates: Partial<InsertOrganization>): Promise<Organization> {
    const [org] = await db
      .update(organizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return org;
  }

  async getAllOrganizations(): Promise<any[]> {
    console.log("Storage: getAllOrganizations called");
    try {
      const orgList = await db.select().from(organizations).orderBy(organizations.name);

      // For each org, fetch userCount and buildingCount using raw SQL
      const results = await Promise.all(orgList.map(async (org) => {
        const userCountResult = await db.execute(
          sql`SELECT COUNT(*)::int AS count FROM users WHERE organization_id = ${org.id}`
        );
        const buildingCountResult = await db.execute(
          sql`SELECT COUNT(*)::int AS count FROM buildings WHERE organization_id = ${org.id}`
        );
        const userCount = userCountResult.rows?.[0]?.count ?? 0;
        const buildingCount = buildingCountResult.rows?.[0]?.count ?? 0;
        return {
          ...org,
          userCount: Number(userCount) || 0,
          buildingCount: Number(buildingCount) || 0,
        };
      }));

      return results;
    } catch (error) {
      console.error("Storage: Error in getAllOrganizations:", error);
      throw error;
    }
  }

  async deleteOrganization(id: number): Promise<void> {
    await db.delete(organizations).where(eq(organizations.id, id));
  }

  // Building operations
  async createBuilding(buildingData: InsertBuilding): Promise<Building> {
    const [building] = await db.insert(buildings).values(buildingData).returning();
    return building;
  }

  async getBuildingsByOrganization(organizationId: number): Promise<Building[]> {
    return db.select().from(buildings).where(eq(buildings.organizationId, organizationId));
  }

  async updateBuilding(id: number, updates: Partial<InsertBuilding>): Promise<Building> {
    const [building] = await db
      .update(buildings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(buildings.id, id))
      .returning();
    return building;
  }

  async deleteBuilding(id: number): Promise<void> {
    await db.delete(buildings).where(eq(buildings.id, id));
  }
  
  // Facility operations
  async createFacility(facilityData: InsertFacility): Promise<Facility> {
    const [facility] = await db.insert(facilities).values(facilityData).returning();
    return facility;
  }

  async getFacilitiesByOrganization(organizationId: number): Promise<Facility[]> {
    return db.select().from(facilities).where(eq(facilities.organizationId, organizationId));
  }

  async updateFacility(id: number, updates: Partial<InsertFacility>): Promise<Facility> {
    const [facility] = await db
      .update(facilities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(facilities.id, id))
      .returning();
    return facility;
  }

  async deleteFacility(id: number): Promise<void> {
    await db.delete(facilities).where(eq(facilities.id, id));
  }
  
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    console.log("=== STORAGE getUser DEBUG ===");
    console.log("Requested ID:", id);
    console.log("ID type:", typeof id);
    console.log("ID length:", id?.length);
    
    const [user] = await db.select().from(users).where(eq(users.id, id));
    console.log("Database query result:", user ? "Found user" : "No user found");
    
    if (user) {
      console.log("Found user details:", {
        id: user.id,
        email: user.email,
        role: user.role
      });
    } else {
      // Try to find by converting ID to string
      console.log("Attempting alternative ID lookups...");
      const allUsers = await db.select().from(users);
      console.log("Total users in database:", allUsers.length);
      
      const matchingUser = allUsers.find(u => u.id.toString() === id.toString());
      if (matchingUser) {
        console.log("Found user via string conversion:", matchingUser.email);
        return matchingUser;
      }
    }
    
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          role: userData.role,
          organizationId: userData.organizationId,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  async getMaintenanceStaff(organizationId: number): Promise<User[]> {
    return db.select().from(users).where(and(
      or(
        eq(users.role, 'maintenance'),
        eq(users.role, 'admin')
      ),
      eq(users.organizationId, organizationId)
    ));
  }
  
  async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await db.select().from(users);
      return allUsers;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserOrganization(userId: string, organizationId: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ organizationId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }
  
  // Request operations
  async createRequest(
    requestData: InsertRequest, 
    requestItemsData?: InsertRequestItems
  ): Promise<Request> {
    // Create the request
    const [request] = await db
      .insert(requests)
      .values(requestData)
      .returning();
    
    // If this is a facilities request and items are provided
    if (requestData.requestType === 'facilities' && requestItemsData) {
      // Create the facilities request items
      await db
        .insert(requestItems)
        .values({
          ...requestItemsData,
          requestId: request.id
        });
    }
    
    return request;
  }
  
  // Create building request separately
  async createBuildingRequest(buildingRequestData: InsertBuildingRequest): Promise<BuildingRequest> {
    // Create the building request details
    const [buildingRequest] = await db
      .insert(buildingRequests)
      .values(buildingRequestData)
      .returning();
      
    return buildingRequest;
  }
  
  async getRequestById(id: number): Promise<Request | undefined> {
    const [request] = await db.select().from(requests).where(eq(requests.id, id));
    return request;
  }
  
  async getRequestDetails(id: number): Promise<any> {
    // Get request with its items
    const [request] = await db.select().from(requests).where(eq(requests.id, id));
    
    if (!request) {
      return null;
    }
    
    let items = null;
    let buildingDetails = null;
    
    // Get details based on request type
    if (request.requestType === 'facilities') {
      // Get request items for facilities requests
      [items] = await db.select().from(requestItems).where(eq(requestItems.requestId, id));
    } else if (request.requestType === 'building') {
      // Get building request details
      [buildingDetails] = await db.select().from(buildingRequests).where(eq(buildingRequests.requestId, id));
    }
    
    // Get requestor info
    const [requestor] = await db.select().from(users).where(eq(users.id, request.requestorId));
    
    // Get assignment if any
    const [assignment] = await db
      .select({
        assignee: users,
        assignment: assignments
      })
      .from(assignments)
      .where(eq(assignments.requestId, id))
      .leftJoin(users, eq(users.id, assignments.assigneeId))
      .orderBy(desc(assignments.assignedAt))
      .limit(1);
    
    return {
      ...request,
      items,
      buildingDetails,
      requestor: requestor ? {
        id: requestor.id,
        name: `${requestor.firstName || ''} ${requestor.lastName || ''}`.trim(),
        email: requestor.email,
        profileImageUrl: requestor.profileImageUrl
      } : null,
      assignee: assignment && assignment.assignee ? {
        id: assignment.assignee.id,
        name: `${assignment.assignee.firstName || ''} ${assignment.assignee.lastName || ''}`.trim(),
        profileImageUrl: assignment.assignee.profileImageUrl
      } : null
    };
  }
  
  // Dashboard stats
  async getUserDashboardStats(userId: string): Promise<any> {
    const total = await db
      .select({ count: count() })
      .from(requests)
      .where(eq(requests.requestorId, userId));
    
    const pending = await db
      .select({ count: count() })
      .from(requests)
      .where(and(
        eq(requests.requestorId, userId),
        eq(requests.status, 'pending')
      ));
    
    const inProgress = await db
      .select({ count: count() })
      .from(requests)
      .where(and(
        eq(requests.requestorId, userId),
        eq(requests.status, 'in-progress')
      ));
    
    const completed = await db
      .select({ count: count() })
      .from(requests)
      .where(and(
        eq(requests.requestorId, userId),
        eq(requests.status, 'completed')
      ));
    
    return {
      total: total[0].count,
      pending: pending[0].count,
      inProgress: inProgress[0].count,
      completed: completed[0].count
    };
  }
  
  async getAdminDashboardStats(organizationId?: number): Promise<any> {
    // If organizationId is provided, filter by organization (for regular admins)
    // If not provided, show all data (for super admins)
    const whereClause = organizationId ? eq(requests.organizationId, organizationId) : undefined;
    
    const total = await db.select({ count: count() }).from(requests).where(whereClause);
    
    const pending = await db
      .select({ count: count() })
      .from(requests)
      .where(organizationId ? and(eq(requests.status, 'pending'), eq(requests.organizationId, organizationId)) : eq(requests.status, 'pending'));
    
    const inProgress = await db
      .select({ count: count() })
      .from(requests)
      .where(organizationId ? and(eq(requests.status, 'in-progress'), eq(requests.organizationId, organizationId)) : eq(requests.status, 'in-progress'));
    
    const completed = await db
      .select({ count: count() })
      .from(requests)
      .where(organizationId ? and(eq(requests.status, 'completed'), eq(requests.organizationId, organizationId)) : eq(requests.status, 'completed'));
    
    return {
      total: total[0].count,
      pending: pending[0].count,
      inProgress: inProgress[0].count,
      completed: completed[0].count
    };
  }
  
  // Request listings
  async getRecentRequests(limit: number, organizationId?: number): Promise<any[]> {
    let query = db
      .select({
        request: requests,
        requestor: users
      })
      .from(requests)
      .leftJoin(users, eq(users.id, requests.requestorId))
      .orderBy(desc(requests.createdAt))
      .limit(limit);

    // Filter by organization if provided (for regular admins)
    if (organizationId) {
      query = query.where(eq(requests.organizationId, organizationId)) as any;
    }
    
    const requestList = await query;
    
    return requestList.map(item => ({
      ...item.request,
      requestor: item.requestor ? {
        id: item.requestor.id,
        name: `${item.requestor.firstName || ''} ${item.requestor.lastName || ''}`.trim(),
        email: item.requestor.email
      } : null
    }));
  }
  
  async getUserRequests(userId: string, limit: number): Promise<any[]> {
    try {
      // Get regular requests
      const regularRequests = await db
        .select()
        .from(requests)
        .where(eq(requests.requestorId, userId))
        .orderBy(desc(requests.createdAt))
        .limit(limit);

      // Get routine maintenance tasks created by user
      const routineMaintenanceTasks = await db
        .select({
          id: routineMaintenance.id,
          requestType: sql`'routine_maintenance'`,
          facility: routineMaintenance.facility,
          event: routineMaintenance.event,
          eventDate: routineMaintenance.dateBegun,
          status: sql`'active'`,
          priority: sql`'medium'`,
          createdAt: routineMaintenance.createdAt,
          updatedAt: routineMaintenance.updatedAt,
          requestorId: routineMaintenance.createdById,
          photoUrl: sql`null`,
          organizationId: routineMaintenance.organizationId,
        })
        .from(routineMaintenance)
        .where(eq(routineMaintenance.createdById, userId))
        .orderBy(desc(routineMaintenance.createdAt))
        .limit(limit);

      // Combine and sort by creation date
      const allRequests = [...regularRequests, ...routineMaintenanceTasks];
      return allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error("Error getting user requests:", error);
      return [];
    }
  }
  
  async getUserRequestsByStatus(userId: string, status?: string): Promise<any[]> {
    try {
      // First, get basic request data
      let queryBuilder = db
        .select({
          request: requests
        })
        .from(requests)
        .where(eq(requests.requestorId, userId));
      
      if (status) {
        queryBuilder = queryBuilder.where(eq(requests.status, status));
      }
      
      const results = await queryBuilder.orderBy(desc(requests.updatedAt));
      
      // For each request, get assignment data separately if needed
      const requestsWithAssignees = await Promise.all(
        results.map(async (item) => {
          // Get assignment info if it exists
          const assignmentData = await db
            .select({
              assignment: assignments,
              assignee: users
            })
            .from(assignments)
            .leftJoin(users, eq(users.id, assignments.assigneeId))
            .where(eq(assignments.requestId, item.request.id))
            .limit(1);
            
          const assigneeData = assignmentData.length > 0 && assignmentData[0].assignee 
            ? {
                id: assignmentData[0].assignee.id,
                name: `${assignmentData[0].assignee.firstName || ''} ${assignmentData[0].assignee.lastName || ''}`.trim(),
                profileImageUrl: assignmentData[0].assignee.profileImageUrl
              } 
            : null;
            
          return {
            ...item.request,
            assignee: assigneeData
          };
        })
      );
      
      return requestsWithAssignees;
    } catch (error) {
      console.error("Error fetching user requests by status:", error);
      return [];
    }
  }
  
  async getAllRequestsByStatus(status?: string, organizationId?: number): Promise<any[]> {
    try {
      // Get regular requests
      let regularQueryBuilder = db
        .select({
          request: requests,
          requestor: users
        })
        .from(requests)
        .leftJoin(users, eq(users.id, requests.requestorId));
      
      // Build where conditions for regular requests
      const regularConditions = [];
      if (status) {
        regularConditions.push(eq(requests.status, status));
      }
      if (organizationId) {
        regularConditions.push(eq(requests.organizationId, organizationId));
      }
      
      if (regularConditions.length > 0) {
        regularQueryBuilder = regularQueryBuilder.where(regularConditions.length === 1 ? regularConditions[0] : and(...regularConditions)) as any;
      }
      
      const regularResults = await regularQueryBuilder.orderBy(desc(requests.updatedAt));
      
      // Get routine maintenance tasks
      const routineTable = routineMaintenance;
      let routineQueryBuilder = db
        .select({
          request: {
            id: routineTable.id,
            requestType: sql`'routine_maintenance'`,
            facility: routineTable.facility,
            event: routineTable.event,
            eventDate: routineTable.dateBegun,
            status: sql`'active'`,
            priority: sql`'medium'`,
            createdAt: routineTable.createdAt,
            updatedAt: routineTable.updatedAt,
            requestorId: routineTable.createdById,
            photoUrl: sql`null`,
            organizationId: routineTable.organizationId,
          },
          requestor: users
        })
        .from(routineTable)
        .leftJoin(users, eq(users.id, routineTable.createdById));
      
      // Build where conditions for routine maintenance
      const routineConditions = [];
      if (organizationId) {
        routineConditions.push(eq(routineTable.organizationId, organizationId));
      }
      
      if (routineConditions.length > 0) {
        routineQueryBuilder = routineQueryBuilder.where(routineConditions.length === 1 ? routineConditions[0] : and(...routineConditions)) as any;
      }
      
      const routineResults = await routineQueryBuilder.orderBy(desc(routineTable.updatedAt));
      
      // Combine both results
      const allResults = [...regularResults, ...routineResults];
      
      // For each request, get assignment data separately
      const enrichedRequests = await Promise.all(
        allResults.map(async (item) => {
          // Get assignment info if it exists (only for regular requests)
          let assigneeInfo = null;
          if (item.request.requestType !== 'routine_maintenance') {
            const assignmentData = await db
              .select({
                assignment: assignments,
                assignee: users
              })
              .from(assignments)
              .leftJoin(users, eq(users.id, assignments.assigneeId))
              .where(eq(assignments.requestId, item.request.id))
              .limit(1);
              
            assigneeInfo = assignmentData.length > 0 && assignmentData[0].assignee 
              ? {
                  id: assignmentData[0].assignee.id,
                  name: `${assignmentData[0].assignee.firstName || ''} ${assignmentData[0].assignee.lastName || ''}`.trim(),
                  profileImageUrl: assignmentData[0].assignee.profileImageUrl
                } 
              : null;
          }
            
          // Format the requestor info
          const requestorInfo = item.requestor ? {
            id: item.requestor.id,
            name: `${item.requestor.firstName || ''} ${item.requestor.lastName || ''}`.trim(),
            email: item.requestor.email
          } : null;
            
          return {
            ...item.request,
            requestor: requestorInfo,
            assignee: assigneeInfo
          };
        })
      );
      
      // Sort by updated date
      return enrichedRequests.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
      console.error("Error fetching all requests by status:", error);
      return [];
    }
  }
  
  async getAssignedRequests(userId: string): Promise<any[]> {
    try {
      // First verify the user exists
      const assigneeResult = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (!assigneeResult.length) {
        console.error(`User with ID ${userId} not found`);
        return [];
      }
      
      // Get all assignments for this user first
      const assignmentResults = await db
        .select()
        .from(assignments)
        .where(eq(assignments.assigneeId, userId));
      
      if (!assignmentResults.length) {
        return []; // No assignments found
      }
      
      // Get details for each assigned request
      const assignedRequests = await Promise.all(
        assignmentResults.map(async (assignment) => {
          // Get the request details
          const [requestData] = await db
            .select({
              request: requests,
              requestor: users
            })
            .from(requests)
            .leftJoin(users, eq(users.id, requests.requestorId))
            .where(eq(requests.id, assignment.requestId));
          
          if (!requestData) {
            return null; // Skip if request not found
          }
          
          // Format the response
          return {
            ...requestData.request,
            requestor: requestData.requestor ? {
              id: requestData.requestor.id,
              name: `${requestData.requestor.firstName || ''} ${requestData.requestor.lastName || ''}`.trim(),
              email: requestData.requestor.email
            } : null,
            assignment: assignment
          };
        })
      );
      
      // Remove any null entries and sort by updatedAt
      return assignedRequests
        .filter(request => request !== null)
        .sort((a, b) => 
          new Date(b!.updatedAt).getTime() - new Date(a!.updatedAt).getTime()
        );
    } catch (error) {
      console.error("Error fetching assigned requests:", error);
      return [];
    }
  }
  
  // Request timeline and messaging
  async getRequestTimeline(requestId: number): Promise<any[]> {
    // Get request creation
    const [request] = await db.select().from(requests).where(eq(requests.id, requestId));
    
    if (!request) {
      return [];
    }
    
    // Get all status updates
    const statusItems = await db
      .select({
        update: statusUpdates,
        user: users
      })
      .from(statusUpdates)
      .leftJoin(users, eq(users.id, statusUpdates.updatedById))
      .where(eq(statusUpdates.requestId, requestId))
      .orderBy(asc(statusUpdates.updatedAt));
    
    // Get assignment if any
    const assignmentItems = await db
      .select({
        assignment: assignments,
        assignerId: assignments.assignerId,
        assigneeId: assignments.assigneeId
      })
      .from(assignments)
      .where(eq(assignments.requestId, requestId))
      .orderBy(asc(assignments.assignedAt));
    
    // Helper function to ensure valid date
    const safeDate = (date: Date | null | undefined): string => {
      if (!date || isNaN(new Date(date).getTime())) {
        return new Date().toISOString();
      }
      return new Date(date).toISOString();
    };
    
    // Combine and sort by date
    const timeline = [
      // Creation event
      {
        type: 'creation',
        date: safeDate(request.createdAt),
        status: 'created',
        user: {
          id: request.requestorId
        }
      },
      // Status update events
      ...statusItems.map(item => ({
        type: 'status',
        date: safeDate(item.update.updatedAt),
        status: item.update.status,
        note: item.update.note,
        user: item.user ? {
          id: item.user.id,
          name: `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim(),
          profileImageUrl: item.user.profileImageUrl
        } : { id: request.requestorId }
      })),
      // Assignment events
      ...assignmentItems.map(item => ({
        type: 'assignment',
        date: safeDate(item.assignment.assignedAt),
        assignerId: item.assignerId,
        assigneeId: item.assigneeId,
        note: item.assignment.internalNotes
      }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return timeline;
  }
  
  async getRequestMessages(requestId: number): Promise<any[]> {
    const messageList = await db
      .select({
        message: messages,
        sender: users
      })
      .from(messages)
      .leftJoin(users, eq(users.id, messages.senderId))
      .where(eq(messages.requestId, requestId))
      .orderBy(asc(messages.sentAt));
    
    return messageList.map(item => ({
      ...item.message,
      sender: item.sender ? {
        id: item.sender.id,
        name: `${item.sender.firstName || ''} ${item.sender.lastName || ''}`.trim(),
        profileImageUrl: item.sender.profileImageUrl,
        role: item.sender.role
      } : {
        id: 'unknown',
        name: 'Unknown User',
        role: 'user'
      }
    }));
  }
  
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    
    return message;
  }
  
  // Request assignment and status updates
  async assignRequest(assignmentData: InsertAssignment): Promise<Assignment> {
    const [assignment] = await db
      .insert(assignments)
      .values(assignmentData)
      .returning();
    
    return assignment;
  }
  
  async updateRequestStatus(statusUpdateData: InsertStatusUpdate): Promise<StatusUpdate> {
    // Create status update record
    const [statusUpdate] = await db
      .insert(statusUpdates)
      .values(statusUpdateData)
      .returning();
    
    // Update request status
    await db
      .update(requests)
      .set({ 
        status: statusUpdateData.status,
        updatedAt: new Date()
      })
      .where(eq(requests.id, statusUpdateData.requestId));
    
    return statusUpdate;
  }

  async updateRequestPriority(requestId: number, priority: string): Promise<void> {
    await db
      .update(requests)
      .set({ 
        priority: priority,
        updatedAt: new Date()
      })
      .where(eq(requests.id, requestId));
  }
  
  async createStatusUpdate(statusUpdateData: InsertStatusUpdate): Promise<StatusUpdate> {
    // Create status update record
    const [statusUpdate] = await db
      .insert(statusUpdates)
      .values(statusUpdateData)
      .returning();
    
    // Update request status
    await db
      .update(requests)
      .set({ 
        status: statusUpdateData.status,
        updatedAt: new Date()
      })
      .where(eq(requests.id, statusUpdateData.requestId));
    
    return statusUpdate;
  }
  
  // Access control
  async canAccessRequest(userId: string, requestId: number): Promise<boolean> {
    // Get user
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return false;
    }
    
    // Admin/maintenance can access all requests
    if (user.role === 'admin' || user.role === 'maintenance') {
      return true;
    }
    
    // Check if user is the requestor
    const [request] = await db
      .select()
      .from(requests)
      .where(and(
        eq(requests.id, requestId),
        eq(requests.requestorId, userId)
      ));
    
    // Check if user is assigned to this request
    const [assignment] = await db
      .select()
      .from(assignments)
      .where(and(
        eq(assignments.requestId, requestId),
        eq(assignments.assigneeId, userId)
      ));
    
    return !!request || !!assignment;
  }
  
  async isRequestor(userId: string, requestId: number): Promise<boolean> {
    const [request] = await db
      .select()
      .from(requests)
      .where(and(
        eq(requests.id, requestId),
        eq(requests.requestorId, userId)
      ));
    
    return !!request;
  }
  
  // Photo uploads
  async saveRequestPhoto(photoData: InsertRequestPhoto & { fileBuffer?: Buffer }): Promise<RequestPhoto> {
    try {
      console.log("Saving photo with data:", photoData);
      let photoUrl = photoData.photoUrl || `uploads/photos/${photoData.filename}`;
      let filePath = photoData.filePath;
      // If fileBuffer is provided, upload to S3
      if (photoData.fileBuffer) {
        const s3Key = `requests/${photoData.requestId}/${photoData.filename}`;
        photoUrl = await uploadFileToS3(s3Key, photoData.fileBuffer, photoData.mimeType || 'application/octet-stream');
        filePath = photoUrl; // Store S3 URL as filePath
      }
      // Map the data to match the database schema
      const photoToSave = {
        requestId: photoData.requestId,
        photoUrl,
        filename: photoData.filename,
        originalFilename: photoData.originalFilename,
        filePath,
        mimeType: photoData.mimeType,
        size: photoData.size,
        caption: photoData.caption,
        uploadedById: photoData.uploadedById
      };
      const [photo] = await db
        .insert(requestPhotos)
        .values(photoToSave)
        .returning();
      return photo;
    } catch (error) {
      console.error("Error saving request photo:", error);
      throw error;
    }
  }
  
  async getRequestPhotos(requestId: number): Promise<RequestPhoto[]> {
    try {
      const photos = await db
        .select()
        .from(requestPhotos)
        .where(eq(requestPhotos.requestId, requestId))
        .orderBy(desc(requestPhotos.uploadedAt));
      
      return photos;
    } catch (error) {
      console.error("Error fetching request photos:", error);
      throw error;
    }
  }
  
  // Room history
  async getAllBuildings(): Promise<string[]> {
    try {
      // Get buildings from both building_requests and routine_maintenance tables
      const result = await db.execute(sql`
        SELECT DISTINCT building_name 
        FROM (
          SELECT building as building_name FROM building_requests 
          WHERE building IS NOT NULL AND building != ''
          UNION
          SELECT facility as building_name FROM routine_maintenance 
          WHERE facility IS NOT NULL AND facility != ''
        ) AS all_buildings
        ORDER BY building_name
      `);
      
      console.log("Storage: getAllBuildings found", result.rows.length, "unique buildings");
      console.log("Storage: Building list:", result.rows.map((row: any) => row.building_name));
      
      // Extract the building names from the result
      return result.rows.map((row: any) => row.building_name);
    } catch (error) {
      console.error("Error fetching all buildings:", error);
      return [];
    }
  }
  
  async getRequestsByBuilding(building: string, roomNumber?: string): Promise<any[]> {
    try {
      console.log("Storage: getRequestsByBuilding called with:", { building, roomNumber });
      
      let query;
      
      if (roomNumber) {
        // Filter by both building and room number
        query = sql`
          SELECT r.*, b.building, b.room_number, b.description as building_description,
                 u.id as requestor_id, u.first_name as requestor_first_name, 
                 u.last_name as requestor_last_name, u.profile_image_url as requestor_image
          FROM requests r
          JOIN building_requests b ON r.id = b.request_id
          LEFT JOIN users u ON r.requestor_id = u.id
          WHERE b.building = ${building} AND b.room_number = ${roomNumber}
          ORDER BY r.created_at DESC
        `;
      } else {
        // Filter by building only
        query = sql`
          SELECT r.*, b.building, b.room_number, b.description as building_description,
                 u.id as requestor_id, u.first_name as requestor_first_name, 
                 u.last_name as requestor_last_name, u.profile_image_url as requestor_image
          FROM requests r
          JOIN building_requests b ON r.id = b.request_id
          LEFT JOIN users u ON r.requestor_id = u.id
          WHERE b.building = ${building}
          ORDER BY r.created_at DESC
        `;
      }
      
      // First, let's check what building requests exist
      const debugQuery = sql`SELECT DISTINCT building FROM building_requests ORDER BY building`;
      const debugResult = await db.execute(debugQuery);
      console.log("Storage: Available buildings in building_requests:", debugResult.rows.map((r: any) => r.building));
      
      // Check total building requests
      const countQuery = sql`SELECT COUNT(*) as total FROM building_requests`;
      const countResult = await db.execute(countQuery);
      console.log("Storage: Total building requests in database:", countResult.rows[0]?.total);
      
      console.log("Storage: Executing SQL query for building requests");
      const result = await db.execute(query);
      console.log("Storage: Raw result from database:", result.rows.length, "rows");
      
      // Format the results
      return result.rows.map((row: any) => {
        return {
          id: row.id,
          event: row.event,
          status: row.status,
          priority: row.priority,
          requestType: row.request_type,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          eventDate: row.event_date,
          buildingDetails: {
            building: row.building,
            roomNumber: row.room_number,
            description: row.building_description
          },
          requestor: {
            id: row.requestor_id,
            name: `${row.requestor_first_name || ''} ${row.requestor_last_name || ''}`.trim(),
            profileImageUrl: row.requestor_image
          }
        };
      });
    } catch (error) {
      console.error("Error fetching requests by building:", error);
      return [];
    }
  }

  async getRoutineMaintenanceByBuilding(building: string, roomNumber?: string): Promise<any[]> {
    try {
      let query;

      if (roomNumber) {
        query = sql`
          SELECT rm.*, u.id as requestor_id, u.first_name as requestor_first_name, 
                 u.last_name as requestor_last_name, u.profile_image_url as requestor_image
          FROM routine_maintenance rm
          JOIN users u ON rm.created_by_id = u.id
          WHERE rm.facility = ${building} AND rm.room_number = ${roomNumber}
          ORDER BY rm.created_at DESC
        `;
      } else {
        query = sql`
          SELECT rm.*, u.id as requestor_id, u.first_name as requestor_first_name, 
                 u.last_name as requestor_last_name, u.profile_image_url as requestor_image
          FROM routine_maintenance rm
          JOIN users u ON rm.created_by_id = u.id
          WHERE rm.facility = ${building}
          ORDER BY rm.created_at DESC
        `;
      }

      const result = await db.execute(query);

      return result.rows.map((row: any) => ({
        id: row.id,
        requestType: 'routine_maintenance',
        facility: row.facility,
        event: row.event,
        eventDate: row.date_begun,
        status: 'active',
        priority: 'medium',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        requestor: {
          id: row.requestor_id,
          name: `${row.requestor_first_name || ''} ${row.requestor_last_name || ''}`.trim(),
          profileImageUrl: row.requestor_image
        }
      }));
    } catch (error) {
      console.error("Error fetching routine maintenance by building:", error);
      return [];
    }
  }
  
  // Reports
  async getReportsData(reportType: string): Promise<any> {
    if (reportType === 'monthly') {
      // Get counts by month for the past 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const results = await db
        .select({
          month: sql`to_char(requests.created_at, 'YYYY-MM')`,
          count: count(),
          status: requests.status
        })
        .from(requests)
        .where(sql`requests.created_at >= ${sixMonthsAgo.toISOString()}`)
        .groupBy(sql`to_char(requests.created_at, 'YYYY-MM')`, requests.status)
        .orderBy(sql`to_char(requests.created_at, 'YYYY-MM')`);
      
      return {
        type: 'monthly',
        data: results
      };
    } else if (reportType === 'facility') {
      // Get counts by facility
      const results = await db
        .select({
          facility: requests.facility,
          count: count()
        })
        .from(requests)
        .groupBy(requests.facility)
        .orderBy(desc(count()));
      
      return {
        type: 'facility',
        data: results
      };
    } else if (reportType === 'status') {
      // Get current counts by status
      const results = await db
        .select({
          status: requests.status,
          count: count()
        })
        .from(requests)
        .groupBy(requests.status);
      
      return {
        type: 'status',
        data: results
      };
    } else {
      // Default to completion time report
      const results = await db
        .select({
          request: requests,
          created: statusUpdates.updatedAt,
          completed: sql`completed_status.updated_at`
        })
        .from(requests)
        .leftJoin(
          statusUpdates,
          and(
            eq(statusUpdates.requestId, requests.id),
            eq(statusUpdates.status, 'pending')
          )
        )
        .leftJoin(
          statusUpdates.as('completed_status'),
          and(
            eq(sql`completed_status.request_id`, requests.id),
            eq(sql`completed_status.status`, 'completed')
          )
        )
        .where(eq(requests.status, 'completed'));
      
      return {
        type: 'completion',
        data: results.map(item => ({
          id: item.request.id,
          facility: item.request.facility,
          event: item.request.event,
          created: item.created,
          completed: item.completed,
          timeToComplete: item.completed && item.created 
            ? Math.round((new Date(item.completed).getTime() - new Date(item.created).getTime()) / (1000 * 60 * 60 * 24)) 
            : null
        }))
      };
    }
  }

  async getOrganizationAdminEmails(organizationId: number): Promise<string[]> {
    try {
      console.log("Getting admin emails for organization:", organizationId);
      
      const adminUsers = await db
        .select({ email: users.email })
        .from(users)
        .where(
          and(
            eq(users.organizationId, organizationId),
            or(
              eq(users.role, 'admin'),
              eq(users.role, 'super_admin')
            )
          )
        );
      
      const emails = adminUsers.map(user => user.email).filter(email => email !== null);
      console.log("Found admin emails:", emails);
      
      return emails;
    } catch (error) {
      console.error("Error getting organization admin emails:", error);
      return [];
    }
  }

  // Password reset operations
  async storeResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    try {
      // Clear any existing tokens for this user
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.userId, userId));

      // Insert new token
      await db.insert(passwordResetTokens).values({
        userId,
        token,
        expiresAt,
        used: false,
      });
      
      console.log(`Reset token stored for user: ${userId}`);
    } catch (error) {
      console.error("Error storing reset token:", error);
      throw error;
    }
  }

  async verifyResetToken(userId: string, token: string): Promise<boolean> {
    try {
      const resetToken = await db
        .select()
        .from(passwordResetTokens)
        .where(
          and(
            eq(passwordResetTokens.userId, userId),
            eq(passwordResetTokens.token, token),
            eq(passwordResetTokens.used, false),
            sql`${passwordResetTokens.expiresAt} > NOW()`
          )
        )
        .limit(1);

      const isValid = resetToken.length > 0;
      console.log(`Token verification for user ${userId}: ${isValid ? 'valid' : 'invalid'}`);
      return isValid;
    } catch (error) {
      console.error("Error verifying reset token:", error);
      return false;
    }
  }

  async clearResetToken(userId: string): Promise<void> {
    try {
      await db
        .update(passwordResetTokens)
        .set({ used: true })
        .where(eq(passwordResetTokens.userId, userId));
      
      console.log(`Reset token cleared for user: ${userId}`);
    } catch (error) {
      console.error("Error clearing reset token:", error);
      throw error;
    }
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, userId));
      
      console.log(`Password updated for user: ${userId}`);
    } catch (error) {
      console.error("Error updating user password:", error);
      throw error;
    }
  }

  // Routine maintenance operations
  async createRoutineMaintenance(maintenanceData: InsertRoutineMaintenance): Promise<RoutineMaintenance> {
    try {
      const [result] = await db.insert(routineMaintenance).values(maintenanceData).returning();
      console.log(`Routine maintenance created with ID: ${result.id}`);
      return result;
    } catch (error) {
      console.error("Error creating routine maintenance:", error);
      throw error;
    }
  }

  async getRoutineMaintenance(id: number): Promise<RoutineMaintenance | undefined> {
    try {
      const [result] = await db
        .select()
        .from(routineMaintenance)
        .where(eq(routineMaintenance.id, id));
      
      return result;
    } catch (error) {
      console.error("Error getting routine maintenance:", error);
      return undefined;
    }
  }

  async getAllRoutineMaintenance(organizationId: number): Promise<RoutineMaintenance[]> {
    try {
      return await db
        .select()
        .from(routineMaintenance)
        .where(eq(routineMaintenance.organizationId, organizationId))
        .orderBy(desc(routineMaintenance.createdAt));
    } catch (error) {
      console.error("Error getting all routine maintenance:", error);
      return [];
    }
  }

  async updateRoutineMaintenance(id: number, updates: Partial<InsertRoutineMaintenance>): Promise<RoutineMaintenance> {
    try {
      const [result] = await db
        .update(routineMaintenance)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(routineMaintenance.id, id))
        .returning();
      
      console.log(`Routine maintenance updated with ID: ${id}`);
      return result;
    } catch (error) {
      console.error("Error updating routine maintenance:", error);
      throw error;
    }
  }

  async deleteRoutineMaintenance(id: number): Promise<void> {
    try {
      await db.delete(routineMaintenance).where(eq(routineMaintenance.id, id));
      console.log(`Routine maintenance deleted with ID: ${id}`);
    } catch (error) {
      console.error("Error deleting routine maintenance:", error);
      throw error;
    }
  }

  async saveRoutineMaintenancePhoto(photoData: InsertRoutineMaintenancePhoto & { fileBuffer?: Buffer }): Promise<RoutineMaintenancePhoto> {
    try {
      const { fileBuffer, ...dbData } = photoData;
      
      if (fileBuffer) {
        // Generate unique filename
        const timestamp = Date.now();
        const randomId = Math.floor(Math.random() * 1000000);
        const extension = photoData.originalFilename?.split('.').pop() || 'jpg';
        const filename = `routine-maintenance-${timestamp}-${randomId}.${extension}`;
        
        // Upload to S3 if configured, otherwise save locally
        let photoUrl;
        if (S3_BUCKET) {
          const key = `routine-maintenance-photos/${filename}`;
          photoUrl = await uploadFileToS3(key, fileBuffer, photoData.mimeType || 'image/jpeg');
        } else {
          // Save locally
          const uploadDir = path.join(process.cwd(), 'uploads', 'photos');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          
          const filePath = path.join(uploadDir, filename);
          fs.writeFileSync(filePath, fileBuffer);
          photoUrl = `/uploads/photos/${filename}`;
        }
        
        dbData.photoUrl = photoUrl;
        dbData.filename = filename;
      }
      
      const [result] = await db.insert(routineMaintenancePhotos).values(dbData).returning();
      console.log(`Routine maintenance photo saved with ID: ${result.id}`);
      return result;
    } catch (error) {
      console.error("Error saving routine maintenance photo:", error);
      throw error;
    }
  }

  async getRoutineMaintenancePhotos(maintenanceId: number): Promise<RoutineMaintenancePhoto[]> {
    try {
      return await db
        .select()
        .from(routineMaintenancePhotos)
        .where(eq(routineMaintenancePhotos.routineMaintenanceId, maintenanceId))
        .orderBy(asc(routineMaintenancePhotos.uploadedAt));
    } catch (error) {
      console.error("Error getting routine maintenance photos:", error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();
