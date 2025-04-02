'use client'
import { useAuth } from '@/contexts/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
	const auth = useAuth()
	const router = useRouter()
	const user = auth?.user

	useEffect(() => {
		if (user === null) {
			router.push('/login')
		}
	}, [user, router])

	if (user === null) {
		return null // Or return a loading spinner component
	}

	return (
		<section className="flex flex-col items-center justify-center  py-8 md:py-10">
			<div className="inline-block w-full  text-center items-center justify-center">{children}</div>
		</section>
	)
}
