import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/orders', (req, res) => {
  res.send('Access orders service through GET');
});

app.listen(3002, () => {
  console.log('Orders Service listening on port 3002');
});
