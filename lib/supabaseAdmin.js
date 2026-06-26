// Import the Supabase client library
const { createClient } = require("@supabase/supabase-js");

// Create a Supabase Admin client using the service role key
// for secure server-side operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Export the configured Supabase Admin client
module.exports = supabaseAdmin;
