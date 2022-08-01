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

_CAA 200722 1111_

![Screenshot 2022-07-19 at 11 10 46 PM](https://user-images.githubusercontent.com/29945147/179785307-4c892933-9a24-48bc-b35f-025247c894a0.png)

## Entity Relation Diagram

_CAA 010822 1300_

![Screenshot 2022-08-01 at 12 56 04 PM](https://user-images.githubusercontent.com/29945147/182075391-d88667c2-923a-4a67-8374-5854ffd29e96.png)
