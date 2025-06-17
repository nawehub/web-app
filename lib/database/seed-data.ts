import { db } from "./in-memory-db"

export function seedDatabase() {
  // Create sample users
  const users = [
    {
      name: "Aminata Kamara",
      email: "aminata@agrotech.sl",
      avatar: "/placeholder.svg?height=40&width=40",
      business: "AgroTech Solutions",
      businessType: "Agriculture",
      district: "Bo",
      verified: true,
      title: "Founder & CEO",
      bio: "Passionate about using technology to help smallholder farmers in Sierra Leone",
      skills: ["Agriculture", "Technology", "IoT", "Data Analytics", "Business Development"],
      lookingFor: ["Tech Partners", "Investors", "Distribution Partners"],
      experience: "5+ years",
      rating: 4.8,
      connections: [],
    },
    {
      name: "Mohamed Sesay",
      email: "mohamed@digitalmarketing.sl",
      avatar: "/placeholder.svg?height=40&width=40",
      business: "Digital Marketing Pro",
      businessType: "Services",
      district: "Western Area Urban",
      verified: true,
      title: "Digital Marketing Specialist",
      bio: "Helping local businesses grow through digital marketing and e-commerce solutions",
      skills: ["Digital Marketing", "E-commerce", "Social Media", "SEO", "Content Creation"],
      lookingFor: ["Clients", "Collaborators", "Mentors"],
      experience: "3+ years",
      rating: 4.6,
      connections: [],
    },
    {
      name: "Fatima Bangura",
      email: "fatima@ecofashion.sl",
      avatar: "/placeholder.svg?height=40&width=40",
      business: "Eco Fashion SL",
      businessType: "Manufacturing",
      district: "Kenema",
      verified: false,
      title: "Fashion Designer",
      bio: "Creating sustainable fashion using locally sourced materials and traditional techniques",
      skills: ["Fashion Design", "Sustainability", "Manufacturing", "Export", "Branding"],
      lookingFor: ["Suppliers", "Retail Partners", "Funding"],
      experience: "2+ years",
      rating: 4.9,
      connections: [],
    },
    {
      name: "Ibrahim Turay",
      email: "ibrahim@fintech.sl",
      avatar: "/placeholder.svg?height=40&width=40",
      business: "FinTech Innovations",
      businessType: "Technology",
      district: "Bo",
      verified: true,
      title: "Software Engineer",
      bio: "Building mobile payment solutions for rural communities and small businesses",
      skills: ["FinTech", "Mobile Development", "Blockchain", "Financial Services", "API Development"],
      lookingFor: ["Co-founders", "Investors", "Regulatory Partners"],
      experience: "4+ years",
      rating: 4.7,
      connections: [],
    },
    {
      name: "Sarah Conteh",
      email: "sarah@solarenergy.sl",
      avatar: "/placeholder.svg?height=40&width=40",
      business: "Solar Energy SL",
      businessType: "Technology",
      district: "Port Loko",
      verified: false,
      title: "Renewable Energy Engineer",
      bio: "Providing affordable solar energy solutions for rural communities",
      skills: ["Renewable Energy", "Engineering", "Project Management", "Community Development"],
      lookingFor: ["Funding", "Technical Partners", "Government Partnerships"],
      experience: "3+ years",
      rating: 4.5,
      connections: [],
    },
  ]

  const createdUsers = users.map((userData) => db.createUser(userData))

  // Set some users as online
  db.setUserOnline(createdUsers[0].id, { type: "forum", location: "general" })
  db.setUserOnline(createdUsers[1].id, { type: "chat" })
  db.setUserOnline(createdUsers[3].id, { type: "forum", location: "tech" })

  // Create sample forum posts
  const categories = db.getCategories()
  const techCategory = categories.find((c) => c.name === "Technology")
  const generalCategory = categories.find((c) => c.name === "General Discussion")
  const fundingCategory = categories.find((c) => c.name === "Funding & Investment")
  const agricultureCategory = categories.find((c) => c.name === "Agriculture")

  let post1,
    post2,
    post3,
    post4,
    post5,
    reply1,
    reply2,
    reply3,
    nestedReply1,
    reply4,
    reply5,
    reply6,
    message1,
    message2,
    message3,
    message4,
    message5,
    message6,
    message7,
    message8

  if (techCategory && generalCategory && fundingCategory && agricultureCategory) {
    // Create sample posts
    post1 = db.createPost({
      title: "Looking for tech co-founder for AgriTech startup",
      content: `I'm building an IoT solution for smallholder farmers and looking for a technical co-founder with experience in hardware and mobile development.

The solution helps farmers monitor soil conditions and optimize irrigation through smart sensors and a mobile app. We've already validated the concept with 50+ farmers in the Bo district and have initial funding secured.

**What we're looking for:**
- Experience with IoT hardware development
- Mobile app development (React Native preferred)
- Understanding of agricultural challenges in Sierra Leone
- Passion for social impact

**What we offer:**
- Equity stake as co-founder
- Proven market validation
- Initial funding secured
- Strong network in agricultural sector

If you're interested or know someone who might be, please reach out! Happy to discuss more details.`,
      authorId: createdUsers[0].id,
      categoryId: techCategory.id,
      tags: ["Co-founder", "AgriTech", "IoT", "Hardware", "Mobile Development"],
      isPinned: true,
      isLocked: false,
      isAnonymous: false,
      allowComments: true,
    })

    post2 = db.createPost({
      title: "Grant writing workshop - sharing my experience",
      content: `Just completed a successful grant application for UNDP funding. Happy to share tips and templates with fellow entrepreneurs.

Key things I learned:
1) Start early - give yourself at least 2 months
2) Focus on impact metrics and measurable outcomes
3) Build relationships with program officers before applying
4) Get feedback from previous grant winners
5) Have a clear budget breakdown

I've created a template that helped me secure Le 50M in funding. Would be happy to share it with anyone interested. Also planning to host a workshop next month if there's enough interest.

What has been your experience with grant applications? Any tips to share?`,
      authorId: createdUsers[1].id,
      categoryId: fundingCategory.id,
      tags: ["Grants", "Funding", "Tips", "UNDP", "Workshop"],
      isPinned: false,
      isLocked: false,
      isAnonymous: false,
      allowComments: true,
    })

    post3 = db.createPost({
      title: "Sustainable packaging suppliers in Sierra Leone?",
      content: `Looking for local suppliers of eco-friendly packaging materials for my fashion business. Specifically need:

- Biodegradable bags (various sizes)
- Recycled cardboard boxes
- Eco-friendly labels and tags
- Sustainable shipping materials

Currently importing from Ghana but would prefer to support local suppliers and reduce shipping costs. Quality and consistency are important as we're building our brand reputation.

Budget: Le 2-5M monthly depending on supplier and quality.

Any recommendations or connections would be greatly appreciated!`,
      authorId: createdUsers[2].id,
      categoryId: generalCategory.id,
      tags: ["Suppliers", "Packaging", "Sustainability", "Fashion", "Local Business"],
      isPinned: false,
      isLocked: false,
      isAnonymous: false,
      allowComments: true,
    })

    post4 = db.createPost({
      title: "Mobile money integration challenges",
      content: `Working on integrating Orange Money and Africell Money APIs into our FinTech platform. Has anyone dealt with the regulatory requirements and technical documentation?

The process seems more complex than expected:
- Multiple approval stages with Bank of Sierra Leone
- Different API standards for each provider
- Security compliance requirements
- Testing environment limitations

Looking for:
- Developers who have integrated mobile money before
- Regulatory consultants familiar with FinTech compliance
- Technical documentation or code examples

Happy to share what I've learned so far and collaborate on solutions. This could benefit the entire tech community in SL.`,
      authorId: createdUsers[3].id,
      categoryId: techCategory.id,
      tags: ["Mobile Money", "API", "Integration", "FinTech", "Regulation"],
      isPinned: false,
      isLocked: false,
      isAnonymous: false,
      allowComments: true,
    })

    post5 = db.createPost({
      title: "Solar energy financing models for rural communities",
      content: `Exploring different financing models for solar energy projects in rural Sierra Leone. Traditional upfront payment doesn't work for most communities.

Models I'm considering:
1. Pay-as-you-go (PAYG) with mobile money
2. Community-based financing cooperatives
3. Microfinance partnerships
4. Government subsidy programs

Challenges:
- Limited credit history in rural areas
- Seasonal income patterns (agriculture-based)
- Infrastructure for payment collection
- Maintenance and support logistics

Has anyone implemented similar models? What worked and what didn't?

Also interested in partnerships with microfinance institutions or development organizations.`,
      authorId: createdUsers[4].id,
      categoryId: agricultureCategory.id,
      tags: ["Solar Energy", "Financing", "Rural Development", "PAYG", "Microfinance"],
      isPinned: false,
      isLocked: false,
      isAnonymous: false,
      allowComments: true,
    })

    // Create sample replies
    reply1 = db.createReply({
      postId: post1.id,
      authorId: createdUsers[1].id,
      content: `This sounds like an amazing project! I have 5+ years of experience in mobile development and have worked on IoT projects before. I'm particularly interested in the social impact aspect.

Would love to learn more about:
- The technical architecture you're planning
- Hardware specifications and suppliers
- Go-to-market strategy
- Timeline for MVP

I'm not available as a co-founder right now, but I'd be happy to provide technical consultation or connect you with developers in my network.`,
      mentions: [createdUsers[0].id],
      attachments: [],
    })

    reply2 = db.createReply({
      postId: post1.id,
      authorId: createdUsers[3].id,
      content: `Great initiative! I've been working on similar sensor solutions for agriculture. While I'm not available as a co-founder, I'd be happy to provide technical consultation or connect you with hardware suppliers in the region.

I have contacts at:
- Local electronics importers
- Hardware manufacturers in Ghana/Nigeria
- IoT platform providers

Also, have you considered the power requirements for rural deployment? Solar charging might be essential.`,
      mentions: [createdUsers[0].id],
      attachments: [],
    })

    reply3 = db.createReply({
      postId: post1.id,
      authorId: createdUsers[2].id,
      content: `This is exactly what our agricultural sector needs! I work with farmer cooperatives and would be interested in helping with market penetration and farmer onboarding once you have the technical team in place.

My cooperatives could serve as pilot sites for testing and validation.`,
      mentions: [],
      attachments: [],
    })

    // Create nested reply
    nestedReply1 = db.createReply({
      postId: post1.id,
      parentReplyId: reply2.id,
      authorId: createdUsers[0].id,
      content: `@Ibrahim That would be incredibly helpful! I'll send you a message with more details about our hardware requirements. Solar charging is definitely part of our design - great point!`,
      mentions: [createdUsers[3].id],
      attachments: [],
    })

    reply4 = db.createReply({
      postId: post2.id,
      authorId: createdUsers[0].id,
      content: `Congratulations on securing the funding! Would love to attend the workshop. Grant writing has been a major challenge for us.

Specific questions:
- How do you quantify social impact for tech solutions?
- What's the typical timeline from application to approval?
- Any specific formats or templates that work best?

Count me in for the workshop!`,
      mentions: [createdUsers[1].id],
      attachments: [],
    })

    reply5 = db.createReply({
      postId: post3.id,
      authorId: createdUsers[4].id,
      content: `I might be able to help! I work with several local suppliers for my solar projects. There's a company in Freetown that produces recycled cardboard - let me get their contact info.

Also, have you considered partnering with local artisans for custom packaging? Could be a great way to support traditional crafts while meeting your sustainability goals.`,
      mentions: [],
      attachments: [],
    })

    reply6 = db.createReply({
      postId: post4.id,
      authorId: createdUsers[1].id,
      content: `I went through this process last year for a client's e-commerce platform. You're right - it's more complex than expected!

Key tips:
1. Start with Orange Money - their API is more developer-friendly
2. Get a regulatory consultant early - saved me months
3. The sandbox environment has limitations, plan for that
4. Bank of Sierra Leone approval can take 3-6 months

I have some documentation I can share. Also know a good regulatory consultant if you need a referral.`,
      mentions: [createdUsers[3].id],
      attachments: [],
    })

    // Like some posts and replies
    db.likePost(post1.id, createdUsers[1].id)
    db.likePost(post1.id, createdUsers[2].id)
    db.likePost(post1.id, createdUsers[3].id)
    db.likePost(post2.id, createdUsers[0].id)
    db.likePost(post2.id, createdUsers[3].id)
    db.likePost(post3.id, createdUsers[4].id)

    db.likeReply(reply1.id, createdUsers[0].id)
    db.likeReply(reply1.id, createdUsers[2].id)
    db.likeReply(reply2.id, createdUsers[0].id)
    db.likeReply(reply4.id, createdUsers[1].id)

    // View posts
    createdUsers.forEach((user) => {
      db.viewPost(post1.id, user.id)
      db.viewPost(post2.id, user.id)
      db.viewPost(post3.id, user.id)
    })

    // Bookmark some posts
    db.bookmarkPost(post1.id, createdUsers[1].id)
    db.bookmarkPost(post2.id, createdUsers[0].id)
    db.bookmarkPost(post4.id, createdUsers[1].id)
  }

  // Create sample conversations and messages
  const conversation1 = db.createConversation({
    type: "direct",
    participants: [createdUsers[0].id, createdUsers[1].id],
    title: undefined,
    description: undefined,
  })

  const conversation2 = db.createConversation({
    type: "direct",
    participants: [createdUsers[0].id, createdUsers[3].id],
    title: undefined,
    description: undefined,
  })

  const conversation3 = db.createConversation({
    type: "group",
    participants: [createdUsers[1].id, createdUsers[2].id, createdUsers[4].id],
    title: "Marketing Collaboration",
    description: "Discussing joint marketing initiatives",
  })

  // Create sample messages
  message1 = db.sendMessage({
    conversationId: conversation1.id,
    senderId: createdUsers[0].id,
    content: `Hi Mohamed! I saw your post about digital marketing services. I'm interested in discussing a potential partnership for our AgriTech solution.`,
    type: "text",
    mentions: [],
    attachments: [],
  })

  message2 = db.sendMessage({
    conversationId: conversation1.id,
    senderId: createdUsers[1].id,
    content: `Hello Aminata! Great to hear from you. I'd love to learn more about your AgriTech solution and how we might work together. When would be a good time for a call?`,
    type: "text",
    mentions: [],
    attachments: [],
  })

  message3 = db.sendMessage({
    conversationId: conversation1.id,
    senderId: createdUsers[0].id,
    content: `Perfect! I'm free tomorrow afternoon or Thursday morning. We're looking to expand our farmer outreach and your digital marketing expertise could be really valuable.`,
    type: "text",
    mentions: [],
    attachments: [],
  })

  message4 = db.sendMessage({
    conversationId: conversation2.id,
    senderId: createdUsers[0].id,
    content: `Ibrahim, thanks for offering to help with hardware suppliers! Could you share those contacts when you have a chance?`,
    type: "text",
    mentions: [],
    attachments: [],
  })

  message5 = db.sendMessage({
    conversationId: conversation2.id,
    senderId: createdUsers[3].id,
    content: `I'll send you a list with contact details and my recommendations. Also, I know someone at Bank of Sierra Leone who might be able to help with regulatory questions.`,
    type: "text",
    mentions: [],
    attachments: [],
  })

  message6 = db.sendMessage({
    conversationId: conversation3.id,
    senderId: createdUsers[1].id,
    content: `Hey everyone! I've been thinking about our discussion on collaborative marketing. What if we create a joint campaign highlighting sustainable businesses in Sierra Leone?`,
    type: "text",
    mentions: [],
    attachments: [],
  })

  message7 = db.sendMessage({
    conversationId: conversation3.id,
    senderId: createdUsers[2].id,
    content: `I love that idea! Eco Fashion SL would definitely be interested. We could showcase how local businesses are contributing to sustainability goals.`,
    type: "text",
    mentions: [],
    attachments: [],
  })

  message8 = db.sendMessage({
    conversationId: conversation3.id,
    senderId: createdUsers[4].id,
    content: `Count Solar Energy SL in! This could be a great way to raise awareness about renewable energy adoption. Should we set up a video call to discuss details?`,
    type: "text",
    mentions: [],
    attachments: [],
  })

  // Mark some messages as read
  db.markMessageAsRead(message1.id, createdUsers[1].id)
  db.markMessageAsRead(message2.id, createdUsers[0].id)
  db.markMessageAsRead(message3.id, createdUsers[1].id)
  db.markMessageAsRead(message4.id, createdUsers[3].id)
  db.markMessageAsRead(message5.id, createdUsers[0].id)

  // Add some message reactions
  db.addMessageReaction(message6.id, createdUsers[2].id, "👍")
  db.addMessageReaction(message6.id, createdUsers[4].id, "💡")
  db.addMessageReaction(message7.id, createdUsers[1].id, "🎉")
  db.addMessageReaction(message8.id, createdUsers[1].id, "📞")

  // Create some notifications
  db.createNotification(createdUsers[0].id, {
    type: "forum_reply",
    title: "New reply to your post",
    message: 'Mohamed Sesay replied to "Looking for tech co-founder for AgriTech startup"',
    data: { postId: post1.id, replyId: reply1.id },
  })

  db.createNotification(createdUsers[1].id, {
    type: "message",
    title: "New message from Aminata Kamara",
    message: "Hi Mohamed! I saw your post about digital marketing services...",
    data: { conversationId: conversation1.id, messageId: message1.id },
  })

  db.createNotification(createdUsers[0].id, {
    type: "forum_mention",
    title: "You were mentioned in a discussion",
    message: "Ibrahim Turay mentioned you in a reply",
    data: { postId: post1.id, replyId: nestedReply1.id },
  })

  console.log("Database seeded successfully!")
  console.log(`Created ${createdUsers.length} users`)
  console.log(`Created ${categories.length} categories`)
  console.log("Created sample posts, replies, conversations, and messages")
}
