const students: Record<string, string> = {
	'B-1': 'Mehmet Akifhan Ilgaz',
	'B-2': 'Ahmet Arif Akça',
	'B-3': 'Ahmet Saffet Çiçek',
	'B-4': 'İshak Çelikel',
	'A-1': 'Ahmet Rüçhan Durmuş',
	'A-2': 'Bilal Arslanoğlu',
	'A-3': 'İsmail Çiçek'
}

export function getStudentName(group: string, studentId: number): string {
	const key = `${group}-${studentId}`
	console.log(key)

	return students[key] || 'Talebe bulunamadı'
}
