# Технічне завдання: SPA-месенджер із групами, Read/Delivered і постами

**Стек:** Laravel 12 + React (Vite + TypeScript)  
**Мета:** мінімальний аналог Signal із груповими чатами та стрічкою постів.

---

## 1. Мета

Розробити односторінковий веб-месенджер, що підтримує приватні та групові чати в реальному часі, індикацію доставки / прочитання повідомлень і базові профілі користувачів із постами.

---

## 2. Технології

- **Back-end:** Laravel 12, Sanctum, Broadcasting (soketi / laravel-websockets), Redis, MySQL, Queues (database).
- **Front-end:** React + Vite + TypeScript + TailWind, React Query, Laravel Echo.
- **Інфраструктура:** Docker Compose (php-fpm, nginx, mysql, redis, websockets, node).
- **Тести:** PHP Unit / Pest, Vitest / Jest.
- **Лінтинг:** PHP CS Fixer, ESLint + Prettier.


---

## 3. Обсяг робіт (по ітераціях)

### Ітерація 0 — Інфраструктура

- Docker Compose середовище.
- Sanctum + CORS + CSRF для SPA.
- Мінімальні сторінки — Login, Register, Home.


### Ітерація 1 — Приватні чати

- CRUD діалогів 1:1.
- Надсилання / отримання / видалення текстових повідомлень.
- Пагінація історії, пошук по користувачах.
- Polling або кнопка “Оновити”.


### Ітерація 2 — Групи + Realtime

- Групові чати (roles: owner, admin, member).
- Приєднання / вихід / додавання учасників.
- Сокети через Laravel Echo: `MessageSent`, `MessageUpdated`, `MessageDeleted`.
- Браузерні нотифікації.


### Ітерація 3 — Read / Delivered + Пости

- Таблиця `message_statuses`, подія `ReceiptUpdated`.
- Delivered — відмітка сервером або клієнтом після отримання події.
- Read — після відкриття чату.
- UI: ✓ (delivered всім), ✓✓ (read всім).
- Профіль користувача + стрічка постів (тільки текст + лайки).


---

## 4. Схема БД (актуальна спрощена)

Використовуються вже створені таблиці, але активні лише такі поля:

- **users** (id, name, username, email, password, avatar_url, created_at)
- **conversations** (id, type ENUM['direct','group'], title NULL, owner_id NULL, created_at)
- **conversation_participants** (id, conversation_id, user_id, role ENUM['owner','admin','member'], UNIQUE(conversation_id,user_id))
- **messages** (id, conversation_id, sender_id, body TEXT, type ENUM['text'], created_at, edited_at NULL, deleted_at NULL)
- **message_statuses** (id, message_id, recipient_id, delivered_at NULL, read_at NULL, UNIQUE(message_id,recipient_id))
- **posts** (id, author_id, body TEXT, created_at)
- **post_likes** (id, post_id, user_id, UNIQUE(post_id,user_id))


Медіа-таблиці (`attachments`) не використовуються.

---

## 5. API контракти (REST, JSON)

### Auth

`POST /api/auth/register|login|logout`, `GET /api/me`

### Users

`GET /api/users/search?q=` → [{id,name,username,avatar_url}]

### Conversations

- `POST /api/conversations` {type:'direct'|'group', title?, participant_ids[]}
- `GET /api/conversations`
- `GET /api/conversations/{id}`
- `POST /api/conversations/{id}/participants` (admin)
- `DELETE /api/conversations/{id}/participants/{user_id}`


### Messages

- `GET /api/conversations/{id}/messages?before_id=&limit=50`
- `POST /api/conversations/{id}/messages` {body}
- `PATCH /api/messages/{id}` (редагувати тільки автор)
- `DELETE /api/messages/{id}` (автор/адмін)
- `POST /api/messages/{id}/read` → 204


### Posts

- `GET /api/posts` (загальна стрічка або по користувачу)
- `POST /api/posts` {body}
- `POST /api/posts/{id}/likes` / `DELETE .../likes`


---

## 6. Сокети (реaltime)

**Драйвер:** Laravel Broadcasting + Echo + Redis.  
**Канали:** `private-conversation.{id}`.  
**Події:**

- `MessageSent`, `MessageUpdated`, `MessageDeleted`
- `ReceiptUpdated {message_id, recipient_id, delivered_at?, read_at?}`


---

## 7. Права доступу

- Доступ до `private-conversation.{id}` — тільки учасники.
- Адмін/owner групи керує назвою та учасниками.
- Редагувати / видаляти повідомлення може автор або адмін.


---

## 8. Front-end маршрути

- `/login`, `/register`
- `/chats`, `/chats/:id`
- `/profile/:username`
- `/posts` (стрічка)


Компоненти: ChatList, ChatView, MessageInput, ReadReceipts, PostFeed.

---

## 9. Тестування та прийомка

- Unit тести сервісів та політик.
- Feature тести CRUD чату та повідомлень.
- E2E: два браузери, повідомлення у realtime, ✓ / ✓✓ оновлюються.
- Пости і лайки працюють через REST.
- OpenAPI актуальний, лінт без помилок.


---

## 10. Спрощення порівняно з повним варіантом

- Без presence / typing.
- Без медіа та attachments.
- Без коментарів до постів.
- Без налаштувань приватності.


---

## 11. Готовність (DoD)

- Міграції працюють на чистій БД.
- Сокети доставляють повідомлення в реальному часі.
- Read / Delivered відображаються на UI.
- Групові чати функціонують.
- Профіль та стрічка постів відкриваються.
    
