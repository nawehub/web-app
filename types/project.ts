export type ProjectStatus = 'APPROVED - IMPLEMENTATION ONGOING' | 'PENDING APPROVAL' | 'UNDER REVIEW' | 'APPROVED - IMPLEMENTATION COMPLETE' | 'REJECTED';

export type ProjectPriority = 'Low' | 'Medium' | 'High';

export type ProjectTimelineItem = {
    phase: string;
    status: 'completed' | 'pending' | 'in-progress';
    date: string;
};

export type Project = {
    id: string;
    title: string;
    description: string;
    district: string;
    category: string;
    targetAmount: number;
    raisedAmount: number;
    status: ProjectStatus;
    priority: ProjectPriority;
    comments: number;
    createdAt: string;
    deadline: string;
    createdBy: string;
    supporters: number;
    updates: number;
    objectives: string[];
    expectedOutcomes: string[];
    timeline?: ProjectTimelineItem[];
}

export const sampleProjects: Project[] = [
    {
        id: '1',
        title: 'Bo Community Market Renovation',
        description: 'Renovate and modernize the central market in Bo to improve trading conditions for local vendors and attract more customers.',
        district: 'Bo',
        category: 'Infrastructure',
        targetAmount: 1000000,
        raisedAmount: 750000,
        status: 'APPROVED - IMPLEMENTATION ONGOING',
        priority: 'High',
        comments: 18,
        createdAt: '2024-01-15',
        deadline: '2024-12-31',
        createdBy: 'Bo District Council',
        supporters: 180,
        updates: 5,
        objectives: [
            'Improve market infrastructure and facilities',
            'Enhance security and safety measures',
            'Create better trading conditions for vendors',
            'Attract more customers and boost local economy',
            'Implement modern waste management systems'
        ],
        expectedOutcomes: [
            'Increased vendor satisfaction and productivity',
            'Higher customer footfall and sales',
            'Improved hygiene and sanitation',
            'Enhanced district economic growth',
            'Better organized market operations'
        ],
        timeline: [
            {phase: 'Planning & Design', status: 'completed', date: '2024-01-15'},
            {phase: 'Community Consultation', status: 'completed', date: '2024-02-01'},
            {phase: 'Construction Phase 1', status: 'pending', date: '2024-03-01'},
            {phase: 'Construction Phase 2', status: 'pending', date: '2024-06-01'},
            {phase: 'Final Inspection', status: 'pending', date: '2024-11-01'},
            {phase: 'Project Completion', status: 'pending', date: '2024-12-31'}
        ]
    },
    {
        id: '2',
        title: 'Freetown Youth Tech Center',
        description: 'Establish a technology center to provide digital skills training for young people in Freetown, focusing on coding, digital marketing, and entrepreneurship.',
        district: 'Western Area Urban',
        category: 'Education',
        targetAmount: 1200000,
        raisedAmount: 900000,
        status: 'APPROVED - IMPLEMENTATION ONGOING',
        priority: 'High',
        comments: 24,
        createdAt: '2024-02-01',
        deadline: '2024-11-30',
        createdBy: 'Freetown City Council',
        supporters: 210,
        updates: 7,
        objectives: [
            'Improve market infrastructure and facilities',
            'Enhance security and safety measures',
            'Create better trading conditions for vendors',
            'Attract more customers and boost local economy',
            'Implement modern waste management systems'
        ],
        expectedOutcomes: [
            'Increased vendor satisfaction and productivity',
            'Higher customer footfall and sales',
            'Improved hygiene and sanitation',
            'Enhanced district economic growth',
            'Better organized market operations'
        ],
        timeline: [
            {phase: 'Planning & Design', status: 'completed', date: '2024-01-15'},
            {phase: 'Community Consultation', status: 'completed', date: '2024-02-01'},
            {phase: 'Construction Phase 1', status: 'pending', date: '2024-03-01'},
            {phase: 'Construction Phase 2', status: 'pending', date: '2024-06-01'},
            {phase: 'Final Inspection', status: 'pending', date: '2024-11-01'},
            {phase: 'Project Completion', status: 'pending', date: '2024-12-31'}
        ]
    },
    {
        id: '3',
        title: 'Kenema Agricultural Training Program',
        description: 'Develop a comprehensive agricultural training program for farmers in Kenema district, including modern farming techniques and equipment.',
        district: 'Kenema',
        category: 'Agriculture',
        targetAmount: 800000,
        raisedAmount: 600000,
        status: 'APPROVED - IMPLEMENTATION ONGOING',
        priority: 'Medium',
        comments: 12,
        createdAt: '2024-01-20',
        deadline: '2024-10-15',
        createdBy: 'Kenema District Council',
        supporters: 150,
        updates: 3,
        objectives: [
            'Improve market infrastructure and facilities',
            'Enhance security and safety measures',
            'Create better trading conditions for vendors',
            'Attract more customers and boost local economy',
            'Implement modern waste management systems'
        ],
        expectedOutcomes: [
            'Increased vendor satisfaction and productivity',
            'Higher customer footfall and sales',
            'Improved hygiene and sanitation',
            'Enhanced district economic growth',
            'Better organized market operations'
        ],
        timeline: [
            {phase: 'Planning & Design', status: 'completed', date: '2024-01-15'},
            {phase: 'Community Consultation', status: 'completed', date: '2024-02-01'},
            {phase: 'Construction Phase 1', status: 'pending', date: '2024-03-01'},
            {phase: 'Construction Phase 2', status: 'pending', date: '2024-06-01'},
            {phase: 'Final Inspection', status: 'pending', date: '2024-11-01'},
            {phase: 'Project Completion', status: 'pending', date: '2024-12-31'}
        ]
    },
    {
        id: '4',
        title: 'Makeni Women\'s Business Hub',
        description: 'Create a dedicated space for women entrepreneurs in Makeni to access business training, mentorship, and networking opportunities.',
        district: 'Bombali',
        category: 'Economic Development',
        targetAmount: 600000,
        raisedAmount: 450000,
        status: 'UNDER REVIEW',
        priority: 'Medium',
        comments: 9,
        createdAt: '2024-02-10',
        deadline: '2024-09-30',
        createdBy: 'Makeni City Council',
        supporters: 120,
        updates: 2,
        objectives: [
            'Improve market infrastructure and facilities',
            'Enhance security and safety measures',
            'Create better trading conditions for vendors',
            'Attract more customers and boost local economy',
            'Implement modern waste management systems'
        ],
        expectedOutcomes: [
            'Increased vendor satisfaction and productivity',
            'Higher customer footfall and sales',
            'Improved hygiene and sanitation',
            'Enhanced district economic growth',
            'Better organized market operations'
        ],
        timeline: [
            {phase: 'Planning & Design', status: 'completed', date: '2024-01-15'},
            {phase: 'Community Consultation', status: 'completed', date: '2024-02-01'},
            {phase: 'Construction Phase 1', status: 'pending', date: '2024-03-01'},
            {phase: 'Construction Phase 2', status: 'pending', date: '2024-06-01'},
            {phase: 'Final Inspection', status: 'pending', date: '2024-11-01'},
            {phase: 'Project Completion', status: 'pending', date: '2024-12-31'}
        ]
    },
    {
        id: '5',
        title: 'Koidu Clean Water Initiative',
        description: 'Install clean water systems and boreholes in underserved communities in Koidu to improve access to safe drinking water.',
        district: 'Kono',
        category: 'Health & Sanitation',
        targetAmount: 500000,
        raisedAmount: 350000,
        status: 'UNDER REVIEW',
        priority: 'High',
        comments: 15,
        createdAt: '2024-01-25',
        deadline: '2024-08-31',
        createdBy: 'Kono District Council',
        supporters: 95,
        updates: 1,
        objectives: [
            'Improve market infrastructure and facilities',
            'Enhance security and safety measures',
            'Create better trading conditions for vendors',
            'Attract more customers and boost local economy',
            'Implement modern waste management systems'
        ],
        expectedOutcomes: [
            'Increased vendor satisfaction and productivity',
            'Higher customer footfall and sales',
            'Improved hygiene and sanitation',
            'Enhanced district economic growth',
            'Better organized market operations'
        ],
        timeline: [
            {phase: 'Planning & Design', status: 'completed', date: '2024-01-15'},
            {phase: 'Community Consultation', status: 'completed', date: '2024-02-01'},
            {phase: 'Construction Phase 1', status: 'pending', date: '2024-03-01'},
            {phase: 'Construction Phase 2', status: 'pending', date: '2024-06-01'},
            {phase: 'Final Inspection', status: 'pending', date: '2024-11-01'},
            {phase: 'Project Completion', status: 'pending', date: '2024-12-31'}
        ]
    },
    {
        id: '6',
        title: 'Port Loko Solar Energy Project',
        description: 'Install solar panels and energy storage systems to provide reliable electricity to rural communities in Port Loko district.',
        district: 'Port Loko',
        category: 'Energy',
        targetAmount: 1500000,
        raisedAmount: 200000,
        status: 'PENDING APPROVAL',
        priority: 'Medium',
        comments: 6,
        createdAt: '2024-02-15',
        deadline: '2025-03-31',
        createdBy: 'Port Loko District Council',
        supporters: 45,
        updates: 0,
        objectives: [
            'Improve market infrastructure and facilities',
            'Enhance security and safety measures',
            'Create better trading conditions for vendors',
            'Attract more customers and boost local economy',
            'Implement modern waste management systems'
        ],
        expectedOutcomes: [
            'Increased vendor satisfaction and productivity',
            'Higher customer footfall and sales',
            'Improved hygiene and sanitation',
            'Enhanced district economic growth',
            'Better organized market operations'
        ],
        timeline: [
            {phase: 'Planning & Design', status: 'completed', date: '2024-01-15'},
            {phase: 'Community Consultation', status: 'completed', date: '2024-02-01'},
            {phase: 'Construction Phase 1', status: 'pending', date: '2024-03-01'},
            {phase: 'Construction Phase 2', status: 'pending', date: '2024-06-01'},
            {phase: 'Final Inspection', status: 'pending', date: '2024-11-01'},
            {phase: 'Project Completion', status: 'pending', date: '2024-12-31'}
        ]
    }
];

export const getSampleProject = (id: string) => {
    return sampleProjects.find(project => project.id === id);
}