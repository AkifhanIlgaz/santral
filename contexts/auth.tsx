import { supabase } from '@/utils/actions'
import { User } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect } from 'react'

const AuthContext = createContext<{ user: User | null } | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<User | null>(null)

	useEffect(() => {
		const checkUser = async () => {
			const {
				data: { session }
			} = await supabase.auth.getSession()
			setUser(session?.user || null)
		}

		checkUser()

		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user || null)
		})

		return () => {
			authListener.subscription.unsubscribe()
		}
	}, [])

	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
