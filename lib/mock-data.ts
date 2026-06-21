import type {
    RecentActivity,
    UserActivityData,
} from "@/types/funding"

export const mockRecentActivity: RecentActivity[] = [
    {
        id: "1",
        type: "application",
        description: "New application submitted for Tech Innovation Grant",
        timestamp: new Date("2024-01-15T10:30:00"),
        user: "John Doe",
    },
    {
        id: "2",
        type: "funding",
        description: "StartUp Accelerator Program funding approved",
        timestamp: new Date("2024-01-15T09:15:00"),
        user: "Jane Smith",
    },
    {
        id: "3",
        type: "registration",
        description: "New business registered: Green Energy Solutions",
        timestamp: new Date("2024-01-14T16:20:00"),
        user: "Mike Johnson",
    },
    {
        id: "4",
        type: "approval",
        description: "SME Development Grant application approved",
        timestamp: new Date("2024-01-14T16:20:00"),
        user: "Sarah Wilson",
    },
]

export const mockUserActivity: UserActivityData[] = [
    {month: "Jan", users: 1200},
    {month: "Feb", users: 1350},
    {month: "Mar", users: 1500},
    {month: "Apr", users: 1800},
    {month: "May", users: 2100},
    {month: "Jun", users: 2300},
    {month: "Jul", users: 2500},
    {month: "Aug", users: 2650},
    {month: "Sep", users: 2800},
    {month: "Oct", users: 2847},
    {month: "Nov", users: 2900},
    {month: "Dec", users: 3000},
]
