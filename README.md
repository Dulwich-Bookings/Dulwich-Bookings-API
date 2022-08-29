# Dulwich Bookings API

The Backend repository for Dulwich Bookings hosted on Heroku. Built with NodeJS, Express, Sequelize, TypeScript, PostgreSQL

## Documentation

- [**Production Link**](https://dulwich-bookings-api.herokuapp.com/)
- [**Documentation Link**]()
- [**Entity Relation Diagram**](https://drawsql.app/butters/diagrams/dcbbookings)

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

## Access Control Flow

_CAA 290822 0400_

![Screenshot 2022-08-03 at 4 07 56 AM](https://user-images.githubusercontent.com/25262042/187090798-42bd1718-659c-4a5a-b780-1d89917e3b84.png)

## Entity Relation Diagram

_CAA 300822 0230_
<img width="1216" alt="Screenshot 2022-08-30 at 2 34 24 AM" src="https://user-images.githubusercontent.com/29945147/187273410-29a9ce06-bb9b-4419-91f5-af0a1825c351.png">


