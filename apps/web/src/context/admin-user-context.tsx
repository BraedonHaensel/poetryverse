'use client'

import { useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'

import PageLoadingIndicator from '@/components/page-loading-indicator'
import { getUserData, isAdmin, UserData } from '@/lib/user-requests'

const AdminUserContext = createContext<UserData | null>(null)

/** React hook that gives you access to the admin user's data. */
export function useAdminUser(): UserData {
  const ctx = useContext(AdminUserContext)
  if (!ctx)
    throw new Error('useAdminUserData must be used within AdminUserProvider')
  return ctx
}

type Props = {
  children: ReactNode
}

/** Provider for the admin user context. */
export function AdminUserProvider({ children }: Props) {
  const [userData, setUserData] = useState<UserData>()
  const router = useRouter()

  // Get the user's data on mount
  const didFetch = useRef(false)
  useEffect(() => {
    // Prevent double fetch in strict mode
    if (didFetch.current) return
    didFetch.current = true

    // Check the user's role
    getUserData().then((userData) => {
      if (userData === undefined) return
      if (!isAdmin(userData.role)) {
        // Prevent non-admin users from accessing the admin pages
        toast.error('You must be an admin to view this page')
        router.push('/')
      } else {
        setUserData(userData)
      }
    })
  }, [router])

  // Display a loading indicator until the user's data has been fetched
  if (userData === undefined) return <PageLoadingIndicator />

  return (
    <AdminUserContext.Provider value={userData}>
      {children}
    </AdminUserContext.Provider>
  )
}
