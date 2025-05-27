'use server'

import { createClient } from '@/utils/supabase/server'
import { encodedRedirect } from '@/utils/utils'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const name = formData.get('name')?.toString()
  const supabase = createClient()
  const origin = (await headers()).get('origin')

  if (!email || !password) {
    return encodedRedirect('error', '/auth/sign-up', 'Email and password are required')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name,
      },
    },
  })

  if (error) {
    console.error(error.code + ' ' + error.message)
    return encodedRedirect('error', '/auth/sign-up', error.message)
  } else {
    return redirect('/verify-email')
  }
}

export const signInAction = async (callbackUrl: string | undefined, formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return encodedRedirect('error', '/auth/sign-in', error.message)
  }

  return redirect(callbackUrl ?? '/')
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const supabase = createClient()
  const origin = (await headers()).get('origin')
  const callbackUrl = formData.get('callbackUrl')?.toString()
  const redirectTo = `${origin}/auth/callback?redirect_to=/auth/reset-password`

  if (!email) {
    return encodedRedirect('error', '/auth/forgot-password', 'Email is required')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

  if (error) {
    console.error(error.message)
    return encodedRedirect('error', '/auth/forgot-password', 'Could not reset password')
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect('success', '/auth/forgot-password', 'Check your email for a link to reset your password.')
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    encodedRedirect('error', '/auth/reset-password', 'Password and confirm password are required')
  }

  if (password !== confirmPassword) {
    encodedRedirect('error', '/auth/reset-password', 'Passwords do not match')
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error && error.code !== 'same_password') {
    console.error('error :', error)
    encodedRedirect('error', '/auth/reset-password', 'Password update failed')
  }

  if (error && error.code === 'same_password') {
    console.error('same_password')
    console.error('User should change password but not his old password')
  }

  encodedRedirect('success', '/auth/reset-password', 'Password updated')
}

export const signOutAction = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/auth/sign-in')
}
