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

  // Get the shipment ID from the request query
  const shipmentId = req.query.id;

  // Retrieve complete shipment details, including sender, receiver,
  // shipment information, services, payment mode, and location details
  const result = await pool.query(
    `
      SELECT
        s.shipment_id,
        s.consignment_id,
        s.current_status,

        s.quantity,
        s.weight,
        s.length,
        s.width,
        s.height,

        s.description,
        s.total_amount,
        s.special_instructions,

        sender.full_name AS sender_name,
        sender.phone AS sender_phone,
        sender.address_line AS sender_address,
        sender.pincode AS sender_pincode,
        sender.landmark AS sender_landmark,

        sender_city.city_name AS sender_city,
        sender_country.country_name AS sender_country,

        receiver.full_name AS receiver_name,
        receiver.phone AS receiver_phone,
        receiver.address_line AS receiver_address,
        receiver.pincode AS receiver_pincode,
        receiver.landmark AS receiver_landmark,

        receiver_city.city_name AS receiver_city,
        receiver_country.country_name AS receiver_country,

        item_types.item_name,

        services.service_name,

        additional_services.service_name
          AS additional_service_name,

        payment_modes.payment_name

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

      LEFT JOIN item_types
        ON item_types.item_type_id = s.item_type_id

      LEFT JOIN services
        ON services.service_id = s.service_id

      LEFT JOIN additional_services
        ON additional_services.additional_service_id =
          s.additional_service_id

      LEFT JOIN payment_modes
        ON payment_modes.payment_mode_id =
          s.payment_mode_id

      WHERE s.shipment_id = $1
    `,
    [shipmentId],
  );

  // Return the shipment details to the client
  return res.status(200).json(result.rows[0]);
};
