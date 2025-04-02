'use client'

import EntityTable from '@/components/entityTable'
import { descriptions, labels } from '@/constants/helperTexts'
import { DatePicker } from '@heroui/date-picker'
import { I18nProvider } from '@react-aria/i18n'
import { useState } from 'react'

export default function GecmisPage() {
	const [date, setDate] = useState()

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<I18nProvider locale="tr-TR">
				<DatePicker label={labels.date} className="max-w-sm" labelPlacement="inside" variant="underlined" description={descriptions.date} onChange={v => setDate(new Date(v.toString()))} />
			</I18nProvider>
			<EntityTable date={date} />
		</section>
	)
}
