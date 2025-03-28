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

	return (
		<section className="flex flex-col items-center justify-center mt-24 py-8 md:py-10">
			<div className="inline-block w-full  text-center items-center justify-center">{children}</div>
		</section>
	)
}
