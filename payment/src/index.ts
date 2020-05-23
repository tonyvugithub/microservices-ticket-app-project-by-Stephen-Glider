import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/payment', (req, res) => {
  res.send('Access payment service through GET');
});

app.listen(3003, () => {
  console.log('Payment service is listening on port 3003');
});
