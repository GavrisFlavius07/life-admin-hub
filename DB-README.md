Database setup (Prisma + SQLite)

1) Install dependencies:

```bash
npm install prisma @prisma/client --save-dev
# or
npm install prisma @prisma/client
```

2) Initialize Prisma (if not already initialized):

```bash
npx prisma generate
```

3) Run migration to create the SQLite database and `users` table defined in `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name init
```

This will create `prisma/dev.db` (SQLite file `dev.db`) and generate Prisma client in `node_modules/@prisma/client`.

4) After that, your API controllers can call functions in `app/lib/db.ts` which use the generated Prisma client.

Notes
- All DB operations in `app/lib/db.ts` use Prisma client methods (parameterized queries internally), so there are no raw concatenated SQL queries.
- If you prefer Postgres or MySQL, update `prisma/schema.prisma` datasource provider and connection URL.
