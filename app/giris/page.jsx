'use client'
import EntityTable from '@/components/entityTable'
import MontserratFont from '@/components/montserrat'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const columns = [
	{
		key: 'group',
		label: 'Grup'
	},
	{
		key: 'no',
		label: 'No'
	},
	{
		key: 'name',
		label: 'İsim'
	},
	{
		key: 'to',
		label: 'Nereye'
	},
	{
		key: 'from',
		label: 'Kimden'
	},
	{
		key: 'exit',
		label: 'Çıkış Saati'
	},
	{
		key: 'enter',
		label: 'Giriş Saati'
	}
]

const groups = [
	{
		key: 'A',
		label: 'A'
	},
	{
		key: 'B',
		label: 'B'
	}
]

export default function GirisPage() {
	const exportToPdf = () => {
		const doc = new jsPDF({ orientation: 'landscape' })

		doc.addFileToVFS('/Montserrat-VariableFont_wght.ttf', MontserratFont)
		doc.addFont('/Montserrat-VariableFont_wght.ttf', 'Montserrat', 'normal')
		doc.setFont('Montserrat')

		const columns = Object.keys(items[0])
		const rows = items.map(item => columns.map(col => item[col]))

		doc.text('Çıkış & Giriş Listesi', 14, 10)
		const tableStartY = 20

		autoTable(doc, {
			head: [columns],
			body: rows,
			startY: tableStartY,
			styles: { fontSize: 12, cellPadding: 6, overflow: 'linebreak' },
			headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
			alternateRowStyles: { fillColor: [250, 250, 250] },
			margin: { left: 10, right: 10 }
		})

		// Get table height

		// Draw rounded rectangle around the table
		doc.setDrawColor(200) // Light gray border
		doc.setLineWidth(1)

		// Save the PDF
		doc.save('exported-data.pdf')
	}

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
