export type Message = { success: string } | { error: string; error_description: string } | { message: string }

export function FormMessage({ message }: { message: Message }) {
  return (
    <>
      {'success' in message && <div className="text-center text-success border border-success/50 rounded-md py-2 px-4">{message.success}</div>}

      {'error' in message && (
        <div className="text-center text-destructive border border-destructive/50 rounded-md py-2 px-4">
          {message.error} <br />
          {message.error_description}
        </div>
      )}

      {'message' in message && <div className="text-center border border-foreground/50 rounded-md py-2 px-4">{message.message}</div>}
    </>
  )
}
