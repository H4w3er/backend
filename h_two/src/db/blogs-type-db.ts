export type BlogDbType = {
    //_id: string
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    createdAt: string
    isMembership: boolean
}
export type BlogsUserViewType = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": [
    {
        "id": "string",
        "name": "string",
        "description": "string",
        "websiteUrl": "string",
        "createdAt": "2024-11-17T15:47:16.266Z",
        "isMembership": true
    }
]
}
export type BlogUserViewType = {
    "id": "string",
    "name": "string",
    "description": "string",
    "websiteUrl": "string",
    "createdAt": "2024-11-17T15:47:16.266Z",
    "isMembership": true
}
