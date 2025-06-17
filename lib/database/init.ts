import { comprehensiveDb } from "./comprehensive-db"
import { seedComprehensiveDatabase } from "./seed-comprehensive"

// Safe initialization function
export function initializeDatabase() {
  try {
    // Ensure database is ready
    if (typeof window !== "undefined") {
      // Check if already seeded
      const isSeeded = localStorage.getItem("db-seeded")

      if (!isSeeded) {
        console.log("Initializing database...")
        seedComprehensiveDatabase()
      } else {
        console.log("Database already seeded")
      }
    }
  } catch (error) {
    console.error("Database initialization error:", error)
  }
}

// Export the database instance
export { comprehensiveDb }
