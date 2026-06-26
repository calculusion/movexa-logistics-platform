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
    // Retrieve all shipments created by the authenticated user,
    // along with sender, receiver, item, service, route, and status details
    const result = await pool.query(
      `
            SELECT
                s.consignment_id,
                sender.full_name AS sender_name,
                receiver.full_name AS receiver_name,
                i.item_name,
                sv.service_name,
                s.created_at,
                sender_city.city_name AS departure,
                receiver_city.city_name AS destination,
                s.weight,
                s.current_status

            FROM shipments s

            JOIN item_types i
                ON s.item_type_id = i.item_type_id

            JOIN services sv
                ON s.service_id = sv.service_id

            JOIN customers sender
                ON s.sender_id = sender.customer_id

            JOIN cities sender_city
                ON sender.city_id = sender_city.city_id

            JOIN customers receiver
                ON s.receiver_id = receiver.customer_id

            JOIN cities receiver_city
                ON receiver.city_id = receiver_city.city_id

            WHERE s.user_id = $1

            ORDER BY s.created_at DESC
            `,
      [user.id],
    );

    // Return the shipment list to the client
    return res.status(200).json(result.rows);
  } catch (error) {
    // Log the server error and return an internal server error response
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
