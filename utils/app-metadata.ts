type Author = {
    name: string
    url: string
    email: string
    phone: string
    address: string
}
type AppMetadata = {
    name: string
    description: string
    url: string
    icon: string
    Authors: Author
}

export const appMetadata: AppMetadata = {
    name: "NaWeHub",
    description: "NaWeHub is a platform that",
    url: "https://nawehub.com",
    icon: "/images/wehub-sample-logo.png",
    Authors: {
        name: "eWomenSL",
        url: "https://ewomensl.com",
        email: "info@ewomensl.com",
        phone: "+23278976369",
        address: "59 Rogbaneh Road, Makeni, Sierra Leone"
    }
}