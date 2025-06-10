import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface UseUserIdReturn {
  userId: string | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useUserId = (): UseUserIdReturn => {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchUser = async () => {
    try {
      setError(null)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      setUserId(user?.id || null)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch user'))
      setUserId(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return {
    userId,
    isLoading,
    error,
    refetch: fetchUser,
  }
}
