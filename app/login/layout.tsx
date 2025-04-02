'use client'
import { links } from '@/constants/links'
import { useAuth } from '@/contexts/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
	const auth = useAuth()
	const router = useRouter()
	const user = auth?.user

	useEffect(() => {
		if (user) {
			router.push(links.login)
		}
	}, [user, router])

	return <section className="flex flex-col w-full h-full items-center justify-center gap-8 ">{children}</section>
}
