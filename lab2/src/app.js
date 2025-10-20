import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import booksRouter from './routes/books.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/', booksRouter);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});