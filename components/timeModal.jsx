import { texts } from '@/constants/helperTexts'
import { supabase } from '@/utils/actions'
import { Button } from '@heroui/button'
import { TimeInput } from '@heroui/date-input'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'
import { useState } from 'react'

export default function TimeModal({ setItems, selectedId, field, isOpen, onOpenChange }) {
	const [time, setTime] = useState()

	const updateEntity = () => {
		const updateData = {}
		updateData[field] = time.toString()

		supabase
			.from('Entities')
			.update(updateData)
			.eq('id', selectedId)
			.select()
			.then(res => {
				if (res.error) {
					console.error('Error deleting entity:', res.error)
					return
				}

				setItems(items => {
					const idx = items.findIndex(item => selectedId == item.id)
					const updatedItems = [...items]
					updatedItems[idx] = res.data[0]
					return updatedItems
				})
			})
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className="flex flex-col items-center justify-center gap-1">{texts.edit}</ModalHeader>

						<ModalBody className="flex w-full gap-4">
							<TimeInput label={generateLabel(field)} value={time} onChange={setTime} />
						</ModalBody>
						<ModalFooter className="flex w-full justify-center items-center">
							<Button color="danger" onPress={onClose}>
								{texts.cancel}
							</Button>
							<Button
								color="primary"
								type="submit"
								onPress={() => {
									updateEntity()
									onClose()
								}}
							>
								{texts.confirm}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

const generateLabel = field => {
	switch (field) {
		case 'exit':
			return 'Çıkış Saati'
		case 'enter':
			return 'Giriş Saati'
	}
}
