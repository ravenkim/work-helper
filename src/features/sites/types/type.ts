export interface Site {
    name: string
    language: string[]
    url: string
    git?: string
    metaDescription: string
    description: string
    labels: string[]
    category: string
    ownerPick: boolean
    userPick: boolean
    imageUrl?: string
}

export interface Category {
    name: string
    id: string
    children?: Category[]
}
