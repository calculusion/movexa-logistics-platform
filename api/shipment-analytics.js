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
    // Get the requested year, defaulting to 2026 if none is provided
    const year = parseInt(req.query.year) || 2026;

    // Retrieve the number of shipments created in each month of the selected year.
    // A generated month series ensures that months with zero shipments are included.
    const result = await pool.query(
      `
                WITH months AS (
            
                    SELECT
                        generate_series(
                            1,
                            12
                        ) AS month_number
            
                )
            
                SELECT
            
                    months.month_number,
            
                    TO_CHAR(
                        TO_DATE(
                            months.month_number::text,
                            'MM'
                        ),
                        'Mon'
                    ) AS month,
            
                    COALESCE(
                        COUNT(shipments.shipment_id),
                        0
                    )::int AS shipments
            
                FROM months
            
                LEFT JOIN shipments
                    ON EXTRACT(
                        MONTH FROM shipments.created_at
                    ) = months.month_number
            
                    AND EXTRACT(
                        YEAR FROM shipments.created_at
                    ) = $1
            
                    AND shipments.user_id = $2
            
                GROUP BY
                    months.month_number
            
                ORDER BY
                    months.month_number
                `,
      [year, user.id],
    );
    // Return the monthly shipment statistics
    res.status(200).json(result.rows);
  } catch (error) {
    // Log the server error and return an internal server error response
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
