const { connectionWhatsApp } = require('../client');
const { counter } = require('../')
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 4001;

app.use(express.json());
app.use(cors());

app.post('/webhook', async (req, res) => {
  const notification = req.body;
  if (notification.event === 'payment.succeeded') {
    const sum = notification.object.metadata.donateSum;
    const number = notification.object.metadata.number;
    
    await counter.updateOne({ userId: number }, { $inc: { wbc: sum } });
    await Void.sendMessage(number, {
      text: `Оплата успешна,на твой аккаунт было начислено ${sum} WBC. Спасибо!!❤️`,
    });
  }

  try {
    return res.status(200).send('Уведомление обработано успешно.');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  const sessionCheck = path.resolve(__dirname, `../sessions`);
  fs.readdir(sessionCheck, { withFileTypes: true }, async (err, entries) => {
    const sessions = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    for (const session of sessions) {
      await connectionWhatsApp({ sessionName: session });
    }
  });
});