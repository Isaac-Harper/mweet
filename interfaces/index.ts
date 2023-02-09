export type Mweet = {
    id: number
    content: string
    created_at: string
    name: string
    tag: string
    picture: string
}

export type Mweeter = {
    id: number
    created_at: string
    user_id: string
    name: string
    tag: string
    following: string[]
    picture: string
}