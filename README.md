This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Requirements: NodeJS and Docker Desktop both installed.

1. Install dependencies with `npm install`
2. Run the Cassandra database with `docker compose -f docker/dev.compose.yml up -d`. The defaults should work.
3. WAIT for around 40 seconds until the container `cassandra-load-keyspace` finishes with code `0` (Success). Could take several attempts!
4. Seed the database with `npm run db:seed`
5. Run `npm run dev`.
6. Open `localhost:3000` on your web browser. If you see the demo data, then everything worked.

## About the database

This repository is designed to work with Apache Cassandra.

- You can clear the database with `npm run db:clear`, and start over with `npm run db:seed`
- `/.env.development` has some default Cassandra values uses to connect with the values on `docker/dev.compose.yml`. Note that these defaults should only be used for development purposes!
- The `cassandra-load-keyspace` container is there just to run `cassandra-init.sql`, which creates the keyspace the application needs to run. Therefore, when first running the application, it is important to wait until that container suceeds.
