This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Requirements: NodeJS and Docker Desktop both installed.

1. Install dependencies with `npm install`
1. Run the Cassandra database with `docker compose -f docker/dev.compose.yml up -d`. The defaults should work.
1. Create the "Keyspace": `npm run db:keyspace:create`.
1. Migrate the tables: `npm run db:migrate`.
1. (Optional) Seed the database with demo data. `npm run db:seed`
1. Run `npm run dev`.
1. Open `localhost:3000` on your web browser. If you see the demo data, then everything worked.

## About the database

This repository is designed to work with Apache Cassandra.

- You can clear the database with `npm run db:clear`, and start over with `npm run db:seed`
- `/.env.development` has some default Cassandra values uses to connect with the values on `docker/dev.compose.yml`. Note that these defaults should only be used for development purposes!
