import { getStudentName } from '@/types/students'
import { createEntity } from '@/utils/actions'
import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'
import { NumberInput } from '@heroui/number-input'
import { Select, SelectItem } from '@heroui/select'
import { useEffect, useState } from 'react'

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

const destinations = [
	{
		key: 'Market',
		label: 'Market'
	},
	{
		key: 'ATM',
		label: 'ATM'
	},
	{
		key: 'Terzi',
		label: 'Terzi'
	},
	{
		key: 'Hastane',
		label: 'Hastane'
	},
	{
		key: 'Sohbet',
		label: 'Sohbet'
	},
	{
		key: 'Mukabele',
		label: 'Mukabele'
	},
	{
		key: 'Teravih',
		label: 'Teravih'
	},
	{
		key: 'İftar',
		label: 'İftar'
	},
	{
		key: 'Diğer',
		label: 'Diğer'
	}
]

const approvedBy = [
	{
		key: 'Cemil Abi',
		label: 'Cemil Abi'
	},
	{
		key: 'Hidayet Abi',
		label: 'Hidayet Abi'
	},
	{
		key: 'Gökhan Abi',
		label: 'Gökhan Abi'
	},
	{
		key: 'Mustafa Abi',
		label: 'Mustafa Abi'
	},
	{
		key: 'Arif Abi',
		label: 'Arif Abi'
	},
	{
		key: 'Alperen Abi',
		label: 'Alperen Abi'
	},
	{
		key: 'Salih Abi',
		label: 'Salih Abi'
	},
	{
		key: 'Faruk Abi',
		label: 'Faruk Abi'
	},
	{
		key: 'Rüçhan Abi',
		label: 'Rüçhan Abi'
	},
	{
		key: 'Selimhan Abi',
		label: 'Selimhan Abi'
	},
	{
		key: 'Eren Abi',
		label: 'Eren Abi'
	},
	{
		key: 'Diğer',
		label: 'Diğer'
	}
]

export default function EntityModal({ isOpen, onOpenChange }) {
	const [group, setGroup] = useState('')
	const [no, setNo] = useState()
	const [name, setName] = useState('')

	const onSubmit = e => {
		if (name === 'Talebe Bulunamadı') {
			return
		}
		const now = new Date()

		e.preventDefault()
		let data = Object.fromEntries(new FormData(e.currentTarget))
		data = {
			...data,
			no: Number(no),
			name: name,
			exit: now.toLocaleTimeString('tr-TR', { hour12: false }),
			date: now
		}
		createEntity(data)
	}

	useEffect(() => {
		if (group && no) {
			const studentName = getStudentName(group, no)
			setName(studentName)
		}
	}, [group, no])

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={() => {
				setName('')
				onOpenChange()
			}}
		>
			<ModalContent>
				{onClose => (
					<Form onSubmit={onSubmit}>
						<ModalHeader className="flex flex-col gap-1">Ekle</ModalHeader>

						<ModalBody className="flex w-full gap-4">
							<Select label="Grup" size="sm" isRequired name="group" onChange={e => setGroup(e?.target.value)}>
								{groups.map(group => (
									<SelectItem key={group.key}>{group.label}</SelectItem>
								))}
							</Select>
							<NumberInput hideStepper label="No" size="sm" name="no" isRequired onChange={e => setNo(e?.target.value)} />
							<Input label="İsim" labelPlacement="inside" size="sm" name="name" isReadOnly type="text" value={name} />
							<Select label="Nereye" size="sm" isRequired name="to">
								{destinations.map(t => (
									<SelectItem key={t.key}>{t.label}</SelectItem>
								))}
							</Select>
							<Select label="Kimden İzinli" size="sm" isRequired name="from">
								{approvedBy.map(f => (
									<SelectItem key={f.key}>{f.label}</SelectItem>
								))}
							</Select>
						</ModalBody>
						<ModalFooter className="flex w-full justify-center items-center">
							<Button color="danger" onPress={onClose}>
								İptal
							</Button>
							<Button color="primary" type="submit" onPress={onClose}>
								Onayla
							</Button>
						</ModalFooter>
					</Form>
				)}
			</ModalContent>
		</Modal>
	)
}
