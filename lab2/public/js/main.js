async function loadBooks(){
  const available = document.getElementById('filterAvailable').checked ? '1' : '0';
  const overdue = document.getElementById('filterOverdue').checked ? '1' : '0';
  const url = `/api/books?available=${available}&overdue=${overdue}`;
  const res = await fetch(url);
  const books = await res.json();
  const list = document.getElementById('booksList');
  list.innerHTML = '';
  for (const b of books) {
    // root card
    const el = document.createElement('div');
    el.className = 'book';

    // title
    const title = document.createElement('h3');
    title.textContent = b.title || '';
    el.appendChild(title);

    // author + year meta
    const metaAuthor = document.createElement('div');
    metaAuthor.className = 'meta';
    metaAuthor.textContent = b.author || '';
    if (b.year) metaAuthor.textContent += ` (${b.year})`;
    el.appendChild(metaAuthor);

    // availability status
    const metaStatus = document.createElement('div');
    metaStatus.className = 'meta';
    metaStatus.textContent = b.available ? 'В наличии' : 'Выдана';
    el.appendChild(metaStatus);

    // actions container
    const actions = document.createElement('div');
    actions.className = 'actions';

    const openLink = document.createElement('a');
    openLink.href = `/book/${b.id}`;
    openLink.textContent = 'Открыть';
    actions.appendChild(openLink);

    const borrowBtn = document.createElement('button');
    borrowBtn.className = 'secondary';
    borrowBtn.dataset.id = String(b.id);
    borrowBtn.dataset.action = 'borrow';
    borrowBtn.textContent = 'Выдать';
    actions.appendChild(borrowBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.dataset.id = String(b.id);
    deleteBtn.dataset.action = 'delete';
    deleteBtn.textContent = 'Удалить';
    actions.appendChild(deleteBtn);

  

    el.appendChild(actions);
    list.appendChild(el);
  }
}

function escapeHtml(s){ 
  if(s === null || s === undefined)
     return '';
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); 
}

document.getElementById('refresh').addEventListener('click', loadBooks);
document.getElementById('filterAvailable').addEventListener('change', loadBooks);
document.getElementById('filterOverdue').addEventListener('change', loadBooks);

document.getElementById('booksList').addEventListener('click', async (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = btn.dataset.id;
  if(btn.dataset.action === 'delete'){
    if(!confirm('Удалить книгу?')) return;
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    loadBooks();
  }else if(btn.dataset.action === 'borrow'){
    const dialog = document.getElementById('borrowDialog');
    document.getElementById('borrowBookId').value = id;
    dialog.showModal();
  }
});

// Ensure 'Открыть' links navigate correctly (some environments may prevent default link behavior)
document.getElementById('booksList').addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if(!link) return;
  // Only handle internal book links
  const m = link.getAttribute('href')?.match(/^\/book\/(\d+)$/);
  if(m){
    // Use location.assign to navigate reliably
    e.preventDefault();
    location.assign(link.getAttribute('href'));
  }
});

document.getElementById('addBook').addEventListener('click', ()=>{
  const d = document.getElementById('bookDialog');
  document.getElementById('dialogTitle').innerText = 'Добавить книгу';
  document.getElementById('bookId').value = '';
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('year').value = '';
  d.showModal();
});

document.getElementById('saveBook').addEventListener('click', async ()=>{
  const id = document.getElementById('bookId').value;
  const body = { title: document.getElementById('title').value, author: document.getElementById('author').value, year: document.getElementById('year').value };
  if(id){
    await fetch(`/api/books/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  }else{
    await fetch('/api/books', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  }
  document.getElementById('bookDialog').close();
  loadBooks();
});

document.getElementById('doBorrow').addEventListener('click', async ()=>{
  const id = document.getElementById('borrowBookId').value;
  const body = { borrower: document.getElementById('borrower').value, dueDate: document.getElementById('dueDate').value };
  await fetch(`/api/books/${id}/borrow`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  document.getElementById('borrowDialog').close();
  loadBooks();
});

// initial load
loadBooks().catch(console.error);
