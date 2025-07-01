"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { comprehensiveDb } from "@/lib/database/comprehensive-db"
import type { User, AuthSession } from "@/lib/database/types"

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: any) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const sessionToken = localStorage.getItem("session_token")
        console.log("Checking session token:", sessionToken ? "exists" : "not found")

        if (sessionToken) {
          const validatedUser = comprehensiveDb.validateSession(sessionToken)
          console.log("Session validation result:", validatedUser ? "valid" : "invalid")

          if (validatedUser) {
            setUser(validatedUser)
            setSession({
              token: sessionToken,
              userId: validatedUser.id,
              isActive: true,
              createdAt: new Date(),
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            } as AuthSession)
            console.log("User authenticated:", validatedUser.name)
          } else {
            console.log("Invalid session, removing token")
            localStorage.removeItem("session_token")
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        localStorage.removeItem("session_token")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth().then()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email)
      const result = comprehensiveDb.login(email, password)

      if (result) {
        console.log("Login successful for:", result.user.name)
        setUser(result.user)
        setSession(result.session)
        localStorage.setItem("session_token", result.session.token)
        return { success: true }
      } else {
        console.log("Login failed: Invalid credentials")
        return { success: false, error: "Invalid email or password" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  const register = async (userData: any) => {
    try {
      console.log("Attempting registration for:", userData.email)
      const result = comprehensiveDb.register(userData)
      setUser(result.user)
      setSession(result.session)
      localStorage.setItem("session_token", result.session.token)
      console.log("Registration successful for:", result.user.name)
      return { success: true }
    } catch (error: any) {
      console.error("Registration error:", error)
      return { success: false, error: error.message || "Registration failed. Please try again." }
    }
  }

  const logout = () => {
    console.log("Logging out user")
    if (session) {
      comprehensiveDb.logout(session.token)
    }
    setUser(null)
    setSession(null)
    localStorage.removeItem("session_token")
  }

  const isAuthenticated = !!user && !!session

  console.log("Auth state:", {
    user: user?.name || "none",
    isAuthenticated,
    loading,
    sessionExists: !!session,
  })

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export as default as well
export default AuthProvider
