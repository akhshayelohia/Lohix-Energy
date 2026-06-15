import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rbbynfwelmpolhnomzus.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYnluZndlbG1wb2xobm9tenVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDI4MTQsImV4cCI6MjA5NTAxODgxNH0._aRl2MRscWvArs5XTV1xPgwX23fJpDLSC3o7VxVr1KE";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function signUp() {
  console.log("Signing up...");
  const { data, error } = await supabase.auth.signUp({
    email: "sayantanwbn2026@gmail.com",
    password: "Admin@2025Lohix",
  });

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Success! User created:", data.user?.id);
    if (data.user?.identities?.length === 0) {
      console.log("Note: This email might already be registered.");
    }
  }
}

signUp();
