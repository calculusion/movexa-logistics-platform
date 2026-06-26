const { z } = require("zod");

const phoneRegex = /^[0-9]{10,15}$/;

const pincodeRegex = /^[0-9A-Za-z -]{4,10}$/;

const shipmentSchema = z.object({

    senderName: z.string()
        .trim()
        .min(2, "Sender name is required")
        .max(100),

    senderPhone: z.string()
        .regex(
            phoneRegex,
            "Sender phone number is invalid"
        ),

    senderAddress: z.string()
        .trim()
        .min(5, "Sender address is required")
        .max(500),

    senderCity: z.string()
        .trim()
        .min(2, "Sender city is required")
        .max(100),

    senderPincode: z.string()
        .trim()
        .regex(
            pincodeRegex,
            "Sender pincode is invalid"
        ),

    senderLandmark: z.string()
        .trim()
        .max(200)
        .optional()
        .or(z.literal("")),

    receiverName: z.string()
        .trim()
        .min(2, "Receiver name is required")
        .max(100),

    receiverPhone: z.string()
        .regex(
            phoneRegex,
            "Receiver phone number is invalid"
        ),

    receiverAddress: z.string()
        .trim()
        .min(5, "Receiver address is required")
        .max(500),

    receiverCity: z.string()
        .trim()
        .min(2, "Receiver city is required")
        .max(100),

    receiverPincode: z.string()
        .trim()
        .regex(
            pincodeRegex,
            "Receiver pincode is invalid"
        ),

    receiverLandmark: z.string()
        .trim()
        .max(200)
        .optional()
        .or(z.literal("")),

    itemType: z.string()
        .min(1, "Select an item type"),

    serviceType: z.string()
        .min(1, "Select a service type"),

    additionalService: z.string()
        .optional(),

    paymentMode: z.string()
        .min(1, "Select a payment mode"),

    quantity: z.coerce.number()
        .int()
        .min(1, "Quantity must be at least 1")
        .max(1000),

    weight: z.coerce.number()
        .positive("Weight must be greater than 0")
        .max(100000),

    length: z.coerce.number()
        .positive("Length must be greater than 0")
        .max(10000),

    width: z.coerce.number()
        .positive("Width must be greater than 0")
        .max(10000),

    height: z.coerce.number()
        .positive("Height must be greater than 0")
        .max(10000),

    description: z.string()
        .trim()
        .max(1000)
        .optional()
        .or(z.literal("")),

    totalAmount: z.coerce.number()
        .nonnegative()
        .max(10000000),

    specialInstructions: z.string()
        .trim()
        .max(1000)
        .optional()
        .or(z.literal(""))

});

module.exports = shipmentSchema;