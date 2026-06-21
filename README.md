# Restaurant REST API

Complete Express/Mongoose backend for the Coursera assignments:

- Assignment 1: Express routers for `/dishes`, `/promotions`, `/leaders`
- Assignment 2: MongoDB schemas and REST CRUD for promotions and leaders
- Assignment 3: Authenticated favorites API with Mongoose population

## Run

```bash
npm install
copy .env.example .env
npm start
```

The server starts on:

- `http://localhost:3000`
- `https://localhost:3443`

The HTTPS server uses a generated self-signed development certificate, so your browser may show a local certificate warning.

Default MongoDB URL:

```text
mongodb://127.0.0.1:27017/conFusion
```

You can change it in `.env`.

## Optional Seed Data

After MongoDB is running:

```bash
npm run seed
```

## Useful Endpoints

- `GET/POST/PUT/DELETE http://localhost:3000/dishes`
- `GET/POST/PUT/DELETE http://localhost:3000/dishes/:dishId`
- `GET/POST/PUT/DELETE http://localhost:3000/promotions`
- `GET/POST/PUT/DELETE http://localhost:3000/promotions/:promoId`
- `GET/POST/PUT/DELETE http://localhost:3000/leaders`
- `GET/POST/PUT/DELETE http://localhost:3000/leaders/:leaderId`
- `POST http://localhost:3000/users/signup`
- `POST http://localhost:3000/users/login`
- `GET/POST/DELETE http://localhost:3000/favorites`
- `POST/DELETE http://localhost:3000/favorites/:dishId`

Favorites routes require a bearer token from `/users/login`.
