import { approvedBy } from '@/constants/approvedBy'
import { destinations } from '@/constants/destinations'
import { groups } from '@/constants/groups'
import { labels, texts } from '@/constants/helperTexts'
import { getStudentName } from '@/constants/students'
import { createEntity } from '@/utils/actions'
import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'
import { NumberInput } from '@heroui/number-input'
import { Select, SelectItem } from '@heroui/select'
import { useEffect, useState } from 'react'

export default function EntityModal({ isOpen, onOpenChange, fetchTodaysEntities }) {
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
		createEntity(data).then(res => {
			fetchTodaysEntities()
		})
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
							<Select label={labels.group} size="sm" isRequired name="group" onChange={e => setGroup(e?.target.value)}>
								{groups.map(group => (
									<SelectItem key={group.key}>{group.label}</SelectItem>
								))}
							</Select>
							<NumberInput hideStepper label={labels.no} size="sm" name="no" isRequired onValueChange={e => setNo(e)} />
							<Input label={labels.name} labelPlacement="inside" size="sm" name="name" isReadOnly type="text" value={name} />
							<Select label={labels.to} size="sm" isRequired name="to">
								{destinations.map(t => (
									<SelectItem key={t.key}>{t.label}</SelectItem>
								))}
							</Select>
							<Select label={labels.approvedBy} size="sm" isRequired name="from">
								{approvedBy.map(f => (
									<SelectItem key={f.key}>{f.label}</SelectItem>
								))}
							</Select>
						</ModalBody>
						<ModalFooter className="flex w-full justify-center items-center">
							<Button color="danger" onPress={onClose}>
								{texts.cancel}
							</Button>
							<Button color="primary" type="submit" onPress={onClose}>
								{texts.confirm}
							</Button>
						</ModalFooter>
					</Form>
				)}
			</ModalContent>
		</Modal>
	)
}
