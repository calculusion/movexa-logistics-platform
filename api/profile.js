// Import the PostgreSQL database connection pool
const pool = require("../lib/db");

// Import the Supabase Admin client for user authentication
const supabaseAdmin = require("../lib/supabaseAdmin");

module.exports = async (req, res) => {
  // Extract the user's authentication token from the request header
  const token = req.headers.authorization?.replace("Bearer ", "");

  // Reject the request if no authentication token is provided
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // Verify the user's authenticated session
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  // Reject the request if the session is invalid or expired
  if (error || !user) {
    return res.status(401).json({
      message: "Invalid session",
    });
  }

  // Retrieve the user's role from the database
  const result = await pool.query(
    `
        SELECT role
        FROM profiles
        WHERE auth_user_id = $1
        `,
    [user.id],
  );

  // Default to the "customer" role if no role is assigned
  const role = result.rows[0]?.role || "customer";

  // Return the user's role to the client
  return res.status(200).json({
    role,
  });
};
