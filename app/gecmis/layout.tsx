'use client'
import { useAuth } from '@/contexts/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	const auth = useAuth()
	const router = useRouter()
	const user = auth?.user

	useEffect(() => {
		if (user === null) {
			router.push('/login')
		}
	}, [user, router])

	// Return null or loading state while checking authentication
	if (user === null) {
		return null // Or return a loading spinner component
	}

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block w-full text-center justify-center">{children}</div>
		</section>
	)
}
