// Mock data for Creator Studio – social, video, workflows, analytics, income

export const mockUser = {
  id: "user_001",
  name: "George",
  email: "george@creator.studio",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=George",
  memberSince: "March 2024",
};

// Connected social accounts (TikTok, Instagram)
export const mockSocialAccounts = [
  {
    id: "1",
    platform: "tiktok",
    platformLabel: "TikTok",
    username: "@georgecreates",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TikTok",
    followers: 12400,
    connected: true,
    lastSync: "2025-01-27T10:00:00Z",
  },
  {
    id: "2",
    platform: "instagram",
    platformLabel: "Instagram",
    username: "@georgecreates",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=IG",
    followers: 8300,
    connected: true,
    lastSync: "2025-01-27T09:30:00Z",
  },
];

// Posts (Draft | Scheduled | Posted | Failed)
export const mockPosts = [
  {
    id: "p1",
    platform: "tiktok",
    caption: "Day in my life as a creator 📱",
    thumbnail: "/placeholder-video.jpg",
    status: "posted",
    scheduledAt: null,
    postedAt: "2025-01-26T20:00:00Z",
    views: 12400,
    likes: 892,
    comments: 56,
    shares: 34,
  },
  {
    id: "p2",
    platform: "instagram",
    caption: "Reel: Quick tips for small biz",
    thumbnail: "/placeholder-video.jpg",
    status: "scheduled",
    scheduledAt: "2025-01-27T20:00:00Z",
    postedAt: null,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  },
  {
    id: "p3",
    platform: "tiktok",
    caption: "AI-generated clip (draft)",
    thumbnail: "/placeholder-video.jpg",
    status: "draft",
    scheduledAt: null,
    postedAt: null,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  },
];

// Workflows – "Post 1 video every day at 8PM" etc.
export const mockWorkflows = [
  {
    id: "w1",
    name: "Daily 8PM TikTok",
    platform: "tiktok",
    frequency: "daily",
    time: "20:00",
    timezone: "America/New_York",
    contentSource: "ai_generated",
    enabled: true,
    nextRun: "2025-01-27T20:00:00-05:00",
  },
  {
    id: "w2",
    name: "Weekly Reels",
    platform: "instagram",
    frequency: "weekly",
    time: "18:00",
    timezone: "America/New_York",
    contentSource: "drafts",
    enabled: true,
    nextRun: "2025-01-29T18:00:00-05:00",
  },
];

// Analytics – daily views, engagement
export const mockDailyViews = [
  { date: "21", views: 4200 },
  { date: "22", views: 5800 },
  { date: "23", views: 7100 },
  { date: "24", views: 6200 },
  { date: "25", views: 8900 },
  { date: "26", views: 12400 },
  { date: "27", views: 9800 },
];

export const mockWeeklyEngagement = [
  { day: "Mon", engagement: 4.2 },
  { day: "Tue", engagement: 3.8 },
  { day: "Wed", engagement: 5.1 },
  { day: "Thu", engagement: 4.5 },
  { day: "Fri", engagement: 6.2 },
  { day: "Sat", engagement: 7.0 },
  { day: "Sun", engagement: 5.8 },
];

export const mockAccountStats = {
  totalViews: 52300,
  totalLikes: 3420,
  totalComments: 289,
  followerGrowth: 12.4,
  engagementRate: 5.2,
};

// Income – manual entries + RPM estimate
export const mockIncomeEntries = [
  { id: "i1", source: "Brand deal", amount: 1200, date: "2025-01-20", note: "Tech brand" },
  { id: "i2", source: "Affiliate", amount: 340, date: "2025-01-18", note: "Amazon" },
  { id: "i3", source: "Sponsored post", amount: 800, date: "2025-01-15", note: "Fashion collab" },
];

export const mockRpmEstimate = {
  estimatedFromViews: 52300,
  rpm: 2.5,
  estimatedEarnings: 130.75,
};

// Sidebar navigation – Creator Studio MVP (User Dashboard)
export const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/" },
  { id: "accounts", label: "Accounts", icon: "Link", href: "/accounts" },
  { id: "create", label: "Create", icon: "Video", href: "/create" },
  { id: "workflows", label: "Workflows", icon: "Workflow", href: "/workflows" },
  { id: "analytics", label: "Analytics", icon: "BarChart3", href: "/analytics" },
  { id: "income", label: "Income", icon: "DollarSign", href: "/income" },
];

// Super Admin – platform users and admins (for /admin). Super admin sees all.
export const mockPlatformUsers = [
  { id: "u1", name: "George", email: "george@creator.studio", role: "user", joined: "2024-03-15", posts: 24, status: "active" },
  { id: "u2", name: "Alex", email: "alex@example.com", role: "user", joined: "2024-05-20", posts: 12, status: "active" },
  { id: "u3", name: "Sam", email: "sam@example.com", role: "user", joined: "2024-07-01", posts: 8, status: "active" },
  { id: "u4", name: "Jordan", email: "jordan@example.com", role: "user", joined: "2024-08-12", posts: 3, status: "inactive" },
  { id: "a1", name: "Admin", email: "admin@creator.studio", role: "admin", joined: "2024-02-01", posts: 0, status: "active" },
  { id: "sa1", name: "Super Admin", email: "superadmin@creator.studio", role: "super_admin", joined: "2024-01-01", posts: 0, status: "active" },
];

export const mockPlatformStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalPosts: 15600,
  totalWorkflows: 432,
  growthPercent: 18.2,
};
