'use client'
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'

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
		enter: '2025-03-05T06:20:00',
		exit: '2025-03-05T16:00:00',
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
		key: 'from',
		label: 'Kimden'
	},
	{
		key: 'to',
		label: 'Nereye'
	},
	{
		key: 'enter',
		label: 'Giriş Saati'
	},
	{
		key: 'exit',
		label: 'Çıkış Saati'
	}
]

export default function GirisPage() {
	return (
		<section className="flex flex-col h-full items-center justify-center gap-4 py-8 md:py-10">
			<Table aria-label="Example table with dynamic content">
				<TableHeader columns={columns}>{column => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
				<TableBody items={entities}>{item => <TableRow key={item.key}>{columnKey => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}</TableRow>}</TableBody>
			</Table>
		</section>
	)
}
