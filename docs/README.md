# Postman setup

1. Import

- `Dulwich-Bookings-API.postman_collection.json`
- `Dulwich-Bookings-API.postman_environment_DEV.json`
- `Dulwich-Bookings-API.postman_environment_PROD.json`

# Postman testing steps

1. Select your prefered postman environment (Dev or Prod).  
   ![image](https://user-images.githubusercontent.com/50147457/141607992-b1585baa-a887-42e9-98f3-937cc7941002.png)
2. Run `Login User` in `Authentication` to get the `accessToken`, the token will be automatically set to your environment so all APIs that require authentication will be able to use it.

3. Run your desired API.
