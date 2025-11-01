const fetch = require("node-fetch");
const Deposit = require("../models/deposit");
const Util = require("./Util");
const logger = require("../logger");

require("dotenv").config();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
        ).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createDepositOrder = async (depositAmount) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: depositAmount,
                },
            },
        ],
    };

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    return handleResponse(response);
};

/**
* Capture payment for the created order to complete the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
*/
const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
    });

    return handleResponse(response);
};

async function handleResponse(response) {
    try {
        const jsonResponse = await response.json();
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

class PayPalController {
    static CreateOrder = async (req, res) => {
        try {
            // use the cart information passed from the front-end to calculate the order amount detals
            const { depositAmount, user_token } = req.body;
            
            const user = await Util.verifyToken(user_token);
            if (user == false) {
                throw new Error("User authentication failed");
            }

            const { jsonResponse, httpStatusCode } = await createDepositOrder(depositAmount);

            res.status(httpStatusCode).json(jsonResponse);
        } catch (error) {
            console.error("Failed to create order:", error);
            res.status(500).json({ error: "Failed to create order." });
        }
    };

    static CaptureOrder = async (req, res) => {
        try {
            const { orderID } = req.params;
            const { user_token } = req.body;
            const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

            // Check if order id exists in deposit db
            const errorDetail = jsonResponse?.details?.[0];
            const user = await Util.verifyToken(user_token);
            if (!errorDetail && user != false) {
                const transaction = jsonResponse.purchase_units[0].payments.captures[0];
                if (transaction.status == 'COMPLETED') {
                    const sellerReceiving = transaction.seller_receivable_breakdown;
                    const newDeposit = new Deposit();
                    newDeposit.depositor = user._id;
                    newDeposit.amount = sellerReceiving.net_amount.value;
                    newDeposit.method = 'paypal';
                    newDeposit.transaction_id = transaction.id;
                    newDeposit.created_at = new Date().toLocaleString("en-us");
                    await newDeposit.validate();
                    await newDeposit.save();
                  }
            }

            res.status(httpStatusCode).json(jsonResponse);
        } catch (error) {
            console.error("Failed to capture order:", error);
            res.status(500).json({ error: "Failed to capture order." });
        }
    };
}

module.exports = PayPalController;
