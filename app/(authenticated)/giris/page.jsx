'use client'
import EntityTable from '@/components/entityTable'

export default function GirisPage() {
	const date = new Date()

	const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' }
	const optionsDay = { weekday: 'long' }

	const formattedDate = date.toLocaleDateString('tr-TR', optionsDate) // "29 Mart 2025"
	const formattedDay = date.toLocaleDateString('tr-TR', optionsDay) // "Cumartesi"

	return (
		<section className="flex flex-col h-full items-center justify-center gap-12 py-8 md:py-10">
			<div className="flex flex-col">
				<span className="text-lg font-semibold text-gray-600 dark:text-gray-400">{formattedDate}</span>
				<span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formattedDay}</span>
			</div>
			<EntityTable date={new Date()} />
		</section>
	)
}
