import express from 'express';
import bodyParser from 'body-parser';
import novelsRouter from './routes/novels';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Gunakan router untuk endpoint /novels
app.use('/novels', novelsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});