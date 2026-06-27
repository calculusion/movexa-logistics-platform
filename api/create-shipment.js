// Import the PostgreSQL database connection pool
const pool = require("../lib/db");

// Import the Supabase Admin client for user authentication
const supabaseAdmin = require("../lib/supabaseAdmin");

// Import the shipment validation schema
const shipmentSchema = require("../validations/shipmentSchema");

// Import the rate limiter to prevent shipment creation abuse
const { createShipmentLimiter } = require("../lib/rateLimit");

// Generate a unique consignment ID for every shipment
function generateConsignmentId() {
  return (
    "MVX-" +
    Date.now().toString().slice(-8) +
    Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")
  );
}

module.exports = async (req, res) => {
  // Identify the client's IP address for rate limiting
  const ip = req.headers["x-forwarded-for"] || "unknown";

  // Limit how frequently a user can create shipments
  const { success } = await createShipmentLimiter.limit(ip);

  if (!success) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  // Extract the user's authentication token
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // Verify the user's authenticated session
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({
      success: false,
      message: "Invalid session",
    });
  }

  // Validate all shipment form data before processing
  const validation = shipmentSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,

      message: "Validation failed",

      errors: validation.error.flatten().fieldErrors,
    });
  }

  // Open a database connection for the transaction
  const client = await pool.connect();

  try {
    // Start a database transaction to ensure all operations succeed together
    await client.query("BEGIN");

    const {
      senderName,
      senderPhone,
      senderAddress,
      senderCity,
      senderPincode,
      senderLandmark,

      receiverName,
      receiverPhone,
      receiverAddress,
      receiverCity,
      receiverPincode,
      receiverLandmark,

      itemType,
      serviceType,
      additionalService,
      paymentMode,

      quantity,
      weight,
      length,
      width,
      height,

      description,
      totalAmount,
      specialInstructions,
    } = validation.data;

    // Prevent creating a shipment where the sender and receiver are identical
    if (
      senderName.trim().toLowerCase() === receiverName.trim().toLowerCase() &&
      senderPhone.trim() === receiverPhone.trim() &&
      senderAddress.trim().toLowerCase() ===
        receiverAddress.trim().toLowerCase() &&
      senderCity.trim().toLowerCase() === receiverCity.trim().toLowerCase() &&
      senderCountry.trim().toLowerCase() ===
        receiverCountry.trim().toLowerCase() &&
      senderPincode.trim() === receiverPincode.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Sender and receiver cannot be the same person at the same address.",
      });
    }

    const consignmentId = generateConsignmentId();

    // Sender city
    const senderCityResult = await client.query(
      `
            SELECT city_id
            FROM cities
            WHERE LOWER(TRIM(city_name)) =
                  LOWER(TRIM($1))
            `,
      [senderCity],
    );

    if (senderCityResult.rows.length === 0) {
      throw new Error("Invalid sender city");
    }

    const senderCityId = senderCityResult.rows[0].city_id;

    // Receiver city
    const receiverCityResult = await client.query(
      `
            SELECT city_id
            FROM cities
            WHERE LOWER(TRIM(city_name)) =
                  LOWER(TRIM($1))
            `,
      [receiverCity],
    );

    if (receiverCityResult.rows.length === 0) {
      throw new Error("Invalid receiver city");
    }

    const receiverCityId = receiverCityResult.rows[0].city_id;

    // Insert sender
    const senderResult = await client.query(
      `
            INSERT INTO customers (
                full_name,
                phone,
                address_line,
                city_id,
                pincode,
                landmark
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING customer_id
            `,
      [
        senderName,
        senderPhone,
        senderAddress,
        senderCityId,
        senderPincode,
        senderLandmark,
      ],
    );

    const senderId = senderResult.rows[0].customer_id;

    // Insert receiver
    const receiverResult = await client.query(
      `
            INSERT INTO customers (
                full_name,
                phone,
                address_line,
                city_id,
                pincode,
                landmark
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING customer_id
            `,
      [
        receiverName,
        receiverPhone,
        receiverAddress,
        receiverCityId,
        receiverPincode,
        receiverLandmark,
      ],
    );

    const receiverId = receiverResult.rows[0].customer_id;

    // Item type
    const itemResult = await client.query(
      `
            SELECT item_type_id
            FROM item_types
            WHERE item_name = $1
            `,
      [itemType],
    );

    const itemTypeId = itemResult.rows[0].item_type_id;

    // Service
    const serviceResult = await client.query(
      `
            SELECT service_id
            FROM services
            WHERE service_name = $1
            `,
      [serviceType],
    );

    const serviceId = serviceResult.rows[0].service_id;

    // Additional service
    let additionalServiceId = null;

    if (additionalService && additionalService !== "Select") {
      const additionalResult = await client.query(
        `
                SELECT additional_service_id
                FROM additional_services
                WHERE service_name = $1
                `,
        [additionalService],
      );

      additionalServiceId =
        additionalResult.rows[0]?.additional_service_id || null;
    }

    // Payment mode
    const paymentResult = await client.query(
      `
            SELECT payment_mode_id
            FROM payment_modes
            WHERE payment_name = $1
            `,
      [paymentMode],
    );

    const paymentModeId = paymentResult.rows[0].payment_mode_id;

    // Insert shipment
    const shipmentResult = await client.query(
      `
            INSERT INTO shipments (
                user_id,
                consignment_id,
                sender_id,
                receiver_id,
                item_type_id,
                service_id,
                additional_service_id,
                payment_mode_id,
                quantity,
                weight,
                length,
                width,
                height,
                description,
                total_amount,
                special_instructions
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,
                $8,$9,$10,$11,$12,
                $13,$14,$15,$16
            )
            RETURNING *
            `,
      [
        user.id,
        consignmentId,
        senderId,
        receiverId,
        itemTypeId,
        serviceId,
        additionalServiceId,
        paymentModeId,
        quantity,
        weight,
        length,
        width,
        height,
        description,
        totalAmount,
        specialInstructions,
      ],
    );

    const shipmentId = shipmentResult.rows[0].shipment_id;

    // Initial status
    await client.query(
      `
            INSERT INTO shipment_status_history (
                shipment_id,
                status,
                remarks
            )
            VALUES ($1, $2, $3)
            `,
      [shipmentId, "Pending", "Shipment created"],
    );

    // Save all database changes
    await client.query("COMMIT");

    // Return the generated consignment ID to the client
    return res.status(201).json({
      success: true,
      consignmentId,
    });
  } catch (error) {
    // Undo all database changes if an error occurs
    await client.query("ROLLBACK");

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    // Release the database connection back to the pool
    client.release();
  }
};
