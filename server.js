const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// ================== CONFIG ==================
const LAZACK_API_KEY = 'YOUR_API_KEY_HERE';
const LAZACK_BASE_URL = 'https://boostapi.lazackorganisation.my.id/api/v1';

// ================== MIDDLEWARE ==================
app.use(express.json());

const lazackHeaders = {
  'X-API-Key': LAZACK_API_KEY,
  'Content-Type': 'application/json'
};

// ================== SERVICE MAPPING ==================
// Users MUST use these service codes (NOT Lazack service IDs)
const SERVICE_MAPPING = {
  TIKTOK_FOLLOWERS: 301,
  INSTAGRAM_LIKES: 205,
  YOUTUBE_SUBSCRIBERS: 410
};

// ================== INTERNAL BALANCE (ADMIN ONLY) ==================
app.get('/admin/balance', async (req, res) => {
  try {
    const response = await axios.get(
      `${LAZACK_BASE_URL}/balance`,
      { headers: lazackHeaders }
    );
    res.json({
      account: 'LazackBoost',
      balance: response.data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch LazackBoost balance',
      error: error.response?.data || error.message
    });
  }
});

// ================== PLACE ORDER (USERS) ==================
app.post('/order', async (req, res) => {
  const { service_code, username_or_link, quantity, currency } = req.body;

  if (!service_code || !username_or_link || !quantity || !currency) {
    return res.status(400).json({
      message: 'Missing required fields'
    });
  }

  // Enforce service mapping
  const service_id = SERVICE_MAPPING[service_code];

  if (!service_id) {
    return res.status(400).json({
      message: 'Invalid service_code. Use service mapping only.'
    });
  }

  try {
    const response = await axios.post(
      `${LAZACK_BASE_URL}/order`,
      {
        service_id,
        username_or_link,
        quantity,
        currency
      },
      { headers: lazackHeaders }
    );

    res.json({
      status: 'success',
      service_code,
      order: response.data
    });

  } catch (error) {
    res.status(500).json({
      message: 'Order failed',
      error: error.response?.data || error.message
    });
  }
});

// ================== USER ORDER HISTORY ==================
app.get('/orders', async (req, res) => {
  const { page = 1 } = req.query;

  try {
    const response = await axios.get(
      `${LAZACK_BASE_URL}/orders`,
      {
        headers: lazackHeaders,
        params: { page }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch orders',
      error: error.response?.data || error.message
    });
  }
});

// ================== SINGLE ORDER STATUS ==================
app.get('/order/:order_id', async (req, res) => {
  try {
    const response = await axios.get(
      `${LAZACK_BASE_URL}/order/${req.params.order_id}`,
      { headers: lazackHeaders }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch order',
      error: error.response?.data || error.message
    });
  }
});

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`LazackBoost backend running on http://localhost:${PORT}`);
});
