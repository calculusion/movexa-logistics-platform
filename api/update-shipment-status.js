// Import the PostgreSQL database connection pool
const pool = require("../lib/db");

// Import the Supabase Admin client for user authentication
const supabaseAdmin = require("../lib/supabaseAdmin");

module.exports = async (req, res) => {
  // Only allow POST requests for updating shipment status
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

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

  // Ensure only users with the "operator" role can update shipment statuses
  const roleResult = await pool.query(
    `
    SELECT role
    FROM profiles
    WHERE auth_user_id = $1
    `,
    [user.id],
  );

  // Deny access if the authenticated user is not an operator
  if (roleResult.rows[0]?.role !== "operator") {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  // Extract the shipment ID and new status from the request body
  const { shipmentId, status } = req.body;

  // Update the shipment's current status
  await pool.query(
    `
    UPDATE shipments
    SET current_status = $1
    WHERE shipment_id = $2
    `,
    [status, shipmentId],
  );

  // Record the status change in the shipment history
  await pool.query(
    `
    INSERT INTO shipment_status_history (
      shipment_id,
      status,
      remarks
    )
    VALUES ($1, $2, $3)
    `,
    [shipmentId, status, "Status updated by operator"],
  );

  // Return a success response after updating the shipment
  return res.status(200).json({
    success: true,
  });
};
