const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const SERVICES = [
  101, 102, 103, 104,
  201, 202, 203,
  301, 302, 303,
  401,
  501,
  601,
  701
];

app.post('/order', async (req, res) => {
  try {
    const { service_id, username_or_link, quantity, currency } = req.body;

    // Validate service ID
    if (!SERVICES.includes(service_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID'
      });
    }

    const response = await axios.post(
      'https://boostapi.lazackorganisation.my.id/api/v1/order',
      {
        service_id,
        username_or_link,
        quantity,
        currency
      },
      {
        headers: {
          'X-API-Key': process.env.LAZACK_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
