import express from 'express';
import bodyParser from 'body-parser';
import novelsRouter from './routes/novels';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Sajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Gunakan router untuk endpoint /novels
app.use('/novels', novelsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});