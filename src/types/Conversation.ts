import { Image64 } from "./Image"

export type Conversation = {
    parts?: string | null, 
    role: string,
    image?: Image64 | null,
    type?: string,
}
