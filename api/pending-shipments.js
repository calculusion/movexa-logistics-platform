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

  // Ensure only users with the "operator" role can access this endpoint
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

  // Retrieve all active (non-delivered) shipments with sender and receiver details
  const result = await pool.query(
    `
    SELECT
      s.shipment_id,
      s.consignment_id,
      s.current_status,
      s.created_at,
  
      sender.full_name AS sender_name,
      sender.pincode AS sender_pincode,
  
      sender_city.city_name AS sender_city,
      sender_country.country_name AS sender_country,
  
      receiver.pincode AS receiver_pincode,
  
      receiver_city.city_name AS receiver_city,
      receiver_country.country_name AS receiver_country
  
    FROM shipments s
  
    JOIN customers sender
      ON sender.customer_id = s.sender_id
  
    JOIN customers receiver
      ON receiver.customer_id = s.receiver_id
  
    LEFT JOIN cities sender_city
      ON sender_city.city_id = sender.city_id
  
    LEFT JOIN countries sender_country
      ON sender_country.country_id = sender_city.country_id
  
    LEFT JOIN cities receiver_city
      ON receiver_city.city_id = receiver.city_id
  
    LEFT JOIN countries receiver_country
      ON receiver_country.country_id = receiver_city.country_id
  
    WHERE s.current_status != 'Delivered'
  
    ORDER BY s.created_at ASC
    `,
  );

  // Return the list of active shipments
  return res.status(200).json(result.rows);
};
