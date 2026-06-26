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
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  // Reject the request if the session is invalid or expired
  if (authError || !user) {
    return res.status(401).json({
      message: "Invalid session",
    });
  }

  try {
    // Retrieve shipment statistics for the authenticated user
    const stats = await pool.query(
      `
            SELECT
                COUNT(*) AS total_shipments,
        
                COUNT(*) FILTER (
                    WHERE current_status = 'Delivered'
                ) AS delivered,
        
                COUNT(*) FILTER (
                    WHERE current_status = 'On Route'
                ) AS on_route,
        
                COUNT(*) FILTER (
                    WHERE current_status = 'Pending'
                ) AS pending
        
            FROM shipments
        
            WHERE user_id = $1
            `,
      [user.id],
    );

    // Return the shipment statistics to the client
    return res.status(200).json({
      totalShipments: Number(stats.rows[0].total_shipments),

      delivered: Number(stats.rows[0].delivered),

      onRoute: Number(stats.rows[0].on_route),

      pending: Number(stats.rows[0].pending),
    });
  } catch (error) {
    // Log the server error and return an internal server error response
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
