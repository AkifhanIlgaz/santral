'use client'
import EntityModal from '@/components/entityModal'
import { PlusIcon, SearchIcon } from '@/components/icons'
import { getEntities } from '@/utils/actions'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useDisclosure } from '@heroui/modal'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { useCallback, useEffect, useMemo, useState } from 'react'

const entities = [
	{
		id: '1',
		group: 'A',
		no: 101,
		name: 'John Doe',
		from: 'New York',
		to: 'Los Angeles',
		enter: '2025-03-01T08:30:00',
		exit: '2025-03-01T18:45:00',
		date: '2025-03-01"'
	},
	{
		id: '2',
		group: 'B',
		no: 102,
		name: 'Jane Smith',
		from: 'Chicago',
		to: 'San Francisco',
		enter: '2025-03-02T09:15:00',
		exit: '2025-03-02T19:20:00',
		date: '2025-03-02'
	},
	{
		id: '3',
		group: 'A',
		no: 103,
		name: 'Michael Johnson',
		from: 'Houston',
		to: 'Seattle',
		enter: '2025-03-03T07:45:00',
		exit: '2025-03-03T17:30:00',
		date: '2025-03-03'
	},
	{
		id: '4',
		group: 'C',
		no: 104,
		name: 'Emily Davis',
		from: 'Miami',
		to: 'Denver',
		enter: '2025-03-04T10:00:00',
		exit: '2025-03-04T20:10:00',
		date: '2025-03-04'
	},
	{
		id: '5',
		group: 'B',
		no: 105,
		name: 'William Brown',
		from: 'Boston',
		to: 'Las Vegas',
		enter: null,
		exit: '2025-03-05T06:20:00',
		date: '2025-03-05'
	}
]

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

export default function GirisPage() {
	const [filterValue, setFilterValue] = useState('')
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [items, setItems] = useState([])

	const filteredItems = useMemo(() => {
		let filteredEntites = [...items]

		filteredEntites = filteredEntites.filter(entity => entity.name.toLowerCase().includes(filterValue.toLowerCase()))

		return filteredEntites
	}, [filterValue, items])

	const onClear = useCallback(() => {
		setFilterValue('')
	}, [])

	const topContent = (
		<div className="flex justify-between items-end">
			<Input isClearable aria-label="Search" value={filterValue} onValueChange={setFilterValue} onClear={() => onClear()} className="w-1/3 " labelPlacement="outside" placeholder="Arama" startContent={<SearchIcon />} type="text" />
			<Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
				Ekle
			</Button>
		</div>
	)

	const renderCell = useCallback((user, columnKey) => {
		const cellValue = user[columnKey]

		switch (columnKey) {
			case 'enter':
				return cellValue ? (
					`${cellValue.split(':')[0]}:${cellValue.split(':')[1]}`
				) : (
					<Button color="success" size="sm" className="w-1/2">
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

	const date = new Date()

	const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' }
	const optionsDay = { weekday: 'long' }

	const formattedDate = date.toLocaleDateString('tr-TR', optionsDate) // "29 Mart 2025"
	const formattedDay = date.toLocaleDateString('tr-TR', optionsDay) // "Cumartesi"

	useEffect(() => {
		async function fetchData() {
			const data = await getEntities(new Date().toISOString().split('T')[0])
			setItems(data)
		}

		fetchData()
	}, [])

	return (
		<section className="flex flex-col h-full items-center justify-center gap-4 py-8 md:py-10">
			<EntityModal isOpen={isOpen} onOpenChange={onOpenChange} />
			<span className="text-lg font-semibold text-gray-600">{formattedDate}</span>
			<span className="text-2xl font-bold text-gray-900">{formattedDay}</span>
			<Table aria-label="Example table with dynamic content" topContent={topContent} topContentPlacement="outside">
				<TableHeader columns={columns}>{column => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
				<TableBody items={filteredItems}>{item => <TableRow key={item.key}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}</TableBody>
			</Table>
		</section>
	)
}
