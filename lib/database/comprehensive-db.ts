import type {
  AuthSession,
  User,
  Resource,
  FundingOpportunity,
  District,
  Donation,
  DevelopmentProject,
  ConnectionRequest,
  NetworkEvent,
  ForumCategory,
  ForumPost,
  ForumReply,
  Conversation,
  Message,
  TypingIndicator,
  OnlineStatus,
  Notification,
  DatabaseEvent,
  AppAnalytics,
  PaymentMethod,
  Transaction,
  ResourceDownload,
  ResourceView,
} from "./types"
import {ActivityType, DownloadType} from "@/lib/enums/db-enums";
import {InMemoryDatabase} from "@/lib/database/in-memory-db";

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Generate session token
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 32)
}

// Add new properties to the class
// @ts-ignore
export class ComprehensiveDatabase extends InMemoryDatabase{
  // Add new data stores
  private resourceDownloads = new Map<string, ResourceDownload>()
  private resourceViews = new Map<string, ResourceView>()
  private sessions = new Map<string, AuthSession>()

  // Core Data Stores
  private users = new Map<string, User>()
  private resources = new Map<string, Resource>()
  private fundingOpportunities = new Map<string, FundingOpportunity>()
  private districts = new Map<string, District>()
  private donations = new Map<string, Donation>()
  private projects = new Map<string, DevelopmentProject>()
  private connectionRequests = new Map<string, ConnectionRequest>()
  private events = new Map<string, NetworkEvent>()
  private paymentMethods = new Map<string, PaymentMethod>()
  private transactions = new Map<string, Transaction>()

  // Forum & Chat (from previous implementation)
  private forumCategories = new Map<string, ForumCategory>()
  private forumPosts = new Map<string, ForumPost>()
  private forumReplies = new Map<string, ForumReply>()
  private conversations = new Map<string, Conversation>()
  private messages = new Map<string, Message>()

  // Real-time Data
  private typingIndicators = new Map<string, TypingIndicator>()
  private onlineStatuses = new Map<string, OnlineStatus>()
  private notifications = new Map<string, Notification[]>()

  // Event System
  private eventListeners = new Map<string, Array<(event: DatabaseEvent) => void>>()
  private eventHistory: DatabaseEvent[] = []

  // Indexes for Performance
  private resourcesByCategory = new Map<string, Set<string>>()
  private donationsByUser = new Map<string, Set<string>>()
  private donationsByDistrict = new Map<string, Set<string>>()
  private projectsByDistrict = new Map<string, Set<string>>()
  private eventsByOrganizer = new Map<string, Set<string>>()
  private connectionsByUser = new Map<string, Set<string>>()
  private transactionsByUser = new Map<string, Set<string>>()

  // Add new indexes
  private downloadsByResource = new Map<string, Set<string>>()
  private downloadsByUser = new Map<string, Set<string>>() // Rename existing to avoid conflict
  private viewsByResource = new Map<string, Set<string>>()
  private viewsByUser = new Map<string, Set<string>>()

  constructor() {
    super();
    // Initialize all Maps first
    this.sessions = new Map<string, AuthSession>()
    this.users = new Map<string, User>()
    this.resources = new Map<string, Resource>()
    this.fundingOpportunities = new Map<string, FundingOpportunity>()
    this.districts = new Map<string, District>()
    this.donations = new Map<string, Donation>()
    this.projects = new Map<string, DevelopmentProject>()
    this.connectionRequests = new Map<string, ConnectionRequest>()
    this.events = new Map<string, NetworkEvent>()
    this.paymentMethods = new Map<string, PaymentMethod>()
    this.transactions = new Map<string, Transaction>()
    this.forumCategories = new Map<string, ForumCategory>()
    this.forumPosts = new Map<string, ForumPost>()
    this.forumReplies = new Map<string, ForumReply>()
    this.conversations = new Map<string, Conversation>()
    this.messages = new Map<string, Message>()
    this.typingIndicators = new Map<string, TypingIndicator>()
    this.onlineStatuses = new Map<string, OnlineStatus>()
    this.notifications = new Map<string, Notification[]>()
    this.eventListeners = new Map<string, Array<(event: DatabaseEvent) => void>>()
    this.eventHistory = []
    this.resourcesByCategory = new Map<string, Set<string>>()
    this.donationsByUser = new Map<string, Set<string>>()
    this.donationsByDistrict = new Map<string, Set<string>>()
    this.projectsByDistrict = new Map<string, Set<string>>()
    this.eventsByOrganizer = new Map<string, Set<string>>()
    this.connectionsByUser = new Map<string, Set<string>>()
    this.transactionsByUser = new Map<string, Set<string>>()
    this.downloadsByResource = new Map<string, Set<string>>()
    this.downloadsByUser = new Map<string, Set<string>>()
    this.viewsByResource = new Map<string, Set<string>>()
    this.viewsByUser = new Map<string, Set<string>>()
    this.resourceDownloads = new Map<string, ResourceDownload>()
    this.resourceViews = new Map<string, ResourceView>()

    this.initializeData()
    this.startCleanupTasks()
  }

  private initializeData() {
    // Initialize with sample data
    const sampleUser: User = {
      id: "user-1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: "password123", // In real app, this would be hashed
      role: "entrepreneur",
      district: "Western Area",
      businessType: "Technology",
      joinedAt: new Date(),
      isActive: true,
      profile: {
        bio: "Tech entrepreneur passionate about digital solutions",
        skills: ["Web Development", "Digital Marketing"],
        interests: ["Innovation", "Networking"],
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastActive: new Date(),
      isOnline: false,
      userType: "entrepreneur"
    }

    this.users.set(sampleUser.id, sampleUser)
  }

  // Authentication Methods
  register(userData: Omit<User, "id" | "joinedAt" | "lastActive" | "isOnline" | "connections" | "rating">): {
    user: User
    session: AuthSession
  } {
    // Check if email already exists
    const existingUser = Array.from(this.users.values()).find((u) => u.email === userData.email)
    if (existingUser) {
      throw new Error("Email already registered")
    }

    const user: User = {
      ...userData,
      id: generateId(),
      joinedAt: new Date(),
      lastActive: new Date(),
      isOnline: false,
      connections: [],
      rating: 0,
    }

    this.users.set(user.id, user)
    this.initializeUserIndexes(user.id)

    const session = this.createSession(user.id)

    this.emit({
      type: "user_registered",
      data: { userId: user.id, userType: user.userType },
      timestamp: new Date(),
      userId: user.id,
    })

    return { user, session }
  }

  login(email: string, password: string): { user: User; session: AuthSession } | null {
    const user = Array.from(this.users.values()).find((u) => u.email === email && u.password === password)

    if (!user) {
      return null
    }

    // Invalidate existing sessions
    this.invalidateUserSessions(user.id)

    const session = this.createSession(user.id)
    this.setUserOnline(user.id)

    return { user, session }
  }

  logout(sessionToken: string): boolean {
    const session = this.sessions.get(sessionToken)
    if (!session) return false

    session.isActive = false
    this.sessions.set(sessionToken, session)
    this.setUserOffline(session.userId)

    return true
  }

  validateSession(sessionToken: string): User | null {
    const session = this.sessions.get(sessionToken)
    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return null
    }

    const user = this.users.get(session.userId)
    if (user) {
      this.updateUser(user.id, { lastActive: new Date() })
    }

    return user || null
  }

  private createSession(userId: string): AuthSession {
    const session: AuthSession = {
      id: generateId(),
      userId,
      token: generateSessionToken(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
    }

    this.sessions.set(session.token, session)
    return session
  }

  private invalidateUserSessions(userId: string) {
    for (const [token, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        session.isActive = false
        this.sessions.set(token, session)
      }
    }
  }

  // User Management
  getUser(userId: string): User | undefined {
    return this.users.get(userId)
  }

  updateUser(userId: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(userId)
    if (!user) return undefined

    const updatedUser = { ...user, ...updates }
    this.users.set(userId, updatedUser)
    return updatedUser
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  searchUsers(query: string): User[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.users.values()).filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.business?.toLowerCase().includes(lowercaseQuery) ||
        user.profile.skills.some((skill) => skill.toLowerCase().includes(lowercaseQuery)) ||
        user.district.toLowerCase().includes(lowercaseQuery),
    )
  }

  // Resource Management
  // Update the createResource method to include new fields
  createResource(resourceData: Omit<Resource, "id" | "createdAt" | "updatedAt" | "downloads" | "rating">): Resource {
    const resource: Resource = {
      ...resourceData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      downloads: 0,
      rating: 0,
      // Ensure all required fields have defaults
      isRestricted: resourceData.isRestricted ?? false,
      accessLevel: resourceData.accessLevel ?? "members",
      fileFormat: resourceData.fileFormat ?? this.getFileFormat(resourceData.mimeType ?? "application/pdf"),
      views: [],
      lastDownloadedAt: undefined,
      // Ensure mimeType is set
      mimeType: resourceData.mimeType ?? "application/pdf",
      // Ensure fileSize is set
      fileSize: resourceData.fileSize ?? 0,
      // Ensure other arrays are initialized
      tags: resourceData.tags ?? [],
      previewPages: resourceData.previewPages ?? [],
    }

    this.resources.set(resource.id, resource)

    if (!this.resourcesByCategory.has(resource.category)) {
      this.resourcesByCategory.set(resource.category, new Set())
    }
    this.resourcesByCategory.get(resource.category)?.add(resource.id)

    // Initialize tracking indexes
    this.downloadsByResource.set(resource.id, new Set())
    this.viewsByResource.set(resource.id, new Set())

    return resource
  }

  // Add method to track resource views
  trackResourceView(
    resourceId: string,
    userId: string,
    viewType: "preview" | "full",
    viewDuration?: number,
  ): ResourceView {
    const view: ResourceView = {
      id: generateId(),
      resourceId,
      userId,
      viewedAt: new Date(),
      viewDuration,
      viewType,
    }

    this.resourceViews.set(view.id, view)
    this.viewsByResource.get(resourceId)?.add(view.id)

    if (!this.viewsByUser.has(userId)) {
      this.viewsByUser.set(userId, new Set())
    }
    this.viewsByUser.get(userId)?.add(view.id)

    // Update resource view count in analytics
    const resource = this.resources.get(resourceId)
    if (resource && !resource.views.includes(view)) {
      resource.views.push(view)
      this.resources.set(resourceId, resource)
    }

    return view
  }

  // Update downloadResource method to track downloads properly
  downloadResource(
    resourceId: string,
    userId: string,
    downloadMethod: DownloadType = "direct",
  ): { success: boolean; download?: ResourceDownload; error?: string } {
    const resource = this.resources.get(resourceId)
    if (!resource) {
      return { success: false, error: "Resource not found" }
    }

    // Check access permissions
    const user = this.users.get(userId)
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    if (resource.accessLevel === "premium" && user.userType !== "supporter") {
      return { success: false, error: "Premium access required" }
    }

    // Create download record
    const download: ResourceDownload = {
      id: generateId(),
      resourceId,
      userId,
      downloadedAt: new Date(),
      downloadMethod,
    }

    this.resourceDownloads.set(download.id, download)
    this.downloadsByResource.get(resourceId)?.add(download.id)

    if (!this.downloadsByUser.has(userId)) {
      this.downloadsByUser.set(userId, new Set())
    }
    this.downloadsByUser.get(userId)?.add(download.id)

    // Update resource stats
    resource.downloads++
    resource.lastDownloadedAt = new Date()
    this.resources.set(resourceId, resource)

    // Create notification for resource author (if not downloading own resource)
    if (resource.uploadedBy !== userId) {
      this.createNotification(resource.uploadedBy, {
        type: "info",
        title: "Resource Downloaded",
        message: `Your resource "${resource.title}" was downloaded by ${user.name}`,
        data: { resourceId, downloadedBy: userId, downloadMethod },
      })
    }

    // Track the download as a view
    this.trackResourceView(resourceId, userId, "full")

    return { success: true, download }
  }

  // Get resource analytics
  getResourceAnalytics(resourceId: string): {
    totalViews: number
    totalDownloads: number
    uniqueViewers: number
    uniqueDownloaders: number
    recentActivity: Array<{ type: "view" | "download"; date: Date; userId: string }>
  } {
    const resource = this.resources.get(resourceId)
    if (!resource) {
      return {
        totalViews: 0,
        totalDownloads: 0,
        uniqueViewers: 0,
        uniqueDownloaders: 0,
        recentActivity: [],
      }
    }

    const viewIds = Array.from(this.viewsByResource.get(resourceId) || [])
    const downloadIds = Array.from(this.downloadsByResource.get(resourceId) || [])

    const views = viewIds.map((id) => this.resourceViews.get(id)!).filter(Boolean)
    const downloads = downloadIds.map((id) => this.resourceDownloads.get(id)!).filter(Boolean)

    const uniqueViewers = new Set(views.map((v) => v.userId)).size
    const uniqueDownloaders = new Set(downloads.map((d) => d.userId)).size

    // Combine recent activity
    const recentActivity = [
      ...views.map((v) => ({ type: "view" as const, date: v.viewedAt, userId: v.userId })),
      ...downloads.map((d) => ({ type: "download" as const, date: d.downloadedAt, userId: d.userId })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10)

    return {
      totalViews: views.length,
      totalDownloads: downloads.length,
      uniqueViewers,
      uniqueDownloaders,
      recentActivity,
    }
  }

  // Get user's resource history
  getUserResourceHistory(userId: string): {
    downloads: ResourceDownload[]
    views: ResourceView[]
  } {
    const downloadIds = Array.from(this.downloadsByUser.get(userId) || [])
    const viewIds = Array.from(this.viewsByUser.get(userId) || [])

    return {
      downloads: downloadIds
        .map((id) => this.resourceDownloads.get(id)!)
        .filter(Boolean)
        .sort((a, b) => b.downloadedAt.getTime() - a.downloadedAt.getTime()),
      views: viewIds
        .map((id) => this.resourceViews.get(id)!)
        .filter(Boolean)
        .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime()),
    }
  }

  // Helper method to determine file format
  private getFileFormat(mimeType: string): "pdf" | "doc" | "docx" {
    switch (mimeType) {
      case "application/pdf":
        return "pdf"
      case "application/msword":
        return "doc"
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "docx"
      default:
        return "pdf"
    }
  }

  getResource(resourceId: string): Resource | undefined {
    return this.resources.get(resourceId)
  }

  getResourcesByCategory(category: string): Resource[] {
    const resourceIds = Array.from(this.resourcesByCategory.get(category) || [])
    return resourceIds
      .map((id) => this.resources.get(id)!)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getAllResources(): Resource[] {
    return Array.from(this.resources.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Funding Opportunities
  createFundingOpportunity(
    opportunityData: Omit<FundingOpportunity, "id" | "createdAt" | "updatedAt">,
  ): FundingOpportunity {
    const opportunity: FundingOpportunity = {
      ...opportunityData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.fundingOpportunities.set(opportunity.id, opportunity)
    return opportunity
  }

  getFundingOpportunities(): FundingOpportunity[] {
    return Array.from(this.fundingOpportunities.values())
      .filter((opp) => opp.status !== "Closed")
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
  }

  // Love Your District (LYD) Management
  createDistrict(districtData: Omit<District, "id" | "projects">): District {
    const district: District = {
      ...districtData,
      id: generateId(),
      projects: [],
    }

    this.districts.set(district.id, district)
    this.donationsByDistrict.set(district.id, new Set())
    this.projectsByDistrict.set(district.id, new Set())

    return district
  }

  getDistricts(): District[] {
    return Array.from(this.districts.values()).sort((a, b) => a.rank - b.rank)
  }

  getDistrict(districtId: string): District | undefined {
    return this.districts.get(districtId)
  }

  makeDonation(donationData: Omit<Donation, "id" | "createdAt" | "status">): Donation {
    const donation: Donation = {
      ...donationData,
      id: generateId(),
      createdAt: new Date(),
      status: "pending",
    }

    this.donations.set(donation.id, donation)
    this.donationsByUser.get(donation.userId)?.add(donation.id)
    this.donationsByDistrict.get(donation.districtId)?.add(donation.id)

    // Process donation (simulate)
    setTimeout(() => {
      this.processDonation(donation.id)
    }, 2000)

    this.emit({
      type: "donation_made",
      data: {
        donationId: donation.id,
        userId: donation.userId,
        districtId: donation.districtId,
        amount: donation.amount,
      },
      timestamp: new Date(),
      userId: donation.userId,
    })

    return donation
  }

  private processDonation(donationId: string) {
    const donation = this.donations.get(donationId)
    if (!donation) return

    donation.status = "completed"
    donation.processedAt = new Date()
    donation.transactionId = `txn_${generateId()}`
    this.donations.set(donationId, donation)

    // Update district totals
    const district = this.districts.get(donation.districtId)
    if (district) {
      district.total += donation.amount
      district.contributors = this.donationsByDistrict.get(donation.districtId)?.size || 0
      this.districts.set(district.id, district)
    }

    // Create transaction record
    this.createTransaction({
      userId: donation.userId,
      type: "donation",
      amount: donation.amount,
      currency: "SLL",
      status: "completed",
      reference: donation.transactionId!,
      description: `Donation to ${district?.name}`,
      metadata: { donationId: donation.id, districtId: donation.districtId },
    })

    // Notify user
    this.createNotification(donation.userId, {
      type: "donation_success",
      title: "Donation Successful",
      message: `Your donation of Le ${donation.amount.toLocaleString()} to ${district?.name} was processed successfully`,
      data: { donationId: donation.id, transactionId: donation.transactionId },
    })
  }

  getUserDonations(userId: string): Donation[] {
    const donationIds = Array.from(this.donationsByUser.get(userId) || [])
    return donationIds
      .map((id) => this.donations.get(id)!)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Development Projects
  createProject(
    projectData: Omit<DevelopmentProject, "id" | "createdAt" | "updatedAt" | "updates">,
  ): DevelopmentProject {
    const project: DevelopmentProject = {
      ...projectData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
    }

    this.projects.set(project.id, project)
    this.projectsByDistrict.get(project.districtId)?.add(project.id)

    // Add to district projects
    const district = this.districts.get(project.districtId)
    if (district) {
      district.projects.push(project.id)
      this.districts.set(district.id, district)
    }

    return project
  }

  getProject(projectId: string): DevelopmentProject | undefined {
    return this.projects.get(projectId)
  }

  getProjectsByDistrict(districtId: string): DevelopmentProject[] {
    const projectIds = Array.from(this.projectsByDistrict.get(districtId) || [])
    return projectIds.map((id) => this.projects.get(id)!).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getAllProjects(): DevelopmentProject[] {
    return Array.from(this.projects.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  fundProject(projectId: string, amount: number): boolean {
    const project = this.projects.get(projectId)
    if (!project) return false

    project.funded += amount
    project.updatedAt = new Date()

    if (project.funded >= project.goal && project.status === "Funding") {
      project.status = "Active"
    }

    this.projects.set(projectId, project)

    this.emit({
      type: "project_funded",
      data: { projectId, amount, newTotal: project.funded, goal: project.goal },
      timestamp: new Date(),
    })

    return true
  }

  // Network Events
  createEvent(
    eventData: Omit<NetworkEvent, "id" | "createdAt" | "updatedAt" | "currentAttendees" | "attendees">,
  ): NetworkEvent {
    const event: NetworkEvent = {
      ...eventData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      currentAttendees: 0,
      attendees: [],
    }

    this.events.set(event.id, event)
    this.eventsByOrganizer.get(event.organizerId)?.add(event.id)

    this.emit({
      type: "event_created",
      data: { eventId: event.id, organizerId: event.organizerId, type: event.type },
      timestamp: new Date(),
      userId: event.organizerId,
    })

    return event
  }

  getEvent(eventId: string): NetworkEvent | undefined {
    return this.events.get(eventId)
  }

  getAllEvents(): NetworkEvent[] {
    return Array.from(this.events.values()).sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  registerForEvent(eventId: string, userId: string): boolean {
    const event = this.events.get(eventId)
    if (!event || event.attendees.includes(userId)) return false

    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return false
    }

    event.attendees.push(userId)
    event.currentAttendees++
    event.updatedAt = new Date()
    this.events.set(eventId, event)

    this.createNotification(userId, {
      type: "system",
      title: "Event Registration Confirmed",
      message: `You're registered for "${event.title}" on ${event.date.toLocaleDateString()}`,
      data: { eventId },
    })

    return true
  }

  // Connection Management
  sendConnectionRequest(fromUserId: string, toUserId: string, message?: string): ConnectionRequest {
    const request: ConnectionRequest = {
      id: generateId(),
      fromUserId,
      toUserId,
      status: "pending",
      message,
      createdAt: new Date(),
    }

    this.connectionRequests.set(request.id, request)
    this.connectionsByUser.get(fromUserId)?.add(request.id)
    this.connectionsByUser.get(toUserId)?.add(request.id)

    this.createNotification(toUserId, {
      type: "connection_request",
      title: "New Connection Request",
      message: `${this.getUser(fromUserId)?.name} wants to connect with you`,
      data: { requestId: request.id, fromUserId },
    })

    this.emit({
      type: "connection_request",
      data: { requestId: request.id, fromUserId, toUserId },
      timestamp: new Date(),
      userId: fromUserId,
    })

    return request
  }

  respondToConnectionRequest(requestId: string, accept: boolean): boolean {
    const request = this.connectionRequests.get(requestId)
    if (!request || request.status !== "pending") return false

    request.status = accept ? "accepted" : "rejected"
    request.respondedAt = new Date()
    this.connectionRequests.set(requestId, request)

    if (accept) {
      // Add connection to both users
      const fromUser = this.users.get(request.fromUserId)
      const toUser = this.users.get(request.toUserId)

      if (fromUser !== undefined && toUser !== undefined) {
        fromUser.connections?.push(request.toUserId)
        toUser.connections?.push(request.fromUserId)
        this.users.set(fromUser.id, fromUser)
        this.users.set(toUser.id, toUser)
      }
    }

    // Notify requester
    this.createNotification(request.fromUserId, {
      type: "system",
      title: `Connection Request ${accept ? "Accepted" : "Rejected"}`,
      message: `${this.getUser(request.toUserId)?.name} ${accept ? "accepted" : "rejected"} your connection request`,
      data: { requestId, accepted: accept },
    })

    return true
  }

  getUserConnections(userId: string): User[] {
    const user = this.users.get(userId)
    if (!user) return []

    const users = user.connections?.map((id) => this.users.get(id)!).filter(Boolean)
    if (!users) return []
    return users
  }

  // Payment Methods
  addPaymentMethod(methodData: Omit<PaymentMethod, "id" | "createdAt">): PaymentMethod {
    const method: PaymentMethod = {
      ...methodData,
      id: generateId(),
      createdAt: new Date(),
    }

    this.paymentMethods.set(method.id, method)
    return method
  }

  getUserPaymentMethods(userId: string): PaymentMethod[] {
    return Array.from(this.paymentMethods.values()).filter((m) => m.userId === userId)
  }

  // Transactions
  createTransaction(transactionData: Omit<Transaction, "id" | "createdAt">): Transaction {
    const transaction: Transaction = {
      ...transactionData,
      id: generateId(),
      createdAt: new Date(),
    }

    this.transactions.set(transaction.id, transaction)
    this.transactionsByUser.get(transaction.userId)?.add(transaction.id)

    return transaction
  }

  getUserTransactions(userId: string): Transaction[] {
    const transactionIds = Array.from(this.transactionsByUser.get(userId) || [])
    return transactionIds
      .map((id) => this.transactions.get(id)!)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Online Status Management (inherited from previous implementation)
  setUserOnline(userId: string, activity?: { type: ActivityType; location?: string }) {
    const status: OnlineStatus = {
      userId,
      isOnline: true,
      lastSeen: new Date(),
      currentActivity: activity,
    }

    this.onlineStatuses.set(userId, status)
    this.updateUser(userId, { isOnline: true, lastActive: new Date() })

    this.emit({
      type: "user_online",
      data: { userId, activity },
      timestamp: new Date(),
      userId,
    })
  }

  setUserOffline(userId: string) {
    const status = this.onlineStatuses.get(userId)
    if (status) {
      status.isOnline = false
      status.lastSeen = new Date()
      status.currentActivity = undefined
      this.onlineStatuses.set(userId, status)
    }

    this.updateUser(userId, { isOnline: false, lastActive: new Date() })

    this.emit({
      type: "user_offline",
      data: { userId },
      timestamp: new Date(),
      userId,
    })
  }

  getOnlineUsers(): OnlineStatus[] {
    return Array.from(this.onlineStatuses.values()).filter((status) => status.isOnline)
  }

  // Notification Management
  createNotification(
    userId: string,
    notificationData: Omit<Notification, "id" | "userId" | "isRead" | "createdAt">,
  ): Notification {
    const notification: Notification = {
      ...notificationData,
      id: generateId(),
      userId,
      isRead: false,
      createdAt: new Date(),
    }

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, [])
    }

    this.notifications.get(userId)!.push(notification)

    return notification
  }

  getNotifications(userId: string, limit = 20): Notification[] {
    const userNotifications = this.notifications.get(userId) || []
    return userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
  }

  markNotificationAsRead(userId: string, notificationId: string): boolean {
    const userNotifications = this.notifications.get(userId) || []
    const notification = userNotifications.find((n) => n.id === notificationId)

    if (notification) {
      notification.isRead = true
      return true
    }

    return false
  }

  getUnreadNotificationCount(userId: string): number {
    const userNotifications = this.notifications.get(userId) || []
    return userNotifications.filter((n) => !n.isRead).length
  }

  // Analytics
  getAppAnalytics(): AppAnalytics {
    const now = new Date()
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    return {
      totalUsers: this.users.size,
      activeUsers: Array.from(this.users.values()).filter((u) => u.lastActive > dayAgo).length,
      totalDonations: Array.from(this.donations.values()).filter((d) => d.status === "completed").length,
      totalFunded: Array.from(this.donations.values())
        .filter((d) => d.status === "completed")
        .reduce((sum, d) => sum + d.amount, 0),
      forumEngagement: this.getForumAnalytics(),
      chatActivity: this.getChatAnalytics(),
      resourceDownloads: Array.from(this.resources.values()).reduce((sum, r) => sum + r.downloads, 0),
      eventAttendance: Array.from(this.events.values()).reduce((sum, e) => sum + e.currentAttendees, 0),
    }
  }

  // Forum Analytics
  // private getForumAnalytics() {
  //   const totalPosts = this.forumPosts.size
  //   const totalReplies = this.forumReplies.size
  //   const activeUsers = this.getOnlineUsers().length
  //
  //   // Get top categories by post count
  //   const categoryStats = new Map<string, number>()
  //   for (const post of this.forumPosts.values()) {
  //     categoryStats.set(post.category, (categoryStats.get(post.category) || 0) + 1)
  //   }
  //
  //   const topCategories = Array.from(categoryStats.entries())
  //     .sort((a, b) => b[1] - a[1])
  //     .slice(0, 5)
  //     .map(([name, count]) => ({ name, count }))
  //
  //   return {
  //     totalPosts,
  //     totalReplies,
  //     activeUsers,
  //     topCategories,
  //     engagementRate: totalPosts > 0 ? (totalReplies / totalPosts) * 100 : 0,
  //     averageResponseTime: 24, // Mock value in hours
  //   }
  // }

  // Chat Analytics
  private getChatAnalytics() {
    const totalMessages = this.messages.size
    const totalConversations = this.conversations.size
    const activeConversations = Array.from(this.conversations.values()).filter((conv) => {
      const lastMessage = Array.from(this.messages.values())
        .filter((msg) => msg.conversationId === conv.id)
        .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())[0]

      if (!lastMessage) return false

      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return lastMessage.sentAt > dayAgo
    }).length

    // Mock message type distribution
    const messageTypes = {
      text: Math.floor(totalMessages * 0.8),
      image: Math.floor(totalMessages * 0.15),
      file: Math.floor(totalMessages * 0.05),
    }

    return {
      totalMessages,
      activeConversations,
      averageResponseTime: 2.5, // Mock value in hours
      messageTypes,
    }
  }

  // Forum Category Management
  getCategories(): ForumCategory[] {
    return Array.from(this.forumCategories.values())
  }

  createCategory(categoryData: Omit<ForumCategory, "id" | "postCount">): ForumCategory {
    const category: ForumCategory = {
      ...categoryData,
      id: generateId(),
      postCount: 0,
    }

    this.forumCategories.set(category.id, category)
    return category
  }

  // Forum Post Management
  createForumPost(postData: Omit<ForumPost, "id" | "createdAt" | "updatedAt" | "likes" | "replies">): ForumPost {
    const post: ForumPost = {
      ...postData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: [],
      replies: [],
    }

    this.forumPosts.set(post.id, post)

    // Update category post-count
    const category = this.forumCategories.get(post.categoryId)
    if (category) {
      category.postCount++
      this.forumCategories.set(category.id, category)
    }

    return post
  }

  getForumPostsByCategory(categoryId: string): ForumPost[] {
    return Array.from(this.forumPosts.values())
      .filter((post) => post.categoryId === categoryId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Forum Reply Management
  createForumReply(replyData: Omit<ForumReply, "id" | "createdAt" | "likes">): ForumReply {
    const reply: ForumReply = {
      ...replyData,
      id: generateId(),
      createdAt: new Date(),
      likes: [],
    }

    this.forumReplies.set(reply.id, reply)

    // Add reply to post
    const post = this.forumPosts.get(reply.postId)
    if (post) {
      post.replies.push(reply.id)
      post.updatedAt = new Date()
      this.forumPosts.set(post.id, post)
    }

    return reply
  }

  getForumReplies(postId: string): ForumReply[] {
    return Array.from(this.forumReplies.values())
      .filter((reply) => reply.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  // Conversation Management
  // createConversation(participantIds: string[]): Conversation {
  //   const conversation: Conversation = {
  //     id: generateId(),
  //     participantIds,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     lastMessageId: undefined,
  //   }
  //
  //   this.conversations.set(conversation.id, conversation)
  //   return conversation
  // }

  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId)
  }

  getUserConversations(userId: string): Conversation[] {
    return Array.from(this.conversations.values())
      .filter((conv) => conv.participants.includes(userId))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // Message Management
  createMessage(messageData: Omit<Message, "id" | "sentAt" | "isRead">): Message {
    const message: Message = {
      ...messageData,
      id: generateId(),
      sentAt: new Date(),
      isRead: false,
    }

    this.messages.set(message.id, message)

    // Update conversation
    if (message.conversationId) {
      const conversation = this.conversations.get(message.conversationId)
      if (conversation) {
        conversation.lastMessageId = message.id
        conversation.updatedAt = new Date()
        this.conversations.set(conversation.id, conversation)
      }
    }

    return message
  }

  // getMessages(conversationId: string): Message[] {
  //   return Array.from(this.messages.values())
  //     .filter((msg) => msg.conversationId === conversationId)
  //     .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime())
  // }

  getUserMessages(userId: string): Message[] {
    return Array.from(this.messages.values())
      .filter((msg) => msg.senderId === userId || (msg.recipientId && msg.recipientId === userId))
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
  }

  // Utility Methods
  private initializeUserIndexes(userId: string) {
    this.donationsByUser.set(userId, new Set())
    this.connectionsByUser.set(userId, new Set())
    this.eventsByOrganizer.set(userId, new Set())
    this.transactionsByUser.set(userId, new Set())
    this.downloadsByUser.set(userId, new Set())
    this.viewsByUser.set(userId, new Set())
  }

  private startCleanupTasks() {
    // Clean up expired sessions every hour
    setInterval(() => {
      const now = new Date()
      for (const [token, session] of this.sessions.entries()) {
        if (session.expiresAt < now) {
          this.sessions.delete(token)
        }
      }
    }, 3600000)

    // Clean up old typing indicators every minute
    setInterval(() => {
      const now = new Date()
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

      for (const [key, indicator] of this.typingIndicators.entries()) {
        if (indicator.lastActivity < fiveMinutesAgo) {
          this.typingIndicators.delete(key)
        }
      }
    }, 60000)
  }

  // Message methods
  // createMessage(senderId: string, recipientId: string, content: string): Message {
  //   const messageId = generateId()
  //   const message: Message = {
  //     id: messageId,
  //     senderId,
  //     recipientId,
  //     content,
  //     sentAt: new Date(),
  //     isRead: false,
  //   }
  //
  //   this.messages.set(messageId, message)
  //   return message
  // }

  getMessages(userId: string): Message[] {
    return Array.from(this.messages.values())
      .filter((m) => m.senderId === userId || m.recipientId === userId)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
  }

  // Forum methods
  // createForumPost(authorId: string, title: string, content: string, category: string): ForumPost {
  //   const postId = generateId()
  //   const post: ForumPost = {
  //     id: postId,
  //     authorId,
  //     title,
  //     content,
  //     category,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     likes: 0,
  //     replies: [],
  //   }
  //
  //   this.forumPosts.set(postId, post)
  //   return post
  // }

  getForumPosts(): ForumPost[] {
    return Array.from(this.forumPosts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getForumPost(id: string): ForumPost | undefined {
    return this.forumPosts.get(id)
  }

  // Resource methods
  getResources(): Resource[] {
    return Array.from(this.resources.values())
  }

  // Event methods
  getEvents(): NetworkEvent[] {
    return Array.from(this.events.values())
  }

  // Notification methods
  // createNotification(userId: string, title: string, message: string, type: string): Notification {
  //   const notificationId = generateId()
  //   const notification: Notification = {
  //     id: notificationId,
  //     userId,
  //     title,
  //     message,
  //     type: type as any,
  //     isRead: false,
  //     createdAt: new Date(),
  //   }
  //
  //   this.notifications.set(notificationId, notification)
  //   return notification
  // }

  // getNotifications(userId: string): Notification[][] {
  //   return Array.from(this.notifications.values())
  //     .filter((n) => n.userId === userId)
  //     .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  // }
}

// Create a singleton instance
export const comprehensiveDb = new ComprehensiveDatabase()
