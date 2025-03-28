import {
  createClient,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function Login(username: string, password: string) {
  try {
    const credentials: SignInWithPasswordCredentials = {
      email: username,
      password: password,
    };

    return await supabase.auth.signInWithPassword(credentials);
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}
