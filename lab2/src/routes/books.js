import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB = path.join(__dirname, '..', 'data', 'books.json');

async function readDB(){
  try{
    const raw = await fs.readFile(DB, 'utf8');
    return JSON.parse(raw);
  }catch(e){
    return [];
  }
}

async function writeDB(data){
  await fs.mkdir(path.dirname(DB), { recursive: true });
  await fs.writeFile(DB, JSON.stringify(data, null, 2), 'utf8');
}

// Pages
router.get('/', async (req, res) => {
  res.render('index');
});

router.get('/book/:id', async (req, res) => {
  const id = Number(req.params.id);
  const books = await readDB();
  const book = books.find(b => b.id === id);
  if(!book) return res.status(404).send('Not found');
  res.render('card', { book });
});

// REST API
router.get('/api/books', async (req, res) => {
  const { available, overdue } = req.query;
  let books = await readDB();
  if(available === '1'){
    books = books.filter(b => b.available === true);
  }
  if(overdue === '1'){
    // Parse dueDate as YYYY-MM-DD and compare local dates at midnight.
    const parseYMD = (s) => {
      if(!s || typeof s !== 'string') return null;
      const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if(!m) return null;
      const y = Number(m[1]), mo = Number(m[2]) - 1, d = Number(m[3]);
      const dt = new Date(y, mo, d);
      return isNaN(dt) ? null : dt;
    };

    const today = new Date();
    today.setHours(0,0,0,0);

    books = books.filter(b => {
      if(!b.dueDate) return false;
      const due = parseYMD(b.dueDate);
      if(!due) return false;
      due.setHours(0,0,0,0);
      return due < today; // overdue if due date is before today
    });
  }
  res.json(books);
});

router.get('/api/books/:id', async (req, res) => {
  const id = Number(req.params.id);
  const books = await readDB();
  const book = books.find(b => b.id === id);
  if(!book) return res.status(404).json({ message: 'Not found' });
  res.json(book);
});

router.post('/api/books', async (req, res) => {
  const body = req.body;
  let books = await readDB();
  const id = books.length ? Math.max(...books.map(b=>b.id)) + 1 : 1;
  const book = {
    id,
    title: body.title || 'Untitled',
    author: body.author || 'Unknown',
    year: body.year || '',
    available: true,
    borrower: '',
    dueDate: ''
  };
  books.push(book);
  await writeDB(books);
  res.status(201).json(book);
});

router.put('/api/books/:id', async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  let books = await readDB();
  const idx = books.findIndex(b => b.id === id);
  if(idx === -1){
    // create
    const book = { id, ...body };
    books.push(book);
    await writeDB(books);
    return res.status(201).json(book);
  }
  books[idx] = { ...books[idx], ...body };
  await writeDB(books);
  res.json(books[idx]);
});

router.delete('/api/books/:id', async (req, res) => {
  const id = Number(req.params.id);
  let books = await readDB();
  const idx = books.findIndex(b => b.id === id);
  if(idx === -1) return res.status(404).json({ message: 'Not found' });
  const [removed] = books.splice(idx,1);
  await writeDB(books);
  res.json(removed);
});

// Issue book (borrow) via modal dialog data
router.post('/api/books/:id/borrow', async (req, res) => {
  const id = Number(req.params.id);
  const { borrower, dueDate } = req.body;
  const books = await readDB();
  const book = books.find(b => b.id === id);
  if(!book) return res.status(404).json({ message: 'Not found' });
  if(!book.available) return res.status(400).json({ message: 'Already borrowed' });
  book.available = false;
  book.borrower = borrower || '';
  book.dueDate = dueDate || '';
  await writeDB(books);
  res.json(book);
});

router.post('/api/books/:id/return', async (req, res) => {
  const id = Number(req.params.id);
  const books = await readDB();
  const book = books.find(b => b.id === id);
  if(!book) return res.status(404).json({ message: 'Not found' });
  book.available = true;
  book.borrower = '';
  book.dueDate = '';
  await writeDB(books);
  res.json(book);
});

export default router;
