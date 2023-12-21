async function createPayment(number, amount) {
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const shopId = '250293';
const secretKey = 'live_1XUEomqmngbA8xveGoMkMDiCUx0j9pJTSj7jDg53v9I';
    const currency = 'RUB';
    const idempotenceKey = uuidv4();
    const headers = {
      'Idempotence-Key': idempotenceKey,
      'Authorization': `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
      'Content-Type': 'application/json',
    };
  
    return axios.post(
      'https://api.yookassa.ru/v3/payments',
      {
        "amount": {
          "value": amount,
          "currency": currency
        },
        "capture": true,
        "confirmation": {
          "type": "redirect",
          "return_url": `https://seck-app-rentwer00999.koyeb.app/payment-success`
        },
        "description": "Donate WhaBot 1",
        "metadata": {
          "number": number,
          "donateSum": amount
        },
        "receipt": {
          "items": [
            {
              "description": "Товар 1",
              "quantity": 1,
              "amount": {
                "value": amount,
                "currency": currency
              },
              "vat_code": 2
            }
          ],
          "customer": {
            "email": 'whabot.help@gmail.com'
          }
        }
      },
      { headers }
    );
  }

  module.exports = { createPayment }