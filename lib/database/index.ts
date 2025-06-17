export * from "./types"
export * from "./in-memory-db"
export * from "./hooks"
export * from "./seed-data"

// Initialize database with seed data
import { seedDatabase } from "./seed-data"

// Seed the database on import (in a real app, this would be done differently)
if (typeof window !== "undefined") {
  // Only seed in browser environment
  setTimeout(() => {
    seedDatabase()
  }, 100)
}
