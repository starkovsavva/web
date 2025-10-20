# Домашняя библиотека — пример REST-приложения

Коротко: простое приложение на Node.js + Express + EJS. Реализованы REST API для списка книг, выдачи/возврата, добавления/удаления, JSON-хранилище на сервере.

Как запустить

1. Убедитесь, что установлен Node.js (v16+).
2. В корне проекта выполните:

```bash
npm install
npm start
```

3. Откройте http://localhost:3000

Что сделано (соотнесение с требованиями лабораторной)

- JSON-хранилище: `src/data/books.json` — начальное и текущее состояние хранится в файле.
- Сервер: `src/app.js` — Express.
- Шаблоны: EJS (`src/views`).
- Страница списка книг: `GET /` — `src/views/index.ejs`. Фильтрация выполняется AJAX-запросами к `GET /api/books` с query-параметрами `available` и `overdue`.
- Карточка книги: `GET /book/:id` — `src/views/card.ejs`. Можно редактировать (PUT /api/books/:id), выдавать (POST /api/books/:id/borrow) и возвращать (POST /api/books/:id/return).
- Модальные окна реализованы с помощью `<dialog>` в `index.ejs` и `card.ejs`.
- CSS: `public/css/style.css` (адаптив через media query).
- Иконки: можно поместить Font Awesome в `public/fontawesome` (в репозитории добавлена пустая папка-плейсхолдер).
- REST: маршруты в `src/routes/books.js`.
- Клиентская логика: `public/js/main.js`.

Дальше (опционально)

- Добавить аутентификацию (passport.js).
- Поддержку загрузки обложек (express-fileupload или multer) и хранение пути в JSON.
- Улучшить валидацию форм и обработку ошибок на клиенте и сервере.
