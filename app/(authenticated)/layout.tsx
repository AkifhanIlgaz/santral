import AuthenticatedLayout from '@/components/authenticatedLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
	return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
