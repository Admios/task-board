# Task Board

Task Board is an open-source generic task management and collaboration tool. We built it to offer an easy and customizable way to view, manage, and share your tasks.

## Quickstart

Requirements: NodeJS and Docker Desktop are both installed.

1. Install dependencies with `npm install`
1. Run the Cassandra database with `docker compose -f docker/dev.compose.yml up -d`. The defaults should work.
1. (First time only) Wait around a minute until the Cassandra instance is ready.
1. Create the "Keyspace": `npm run db:keyspace:create`. If this fails, wait a minute and try again.
1. Migrate the tables: `npm run db:migrate`.
1. Run `npm run dev`.
1. Open `localhost:3000` on your web browser.

## Running unit tests

Requirements: NodeJS installed

1. Install dependencies with `npm install`
1. Run `npm test`

Should work out of the box.

## Running end-to-end tests

Requirements: NodeJS and Docker Desktop are both installed.

1. Complete the Quickstart steps and keep the database and the server running.
1. Setup `.env.test` and `migrations/config-test.json` with the correct values (the defaults should work)
1. Configure the test keyspace for testing: `npm run db:keyspace:create-test`
1. Migrate the tables in the test keyspace: `npm run db:migrate-test`.
1. Run `npm run test:e2e` in another console.

All tests should pass.

## Database Management Scripts

- `npm run db:keyspace:create` creates a development keyspace in the targeted cluster.
- `npm run db:keyspace:create-test` creates a test keyspace in the targeted cluster (For e2e testing)
- `npm run db:migrate` runs database migrations (uses `cassandra-migration`).
- `npm run db:migrate-test` runs database migrations, but with the test keyspace (for e2e testing)
- `npm run db:seed` seeds the database with demo data, but only if there are users already in the database. It takes five random users and generates them some random tasks.
- `npm run db:clear` empties the database tables.

## Cypress Scripts

- `npm run test:e2e` runs the end-to-end tests with Cypress. The application must already be running in order for the tests to work.
  - This is actually a wrapper for `npm run cy:run` with correct environment variables.
- `npm run cy:open` Opens the Cypress interface
- `npm run cy:run` Runs the Cypress tests.

## Stack

Task Board is a monolithic application built over NextJS 13. It should only require a database instance and a web server instance. Here we list all the design considerations we had while building this application:

### NextJS Server Side Components

Task Board is built from scratch with React Server Side Components. Queries between the frontend and the backend are abstracted with the `"use client"` and `"use server"` directives at the top of the file. These directives allow certain files to retrieve the data inside the server and pass it to the client as React Props.

### NextJS Server Actions

We use NextJS Server Actions to handle AJAX requests from the frontend. You can recognize those files because their first line is `"use server"`.

### NextJS App Router

In order to be able to use the new features of NextJS 13 we have to use the new router. All client-accessible routes therefore live in the `src/app` folder, which in turn calls components that live in the `src/templates` folder. We called it "template" because the "pages" folder name is reserved for the old router which we are not using.

### User Authentication: Passkeys via WebAuthN

No passwords! You can log in with your fingerprint! We are using the new Passkey Authentication scheme to verify users and to allow them to log in. We use the `simplewebauthn` library to handle the authentication process. The standard is still not fully implemented in every possible client, however, and some users will require a Fido2 compatible device to log in. Your mileage will vary!

These are the tested platforms:

- Safari in MacOS works with TouchID.
- Chromium Forks work with TouchID on MacOS, and with the integrated password manager in Windows. Tested with Brave Browser.
- Firefox DOES NOT work with TouchID, but it does work with a Fido2 compatible device in all OSs
- 1Password Plugin for browsers is not working yet. Known issue.
- Windows Hello: not tested yet.

#### User Authentication Flow

- User navigates to `/login` and clicks on the "Authorize" button.
- A Server Action takes the username/email and returns a cryptographic challenge to the client.
  - If the user is already registered, the challenge will require the user to use an existing "Authenticator".
  - Either way, the challenge is saved to the database as an "AuthenticatorChallenge", which will be retrieved later in the process.
- The client receives the challenge and uses the `simplewebauthn` library to request the user to sign the challenge with a biometric device.
  - If the user is already registered, `simplewebauthn` will only allow the user to use an authenticator that is already enrolled in the database.
  - If the user is not registered, `simplewebauthn` will allow the user to use any authenticator they wish.
- A Server Action receives the challenge from the client.
  - We retrieve the "AuthenticatorChallenge" for this user to check the challenge.
  - If the user is not registered, and the challenge is valid, the server will save the new User and the used Authenticator to the database.
  - Either way, if the challenge is valid, the server deletes the "AuthenticatorChallenge".
- If the authentication succeeds, the server will set a `userId` HTTP-only cookie that will determine the current user.

### ChakraUI for React

We use ChakraUI to style the application. ChakraUI is a component library that uses the CSS-in-JS paradigm. We decided on it because it was the easiest to integrate with the existing stack. We probably should have chosen something based on CSS components instead, because now every route has to recompile the CSS on the server side. We will probably change this in the future.

### Zustand State Management

We use Zustand to manage the state of the application on the client side. Zustand is a very simple state management library that uses React Hooks and we use it as a replacement for Redux.

### Cassandra Database

This application uses Apache Cassandra as its database. We use the `cassandra-driver` library to connect to the database and we its "mapping" feature as our ORM. We also use the `cassandra-migrate` library to manage the database migrations. You can either connect to your Cassandra Cluster directly, or you can use the `docker/dev.compose.yml` file to run a local instance of Cassandra for development purposes.
