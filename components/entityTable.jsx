'use client'
import { PlusIcon, SearchIcon } from '@/components/icons'
import { groups } from '@/constants/groups'
import { getEntities, supabase } from '@/utils/actions'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useDisclosure } from '@heroui/modal'
import { Select, SelectItem } from '@heroui/select'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import EntityModal from './entityModal'

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

export default function EntityTable({ date }) {
	const pathName = usePathname()
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [filterValue, setFilterValue] = useState('')
	const [selectedGroups, setSelectedGroups] = useState(new Set(['A', 'B']))
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

	const topContent = (
		<div className="flex justify-between items-center ">
			<Input isClearable aria-label="Search" value={filterValue} onValueChange={setFilterValue} onClear={() => onClear()} className="w-1/3 " labelPlacement="outside" placeholder="Arama" startContent={<SearchIcon />} type="text" />
			{/* <Button color="primary" size="sm" onPress={exportToPdf}>
				Export{' '}
			</Button> */}
			<div className="flex w-1/2 sm:w-1/4 items-center justify-end gap-4">
				<Select label="Grup" variant="underlined" size="sm" name="group" selectionMode="multiple" defaultSelectedKeys={['A', 'B']} onSelectionChange={setSelectedGroups}>
					{groups.map(group => (
						<SelectItem key={group.key}>{group.label}</SelectItem>
					))}
				</Select>
				{pathName === '/giris' && (
					<Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
						Ekle
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
			<EntityModal isOpen={isOpen} onOpenChange={onOpenChange} fetchTodaysEntities={fetchTodaysEntities} />
			<Table aria-label="Example table with dynamic content" topContent={topContent} topContentPlacement="outside">
				<TableHeader columns={columns}>{column => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
				<TableBody items={filteredItems}>{item => <TableRow key={item.key}>{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}</TableBody>
			</Table>
		</>
	)
}
