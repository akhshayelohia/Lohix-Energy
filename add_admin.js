import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rbbynfwelmpolhnomzus.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYnluZndlbG1wb2xobm9tenVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDI4MTQsImV4cCI6MjA5NTAxODgxNH0._aRl2MRscWvArs5XTV1xPgwX23fJpDLSC3o7VxVr1KE";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function addSecondAdmin() {
  const newAdminEmail = "sayantanmukherjee2505@gmail.com";
  const newAdminPassword = "battery@lohix";

  console.log("Checking if the new user already exists by trying to log in...");
  const { data: testLogin, error: loginErr } = await supabase.auth.signInWithPassword({
    email: newAdminEmail,
    password: newAdminPassword,
  });

  let realUserId = testLogin?.user?.id;

  if (loginErr || !realUserId) {
    console.log("Login failed (or not confirmed). Trying sign up...");
    const { data: newUserData, error: signupError } = await supabase.auth.signUp({
      email: newAdminEmail,
      password: newAdminPassword,
    });

    if (signupError) {
      return console.error("Failed to sign up new user:", signupError.message);
    }

    if (newUserData.user?.identities?.length === 0) {
      return console.error(
        "This email is already registered, but login failed. It might need email confirmation or have a different password.",
      );
    }

    realUserId = newUserData.user?.id;
  }

  if (!realUserId) {
    return console.error("Could not get the real user ID.");
  }

  console.log("Real user ID found:", realUserId);

  // Now log in as the main admin to grant the role
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: "sayantanwbn2026@gmail.com",
    password: "battery@lohix",
  });

  if (authError) {
    return console.error("Failed to log in as main admin:", authError.message);
  }
  console.log("Logged in as main admin to assign role.");

  const { error: roleError } = await supabase
    .from("user_roles")
    .insert({ user_id: realUserId, role: "admin" });

  if (roleError) {
    // Check if they are already an admin
    if (roleError.code === "23505") {
      // Unique violation
      return console.log("Success! The user is ALREADY an admin.");
    }
    return console.error("Failed to assign admin role:", roleError.message);
  }

  console.log("Success! The new user is now an admin.");
}

addSecondAdmin();
