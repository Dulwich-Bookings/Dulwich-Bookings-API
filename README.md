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

_CAA 140722 0220_

![Screenshot 2022-07-14 at 2 18 27 AM](https://user-images.githubusercontent.com/29945147/178803572-569a7fe8-32f5-4b39-831f-3905bc438eb4.png)

## Entity Relation Diagram

_CAA 190722 0100_

![Screenshot 2022-07-19 at 1 00 42 AM](https://user-images.githubusercontent.com/29945147/179564319-9d187520-45c5-4e74-a377-afe2092654c7.png)
