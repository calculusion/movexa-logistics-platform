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

    // Calculate the total revenue generated during the selected year
    const totalResult = await pool.query(
      `
            SELECT
                COALESCE(
                    SUM(total_amount),
                    0
                ) AS total_revenue
        
            FROM shipments
        
            WHERE user_id = $1
        
            AND EXTRACT(
                YEAR FROM created_at
            ) = $2
            `,
      [user.id, year],
    );

    // Calculate the monthly revenue breakdown for the selected year
    const monthlyResult = await pool.query(
      `
            SELECT
                TO_CHAR(
                    DATE_TRUNC('month', created_at),
                    'Mon'
                ) AS month,
        
                EXTRACT(
                    MONTH FROM created_at
                )::int AS month_number,
        
                COALESCE(
                    SUM(total_amount),
                    0
                ) AS revenue
        
            FROM shipments
        
            WHERE user_id = $1
        
            AND EXTRACT(
                YEAR FROM created_at
            ) = $2
        
            GROUP BY
                month,
                month_number
        
            ORDER BY
                month_number
            `,
      [user.id, year],
    );

    // Return the yearly total revenue and monthly revenue summary
    return res.status(200).json({
      totalRevenue: Number(totalResult.rows[0].total_revenue),

      monthlyRevenue: monthlyResult.rows.map((row) => ({
        month: row.month.trim(),

        revenue: Number(row.revenue),
      })),
    });
  } catch (error) {
    // Log the server error and return an internal server error response
    console.error("Revenue API error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
