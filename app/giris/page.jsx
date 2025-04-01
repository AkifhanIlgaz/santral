'use client'
import EntityModal from '@/components/entityModal'
import { PlusIcon, SearchIcon } from '@/components/icons'
import MontserratFont from '@/components/montserrat'
import { getEntities, supabase } from '@/utils/actions'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useDisclosure } from '@heroui/modal'
import { Select, SelectItem } from '@heroui/select'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
	const isFirstRender = useRef(true)
	const [filterValue, setFilterValue] = useState('')
	const [selectedGroups, setSelectedGroups] = useState(new Set(["A", "B"]))
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [items, setItems] = useState([])

	const filteredItems = useMemo(() => {
		let filteredEntites = [...items]
		const groups = [...selectedGroups.values()]

		filteredEntites = filteredEntites.filter(entity => entity.name.toLowerCase().includes(filterValue.toLowerCase())).filter(entity => groups.includes(entity.group))

		return filteredEntites
	}, [filterValue, items, selectedGroups])

	const onClear = useCallback(() => {
		setFilterValue('')
	}, [])

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

	const topContent = (
		<div className="flex justify-between items-end">
			<Input isClearable aria-label="Search" value={filterValue} onValueChange={setFilterValue} onClear={() => onClear()} className="w-1/3 " labelPlacement="outside" placeholder="Arama" startContent={<SearchIcon />} type="text" />
			{/* <Button color="primary" size="sm" onPress={exportToPdf}>
				Export{' '}
			</Button> */}
			<div className="flex w-1/6 items-center justify-end gap-4">
				<Select label="Grup" size="sm" name="group" selectionMode="multiple" defaultSelectedKeys={['A', 'B']} onSelectionChange={setSelectedGroups}>
					{groups.map(group => (
						<SelectItem key={group.key}>{group.label}</SelectItem>
					))}
				</Select>
				<Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
					Ekle
				</Button>
			</div>
		</div>
	)

	const updateEnter = (id, enter) => {
		supabase
			.from('Entities')
			.update({ enter: enter })
			.eq('id', id)
			.then(res => {
				console.log('Update response:', res)
				if (res.error) {
					console.error('Error updating enter time:', res.error)
				} else {
					fetchTodaysEntities()
				}
			})
	}

	const renderCell = useCallback((entity, columnKey) => {
		const cellValue = entity[columnKey]

		switch (columnKey) {
			case 'enter':
				return cellValue ? (
					`${cellValue.split(':')[0]}:${cellValue.split(':')[1]}`
				) : (
					<Button color="success" size="sm" className="w-1/2" onPress={() => updateEnter(entity.id, new Date().toLocaleTimeString('tr-TR', { hour12: false }))}>
						Giriş
					</Button>
				)
			case 'exit':
				const [hours, minutes] = cellValue.split(':')
				return `${hours}:${minutes}`
			default:
				return cellValue
		}
	}, [])

	const fetchTodaysEntities = useCallback(async () => {
		try {
			const today = new Date().toISOString().split('T')[0]
			const data = await getEntities(today)
			console.log(data)

			setItems(data)
		} catch (error) {
			console.error('Error fetching entities:', error)
		}
	}, [])

	const date = new Date()

	const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' }
	const optionsDay = { weekday: 'long' }

	const formattedDate = date.toLocaleDateString('tr-TR', optionsDate) // "29 Mart 2025"
	const formattedDay = date.toLocaleDateString('tr-TR', optionsDay) // "Cumartesi"

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
			fetchTodaysEntities()
		}
	}, [fetchTodaysEntities])

	return (
		<section className="flex flex-col h-full items-center justify-center gap-4 py-8 md:py-10">
			<EntityModal isOpen={isOpen} onOpenChange={onOpenChange} fetchTodaysEntities={fetchTodaysEntities} />
			<span className="text-lg font-semibold text-gray-600">{formattedDate}</span>
			<span className="text-2xl font-bold text-gray-900">{formattedDay}</span>
			<Table aria-label="Example table with dynamic content" topContent={topContent} topContentPlacement="outside">
				<TableHeader columns={columns}>{column => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
				<TableBody items={filteredItems}>{item => <TableRow key={item.key}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}</TableBody>
			</Table>
		</section>
	)
}
