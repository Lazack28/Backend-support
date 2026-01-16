# LazackBoost Node.js Backend

This project is a simple Node.js backend that connects your website to the LazackBoost API.  
It allows you to safely place social media boost orders (TikTok, Instagram, Facebook, etc.) using predefined service IDs from your website.

This README is written for beginner developers and explains everything step by step.

---

## What This Backend Does

- Accepts order requests from your frontend
- Validates service IDs used on your website
- Sends orders to LazackBoost API
- Protects your API key from being exposed
- Returns clean JSON responses

---

## Technologies Used

- Node.js
- Express.js
- Axios
- Dotenv

---

## Requirements

Before starting, make sure you have:

- Node.js installed
- npm installed
- A LazackBoost API key

To check installation:

```
node -v
npm -v

```
---

Project Structure

lazack-backend/
│── server.js
│── .env
│── package.json
│── README.md


---

Installation Steps

```Step 1: Create project folder

mkdir lazack-backend
cd lazack-backend

Step 2: Initialize Node.js project

npm init -y

Step 3: Install dependencies

npm install express axios dotenv

```
---

Environment Configuration

Create a file named .env in the project root.
```
PORT=3000
LAZACK_API_KEY=YOUR_API_KEY_HERE
```
This keeps your API key secure and hidden from the frontend.


---

Service IDs Used

These are some of the service id accepted by our api:
```
101, 102, 103, 104
201, 202, 203
301, 302, 303
401
501
601
701
```
If a service ID outside this list is sent, the backend will reject it.


---

Server Code (server.js)

The backend listens for requests, validates input, and communicates with LazackBoost API.
```
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

```
---

Running the Server

Start the backend using:

node server.js

You should see:

```Server running on port 3000```


---

API Usage

Endpoint

POST /order

URL (local)

http://localhost:3000/order
```
Request Body (JSON)

{
  "service_id": 301,
  "username_or_link": "https://www.tiktok.com/@username",
  "quantity": 1000,
  "currency": "TZS"
}

```
---

Response Example
```
{
  "success": true,
  "data": {
    "order_id": 123456,
    "status": "processing"
  }
}
```

---

Error Handling

If a service ID is invalid:
```
{
  "success": false,
  "message": "Invalid service ID"
}

If API request fails:

{
  "success": false,
  "error": "Error message from API"
}

```
---

### Why This Backend Is Important

Prevents users from seeing your API key

Stops invalid service usage

Keeps your system secure

Makes frontend integration easy

Ready for hosting on VPS or Render



---

### Next Improvements

Balance checking endpoint

Order status tracking

Refill system

User authentication

Admin dashboard



---

Author

Lazack Organisation
LazackBoost Backend
