// Import the PostgreSQL database connection pool
const pool = require("../lib/db");

// Import the Supabase Admin client for user authentication
const supabaseAdmin = require("../lib/supabaseAdmin");

module.exports = async (req, res) => {
  // Only allow GET requests for retrieving shipment details
  if (req.method !== "GET") {
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
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  // Reject the request if the session is invalid or expired
  if (authError || !user) {
    return res.status(401).json({
      message: "Invalid session",
    });
  }

  // Extract the requested consignment ID from the query parameters
  const { consignmentId } = req.query;

  if (!consignmentId) {
    return res.status(400).json({
      message: "Consignment ID is required",
    });
  }

  try {
    // Retrieve complete shipment information, including sender, receiver,
    // service, item type, and location details for the authenticated user
    const result = await pool.query(
      `
            SELECT
                s.consignment_id,
                s.quantity,
                s.weight,
                s.length,
                s.width,
                s.height,
                s.description,
                s.total_amount,
                s.special_instructions,
                s.current_status,
                s.created_at,

                sender.full_name AS sender_name,
                sender.phone AS sender_phone,
                sender.address_line AS sender_address,
                sender.pincode AS sender_pincode,
                sender.landmark AS sender_landmark,

                sender_country.country_name AS sender_country,
                sender_city.city_name AS sender_city,

                receiver.full_name AS receiver_name,
                receiver.phone AS receiver_phone,
                receiver.address_line AS receiver_address,
                receiver.pincode AS receiver_pincode,
                receiver.landmark AS receiver_landmark,

                receiver_country.country_name AS receiver_country,
                receiver_city.city_name AS receiver_city,

                i.item_name,
                sv.service_name,
                ads.service_name AS additional_service

            FROM shipments s

            JOIN customers sender
                ON s.sender_id = sender.customer_id

            JOIN cities sender_city
                ON sender.city_id = sender_city.city_id

            JOIN customers receiver
                ON s.receiver_id = receiver.customer_id

            JOIN cities receiver_city
                ON receiver.city_id = receiver_city.city_id

            JOIN countries sender_country
                ON sender_city.country_id = sender_country.country_id

            JOIN countries receiver_country
                ON receiver_city.country_id = receiver_country.country_id

            JOIN item_types i
                ON s.item_type_id = i.item_type_id

            JOIN services sv
                ON s.service_id = sv.service_id

            LEFT JOIN additional_services ads
                ON s.additional_service_id =
                   ads.additional_service_id

            WHERE s.consignment_id = $1
            AND s.user_id = $2

            LIMIT 1
            `,
      [consignmentId, user.id],
    );

    // Return a 404 response if the shipment does not exist or belongs to another user
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    // Return the shipment details to the client
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    // Log the server error and return an internal server error response
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
