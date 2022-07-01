# Dulwich Bookings API

The Backend repository for Dulwich Bookings hosted on Heroku. Built with NodeJS, Express, Sequelize, TypeScript, PostgreSQL

## Documentation

- [**Production Link**](https://dulwich-bookings-api.herokuapp.com/)
- [**Documentation Link**]()

## Access Control Flow

_CAA 220622 1800_

<img width="702" alt="Access control flow" src="https://user-images.githubusercontent.com/25262042/175012993-33334faa-35c1-488a-a34a-e27aa886ac73.png">

## Inital setup

**Prerequisites**
NodeJS LTS v16.15.0

1. Install nvm on your machine
2. run `nvm install v16.15.0`
3. run `npm install -g npm@8.5.5`
4. run `nvm use`
5. Run `npm install` in the working directory to install required packages
6. Use the linter files provided to ensure consistent code style across the repository
7. Create `.env` file, refer to `.env.example` for a template.
8. Run `npm run db:create` to create the database.
9. Run `npm run db:migrate` to migrate models.
10. Run `npm run db:seed` to seed database.
11. Run `npm run dev` to start the development server
