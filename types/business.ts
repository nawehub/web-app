import {BriefcaseBusiness, User} from "lucide-react";

export type BusinessFormData = {
    businessName: string
    businessAddress: string
    category: string
    ownerName: string
    ownerAddress: string
    placeOfBirth: string
    contactNumber: string
    gender: string
    dateOfBirth: string
    nationality: string
    mothersName: string
    email: string
    registerDate?: Date
    isAlreadyRegistered: boolean
    isPublicRegister: boolean
}

export const initData: BusinessFormData = {
    businessName: '',
    businessAddress: '',
    category: '',
    ownerName: '',
    ownerAddress: '',
    placeOfBirth: '',
    contactNumber: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    mothersName: '',
    email: '',
    registerDate: undefined,
    isAlreadyRegistered: false,
    isPublicRegister: false,
}

export function getDate15YearsAgo() {
    const currentDate = new Date(); // Get the current date and time
    const currentYear = currentDate.getFullYear(); // Get the current year

    // Set the year to 15 years ago
    currentDate.setFullYear(currentYear - 15);

    return currentDate; // Return the modified Date object
}

export const steps = [
    {id: 1, title: 'Business Information', description: 'Enter your business details', icon: BriefcaseBusiness},
    {id: 2, title: 'Owner Information', description: 'Enter business owner information', icon: User}
]