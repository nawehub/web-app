// Authentication Types
import {
  AccessLevel,
  ActivityType,
  FileFormat,
  UserRole,
  UserType,
  MimeType,
  PayMethod,
  DonationStatus,
  ProjectCategory,
  ProjectStatus,
  ConnectionRequestStatus,
  NetworkEventType,
  NetworkEventStatus,
  ConversationType, MessageType, NotificationVariant, DownloadType, NotificationType, FundingStatus, FundingType
} from "@/lib/enums/db-enums";

export interface AuthSession {
  id: string;
  token: string
  userId: string
  isActive: boolean
  createdAt: Date
  expiresAt: Date
}

// User Types
export interface User {
  id: string
  name: string
  email: string
  password: string // In production, this would be hashed
  role: UserRole
  district: string
  businessType: string
  joinedAt: Date
  isActive: boolean
  profile: {
    bio: string
    skills: string[]
    interests: string[]
    avatar: string
  }
  verified?: boolean
  avatar?: string
  business?: string
  title?: string
  lookingFor?: string[]
  experience?: string
  rating?: number
  connections?: string[]
  lastActive: Date
  isOnline: boolean
  userType: UserType
  phone?: string
}

// Resource Types
export interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: string
  fileUrl: string
  rating: number
  tags: string[]
  uploadedBy: string
  uploadedAt: Date
  fileSize: number
  mimeType: MimeType
  fileFormat: FileFormat
  pageCount?: number
  previewPages?: string[] // Array of preview image URLs
  lastDownloadedAt?: Date
  isRestricted: boolean // Whether download requires special permissions
  accessLevel: AccessLevel
  downloads: number
  views: ResourceView[]
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

// Add resource download tracking
export interface ResourceDownload {
  id: string
  resourceId: string
  userId: string
  downloadedAt: Date
  ipAddress?: string
  userAgent?: string
  downloadMethod: "direct" | "preview"
}

// Add resource view tracking
export interface ResourceView {
  id: string
  resourceId: string
  userId: string
  viewedAt: Date
  viewDuration?: number // in seconds
  viewType: "preview" | "full"
}

export interface FundingOpportunity {
  id: string
  title: string
  amount: string
  deadline: Date
  type: FundingType
  status: FundingStatus
  eligibility: string
  description: string
  applicationUrl: string
  organizationId: string
  requirements: string[]
  createdAt: Date
  updatedAt: Date
}

// Love Your District (LYD) Types
export interface District {
  id: string
  name: string
  total: number
  contributors: number
  rank: number
  change: number
  projects: string[]
}

export interface Donation {
  id: string
  userId: string
  districtId: string
  amount: number
  paymentMethod: PayMethod
  status: DonationStatus
  transactionId?: string
  createdAt: Date
  processedAt?: Date
}

export interface DevelopmentProject {
  id: string
  title: string
  districtId: string
  category: ProjectCategory
  description: string
  funded: number
  goal: number
  status: ProjectStatus
  startDate: Date
  endDate?: Date
  beneficiaries: number
  createdAt: Date
  updatedAt: Date
  images: string[]
  updates: ProjectUpdate[]
}

export interface ProjectUpdate {
  id: string
  projectId: string
  title: string
  content: string
  images: string[]
  createdAt: Date
  authorId: string
}

// Network Types
export interface ConnectionRequest {
  id: string
  fromUserId: string
  toUserId: string
  status: ConnectionRequestStatus
  message?: string
  createdAt: Date
  respondedAt?: Date
}

export interface NetworkEvent {
  id: string
  title: string
  description: string
  type: NetworkEventType
  date: Date
  endDate: Date
  location: string
  isVirtual: boolean
  maxAttendees?: number
  currentAttendees: number
  organizerId: string
  attendees: string[]
  tags: string[]
  fee?: number
  status: NetworkEventStatus
  createdAt: Date
  updatedAt: Date
}

// Forum Types (inherited from previous implementation)
export interface ForumCategory {
  id: string
  name: string
  description: string
  icon: string
  postCount: number
  color: string
}

export interface ForumPostLikes {
  userId: string
  date: Date
}

export interface ForumPostViews {
  userId: string
  date: Date
}

export interface ForumPost {
  id: string
  authorId: string
  title: string
  content: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
  likes: string[]
  views: string[]
  attachments: Attachment[]
  isEdited: boolean
  replies: string[]
  tags: string[]
  isPinned: boolean
  isLocked: boolean
  isAnonymous: boolean
  allowComments: boolean
  editedAt?: Date
  bookmarks: string[]
  replyCount: number
  lastReplyAt?: Date
  lastReplyBy?: string
}

export interface UserResourceBookmarks {
  userId: string
  resourceId: string
  bookmarkDate: Date
}

export interface ForumReply {
  id: string
  authorId: string
  content: string
  createdAt: Date
  updatedAt: Date
  postId: string
  likes: string[]
  replies: string[]
  mentions: string[]
  attachments: Attachment[]
  isEdited: boolean
  editedAt?: Date
}

// Chat Types (inherited from a previous implementation)
export interface Conversation {
  id: string
  type: ConversationType
  participants: string[]
  title?: string
  description?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  lastMessageAt?: Date
  lastMessageId?: string
  isArchived: boolean
  settings: ConversationSettings
}

export interface ConversationSettings {
  notifications: boolean
  muteUntil?: Date
  pinnedMessages: string[]
  customizations: {
    theme?: string
    wallpaper?: string
  }
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  recipientId: string
  content: string
  sentAt: Date
  isRead: boolean
  type: MessageType
  replyToId?: string
  mentions: string[]
  attachments: Attachment[]
  reactions: MessageReaction[]
  deliveredTo: string[]
  readBy: MessageRead[]
  isDeleted: boolean
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
  isEdited: boolean
  editedAt?: Date
  isPinned: boolean
  isAnonymous: boolean
}

export interface MessageReaction {
  userId: string
  emoji: string
  createdAt: Date
}

export interface MessageRead {
  userId: string
  readAt: Date
}

export interface Attachment {
  id: string
  type: "image" | "file" | "voice"
  name: string
  url: string
  size: number
  mimeType: string
  thumbnail?: string
}

// Real-time Types
export interface TypingIndicator {
  userId: string
  conversationId?: string
  postId?: string
  startedAt: Date
  lastActivity: Date
}

export interface OnlineStatus {
  userId: string
  isOnline: boolean
  lastSeen: Date
  currentActivity?: {
    type: ActivityType
    location?: string
  }
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: Date
  expiresAt?: Date
  data?: Record<string, any>
}

// Event Types
export interface DatabaseEvent {
  type:
    | "user_online"
    | "user_offline"
    | "typing_start"
    | "typing_stop"
    | "message_sent"
    | "message_read"
    | "post_created"
    | "reply_added"
    | "post_liked"
    | "reply_liked"
    | "user_mentioned"
    | "donation_made"
    | "project_funded"
    | "user_registered"
    | "connection_request"
    | "event_created"
  data: any
  timestamp: Date
  userId?: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  organizer: string
  attendees: string[]
  maxAttendees: number
  category: string
}

// Search Types
export interface SearchResult {
  type: "post" | "reply" | "user" | "message" | "resource" | "event" | "project"
  id: string
  title: string
  content: string
  relevance: number
  metadata: Record<string, any>
}

// Analytics Types
export interface AppAnalytics {
  totalUsers: number
  activeUsers: number
  totalDonations: number
  totalFunded: number
  forumEngagement: ForumAnalytics
  chatActivity: ChatAnalytics
  resourceDownloads: number
  eventAttendance: number
}

export interface ForumAnalytics {
  totalPosts: number
  totalReplies: number
  activeUsers: number
  topCategories: Array<{ categoryId: string; postCount: number }>
  engagementRate: number
  averageResponseTime: number
}

export interface ChatAnalytics {
  totalMessages: number
  activeConversations: number
  averageResponseTime: number
  messageTypes: Record<string, number>
}

// Payment Types
export interface PaymentMethod {
  id: string
  userId: string
  type: "orange_money" | "africell_money" | "bank_account"
  details: {
    phoneNumber?: string
    accountNumber?: string
    bankName?: string
  }
  isDefault: boolean
  isVerified: boolean
  createdAt: Date
}

export interface Transaction {
  id: string
  userId: string
  type: "donation" | "payment" | "refund"
  amount: number
  currency: "SLL" | "USD"
  status: "pending" | "completed" | "failed" | "cancelled"
  reference: string
  description: string
  metadata: Record<string, any>
  createdAt: Date
  completedAt?: Date
}
