'use client'
import { DeleteIcon, EditIcon, PlusIcon, SearchIcon } from '@/components/icons'
import { groups } from '@/constants/groups'
import { labels, placeHolders, texts } from '@/constants/helperTexts'
import { links } from '@/constants/links'
import { getEntities, supabase } from '@/utils/actions'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useDisclosure } from '@heroui/modal'
import { Select, SelectItem } from '@heroui/select'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TimeModal from './timeModal'
import ZiyaretModal from './ziyaretModal'

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
		key: 'exit',
		label: 'Çıkış Saati'
	},
	{
		key: 'enter',
		label: 'Giriş Saati'
	},
	{
		key: 'actions',
		label: 'Sil'
	}
]

export default function ZiyaretTable({ date }) {
	const pathName = usePathname()
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const timeModal = useDisclosure()
	const [timeField, setTimeField] = useState('')
	const [selectedId, setSelectedId] = useState()
	const [filterValue, setFilterValue] = useState('')
	const [selectedGroups, setSelectedGroups] = useState(new Set(['A', 'B']))
	const [items, setItems] = useState([])

	const filteredItems = useMemo(() => {
		let filteredEntites = [...items]
		const groups = [...selectedGroups.values()]

		filteredEntites = filteredEntites
			.filter(entity => entity.name.toLowerCase().includes(filterValue.toLowerCase()))
			.filter(entity => groups.includes(entity.group))
			.sort((a, b) => {
				if (!a.exit) return -1 // Items without enter time go to the end
				if (!b.exit) return 1
				return a.exit.localeCompare(b.exit)
			})

		return filteredEntites
	}, [filterValue, items, selectedGroups])

	const onClear = useCallback(() => {
		setFilterValue('')
	}, [])

	const topContent = (
		<div className="flex justify-between items-center ">
			<Input isClearable aria-label="Search" value={filterValue} onValueChange={setFilterValue} onClear={() => onClear()} className="w-1/3 " labelPlacement="outside" placeholder={placeHolders.search} startContent={<SearchIcon />} type="text" />
			{/* <Button color="primary" size="sm" onPress={exportToPdf}>
				Export{' '}
			</Button> */}
			<div className="flex w-1/2 sm:w-1/4 items-center justify-end gap-4">
				<Select label={labels.group} variant="underlined" size="sm" name="group" selectionMode="multiple" defaultSelectedKeys={['A', 'B']} onSelectionChange={setSelectedGroups}>
					{groups.map(group => (
						<SelectItem key={group.key}>{group.label}</SelectItem>
					))}
				</Select>
				{[links.enter, links.ziyaret].includes(pathName) && (
					<Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
						{texts.add}
					</Button>
				)}
			</div>
		</div>
	)

	const updateEnter = (id, enter) => {
		supabase
			.from('Entities')
			.update({ enter: enter })
			.eq('id', id)
			.then(res => {
				if (res.error) {
					console.error('Error updating enter time:', res.error)
				} else {
					fetchTodaysEntities()
				}
			})
	}

	const onEntityDelete = id => {
		supabase
			.from('Entities')
			.delete()
			.eq('id', id)
			.then(res => {
				if (res.error) {
					console.error('Error deleting entity:', res.error)
					return
				}
				setItems(items.filter(item => item.id != id))
			})
	}

	const renderCell = useCallback((entity, columnKey) => {
		const cellValue = entity[columnKey]
		const id = entity['id']

		switch (columnKey) {
			case 'enter':
				return cellValue ? (
					<div
						className="flex w-1/2 items-center justify-between "
						onClick={() => {
							setTimeField('enter')
							setSelectedId(id)
							timeModal.onOpen()
						}}
					>
						{`${cellValue.split(':')[0]}:${cellValue.split(':')[1]}`}
						<span className="text-lg text-primary cursor-pointer active:opacity-50">
							<EditIcon />
						</span>
					</div>
				) : (
					<Button color="success" size="sm" className="w-1/2" onPress={() => updateEnter(entity.id, new Date().toLocaleTimeString('tr-TR', { hour12: false }))}>
						{texts.enter}
					</Button>
				)
			case 'exit':
				const [hours, minutes] = cellValue.split(':')

				return (
					<div
						className="flex w-1/2 items-center justify-between "
						onClick={() => {
							setTimeField('exit')
							setSelectedId(id)
							timeModal.onOpen()
						}}
					>
						{`${hours}:${minutes}`}
						<span className="text-lg text-primary  cursor-pointer active:opacity-50">
							<EditIcon />
						</span>
					</div>
				)
			case 'actions':
				return (
					<span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => onEntityDelete(entity.id)}>
						<DeleteIcon />
					</span>
				)
			default:
				return cellValue
		}
	}, [])

	const fetchTodaysEntities = useCallback(async () => {
		try {
			if (date) {
				const data = await getEntities(date.toISOString().split('T')[0])

				setItems(data)
			}
		} catch (error) {
			console.error('Error fetching entities:', error)
		}
	}, [date])

	useEffect(() => {
		fetchTodaysEntities()
	}, [fetchTodaysEntities, date])

	return (
		<>
			<TimeModal setItems={setItems} isOpen={timeModal.isOpen} onOpenChange={timeModal.onOpenChange} field={timeField} selectedId={selectedId} />
			<ZiyaretModal isOpen={isOpen} onOpenChange={onOpenChange} fetchTodaysEntities={fetchTodaysEntities} />
			<Table isStriped aria-label="Example table with dynamic content" topContent={topContent} topContentPlacement="outside">
				<TableHeader columns={columns}>{column => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
				<TableBody items={filteredItems}>{item => <TableRow key={item.key}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}</TableBody>
			</Table>
		</>
	)
}
