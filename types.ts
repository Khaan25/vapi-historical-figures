export type Message = { success: string } | { error: string; error_description: string } | { message: string }
export type MessageParams = Message & { callbackUrl?: string }
