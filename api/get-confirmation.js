// Import the PostgreSQL database connection pool
const pool = require("../lib/db");

// Import the Supabase Admin client for user authentication
const supabaseAdmin = require("../lib/supabaseAdmin");

module.exports = async (req, res) => {
  // Extract the user's authentication token from the request header
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    // Reject the request if no authentication token is provided
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // Verify the user's authenticated session
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  // Reject the request if the session is invalid or expired
  if (authError || !user) {
    return res.status(401).json({
      message: "Invalid session",
    });
  }

  // Get the consignment ID from the query parameters
  const consignmentId = req.query.consignment;

  // Verify that the requested shipment belongs to the authenticated user
  const result = await pool.query(
    `
        SELECT consignment_id
        FROM shipments
        WHERE consignment_id = $1
        AND user_id = $2
        `,
    [consignmentId, user.id],
  );

  // Return a 404 response if the shipment does not exist or belongs to another user
  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Shipment not found",
    });
  }

  // Return the matching consignment ID
  return res.status(200).json(result.rows[0]);
};
