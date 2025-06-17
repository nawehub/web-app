import { comprehensiveDb } from "./comprehensive-db"

export function seedComprehensiveDatabase() {
  console.log("Seeding comprehensive database...")

  // Wait a bit to ensure database is fully initialized
  setTimeout(() => {
    try {
      // Create sample users
      const sampleUsers = [
        {
          name: "Aminata Kamara",
          email: "aminata@example.com",
          password: "password123",
          userType: "entrepreneur" as const,
          district: "Bo",
          business: "AgroTech Solutions",
          businessType: "agriculture",
          phone: "+232 76 123 456",
          verified: true,
          skills: ["Agriculture", "Technology", "IoT"],
          lookingFor: ["Investors", "Tech Partners"],
        },
        {
          name: "Mohamed Sesay",
          email: "mohamed@example.com",
          password: "password123",
          userType: "supporter" as const,
          district: "Western Area Urban",
          phone: "+232 77 234 567",
          verified: true,
          skills: ["Community Development"],
          lookingFor: ["Volunteer Opportunities"],
        },
        {
          name: "Sarah Conteh",
          email: "sarah@gov.sl",
          password: "password123",
          userType: "official" as const,
          district: "Port Loko",
          phone: "+232 78 345 678",
          verified: false, // Officials need verification
          skills: ["Policy", "Development"],
          lookingFor: ["Community Partners"],
        },
      ]

      // Register sample users
      const createdUsers = sampleUsers
        .map((userData) => {
          try {
            const result = comprehensiveDb.register(userData)
            console.log(`Created user: ${result.user.name}`)
            return result.user
          } catch (error) {
            console.error(`Failed to create user ${userData.name}:`, error)
            return null
          }
        })
        .filter(Boolean)

      // Set some users online
      if (createdUsers.length > 0) {
        comprehensiveDb.setUserOnline(createdUsers[0]!.id, { type: "dashboard" })
        if (createdUsers[1]) {
          comprehensiveDb.setUserOnline(createdUsers[1].id, { type: "forum" })
        }
      }

      // Create sample resources
      const sampleResources = [
        {
          title: "Complete Business Registration Guide",
          description: "Step-by-step guide for registering your business in Sierra Leone",
          category: "legal" as const,
          type: "Guide" as const,
          downloadUrl: "/resources/business-registration.pdf",
          featured: true,
          tags: ["Registration", "Legal", "Startup"],
          authorId: "system",
          fileSize: 1024000,
          mimeType: "application/pdf" as const,
        },
        {
          title: "Marketing Budget Template",
          description: "Excel template for planning your marketing budget",
          category: "marketing" as const,
          type: "Template" as const,
          downloadUrl: "/resources/marketing-budget.docx",
          featured: false,
          tags: ["Marketing", "Budget", "Planning"],
          authorId: "system",
          fileSize: 512000,
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" as const,
        },
      ]

      sampleResources.forEach((resource) => {
        try {
          const created = comprehensiveDb.createResource(resource)
          console.log(`Created resource: ${created.title}`)
        } catch (error) {
          console.error(`Failed to create resource ${resource.title}:`, error)
        }
      })

      // Create sample donations
      if (createdUsers.length > 1) {
        try {
          const districts = comprehensiveDb.getDistricts()
          const boDistrict = districts.find((d) => d.name === "Bo")

          if (boDistrict) {
            const donation = comprehensiveDb.makeDonation({
              userId: createdUsers[1]!.id,
              districtId: boDistrict.id,
              amount: 5000,
              paymentMethod: "orange",
            })
            console.log(`Created donation: Le ${donation.amount}`)
          }
        } catch (error) {
          console.error("Failed to create sample donation:", error)
        }
      }

      // Create sample projects
      try {
        const districts = comprehensiveDb.getDistricts()
        const sampleProjects = [
          {
            title: "Rural Internet Connectivity Project",
            districtId: districts[0].id,
            category: "Technology" as const,
            description: "Bringing high-speed internet to rural communities",
            funded: 750000,
            goal: 1500000,
            status: "Funding" as const,
            startDate: new Date("2024-01-01"),
            beneficiaries: 1000,
            images: ["/placeholder.svg?height=300&width=400"],
          },
          {
            title: "Women's Skills Training Center",
            districtId: districts[1].id,
            category: "Education" as const,
            description: "Training center for women in technical and business skills",
            funded: 1200000,
            goal: 1000000,
            status: "Completed" as const,
            startDate: new Date("2023-06-01"),
            endDate: new Date("2024-10-01"),
            beneficiaries: 500,
            images: ["/placeholder.svg?height=300&width=400"],
          },
        ]

        sampleProjects.forEach((project) => {
          try {
            const created = comprehensiveDb.createProject(project)
            console.log(`Created project: ${created.title}`)
          } catch (error) {
            console.error(`Failed to create project ${project.title}:`, error)
          }
        })
      } catch (error) {
        console.error("Failed to create sample projects:", error)
      }

      // Create sample events
      if (createdUsers.length > 0) {
        try {
          const sampleEvents = [
            {
              title: "Entrepreneur Networking Meetup",
              description: "Monthly networking event for entrepreneurs in Freetown",
              type: "networking" as const,
              date: new Date("2024-12-15T18:00:00"),
              endDate: new Date("2024-12-15T21:00:00"),
              location: "Freetown Conference Center",
              isVirtual: false,
              maxAttendees: 100,
              organizerId: createdUsers[0]!.id,
              tags: ["Networking", "Entrepreneurship"],
              status: "upcoming" as const,
            },
            {
              title: "Digital Marketing Workshop",
              description: "Learn effective digital marketing strategies for local businesses",
              type: "workshop" as const,
              date: new Date("2024-12-20T14:00:00"),
              endDate: new Date("2024-12-20T17:00:00"),
              location: "Online",
              isVirtual: true,
              organizerId: createdUsers[0]!.id,
              tags: ["Marketing", "Digital", "Workshop"],
              fee: 25000,
              status: "upcoming" as const,
            },
          ]

          sampleEvents.forEach((event) => {
            try {
              const created = comprehensiveDb.createEvent(event)
              console.log(`Created event: ${created.title}`)
            } catch (error) {
              console.error(`Failed to create event ${event.title}:`, error)
            }
          })
        } catch (error) {
          console.error("Failed to create sample events:", error)
        }
      }

      console.log("Database seeding completed!")
      console.log("Sample login credentials:")
      console.log("Email: aminata@example.com, Password: password123 (Entrepreneur)")
      console.log("Email: mohamed@example.com, Password: password123 (Supporter)")
      console.log("Email: sarah@gov.sl, Password: password123 (Official)")
    } catch (error) {
      console.error("Error during database seeding:", error)
    }
  }, 100) // Small delay to ensure initialization
}

// Auto-seed in development with better error handling
if (typeof window !== "undefined" && !localStorage.getItem("db-seeded")) {
  try {
    seedComprehensiveDatabase()
    localStorage.setItem("db-seeded", "true")
  } catch (error) {
    console.error("Failed to seed database:", error)
  }
}
