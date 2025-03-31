import { createClient, SignInWithPasswordCredentials } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function login(email: string, password: string) {
	try {
		const credentials: SignInWithPasswordCredentials = {
			email: email,
			password: password
		}

		const res = await supabase.auth.signInWithPassword(credentials)

		if (res.error) {
			throw new Error(res.error.message)
		}

		return res
	} catch (error) {
		console.error('Login error:', error)
		throw error // Re-throw the error to handle it in the calling code
	}
}

export async function logout() {
	try {
		const { error } = await supabase.auth.signOut()

		if (error) {
			throw new Error(error.message)
		}

		return true
	} catch (error) {
		console.error('Logout error:', error)
		throw error // Re-throw the error to handle it in the calling code
	}
}

export async function createEntity(data: any) {
	const { data: result, error } = await supabase.from('Entities').insert(data)


	if (error) {
		console.error(error.message)
		throw error
	}

	return result
}

export async function getEntities(date: string) {
	const { data, error } = await supabase.from('Entities').select('*').eq('date', date)

	if (error) {
		console.error(error.message)
		throw error
	}

	return data
}
