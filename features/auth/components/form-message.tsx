'use client'

export type Message = { success: string } | { error: string; error_description: string } | { message: string }

export function FormMessage({ message }: { message: Message }) {
const messageValue = message

  if (!messageValue) {
    return null
  }

  return (
    <>
      {'success' in messageValue && <div className="text-center text-success border border-success/50 rounded-md py-2 px-4">{messageValue.success}</div>}

      {'error' in messageValue && (
        <div className="text-center text-destructive border border-destructive/50 rounded-md py-2 px-4">
          {messageValue.error} <br />
          {messageValue.error_description}
        </div>
      )}

      {'message' in messageValue && <div className="text-center border border-foreground/50 rounded-md py-2 px-4">{messageValue.message}</div>}
    </>
  )
}
