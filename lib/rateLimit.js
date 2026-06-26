// Import the Upstash Redis client
const { Redis } = require("@upstash/redis");

// Import the Upstash rate limiting utility
const { Ratelimit } = require("@upstash/ratelimit");

// Initialize the Redis client using environment variables
const redis = Redis.fromEnv();

// Limit shipment creation requests to prevent abuse and spam
const createShipmentLimiter = new Ratelimit({
  redis,

  limiter: Ratelimit.slidingWindow(5, "15 m"),
});

// Limit support form submissions to prevent spam
const supportLimiter = new Ratelimit({
  redis,

  limiter: Ratelimit.slidingWindow(5, "15 m"),
});

// Export the configured rate limiters
module.exports = {
  createShipmentLimiter,
  supportLimiter,
};
