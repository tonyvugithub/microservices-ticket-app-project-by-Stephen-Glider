import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/ticket/info', (req, res) => {
  res.send('Access ticket service through GET');
});

app.listen(3004, () => {
  console.log('Ticket service listening on port 3001');
});
