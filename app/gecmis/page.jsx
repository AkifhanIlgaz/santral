'use client'

import EntityTable from '@/components/entityTable'
import { DatePicker } from '@heroui/date-picker'
import { I18nProvider } from '@react-aria/i18n'
import { useState } from 'react'

export default function GecmisPage() {
	const [date, setDate] = useState()

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<I18nProvider locale="tr-TR">
				<DatePicker label="Tarih" className="max-w-sm" labelPlacement="inside" variant="underlined" description="Lütfen bir tarih seçin." onChange={v => setDate(new Date(v.toString()))} />
			</I18nProvider>
			<EntityTable date={date} />
		</section>
	)
}
