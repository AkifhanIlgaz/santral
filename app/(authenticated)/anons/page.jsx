'use client'

import { supabase } from '@/utils/actions'
import { useState } from 'react'
export default function AnonsPage() {
	const [announces, setAnnounces] = useState([])

    

	const changes = supabase
		.channel('announce-changes')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'Announces' }, payload => {
			setAnnounces(prev => [...prev, payload])
			console.log(payload)
		})
		.subscribe()
}
