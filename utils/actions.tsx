import {
  createClient,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function login(email: string, password: string) {
  try {
    const credentials: SignInWithPasswordCredentials = {
      email: email,
      password: password,
    };

    const res = await supabase.auth.signInWithPassword(credentials);

    if (res.error) {
      throw new Error(res.error.message);
    }

    return res;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}
