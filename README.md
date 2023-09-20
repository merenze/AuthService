# AuthService

AuthService is a simple authentication built on the Express.
It is meant to be a modular authentication solution that is run in conjunction with other services.

Current features include:
* Register credentials
* Validate a user's email
* Authenticate with registered credentials
* Get the logged-in user
* Get a user by ID
* Reset a user's password

This project is a solo experiment, and the first of a series I plan to build in order to learn Node/Express, API security, and the microservices architecture.

It is currently in the early stages of development.
I am still learning API security best practices.
It goes without saying that this service is not currently fit to be run in a production environment.

## Quick start

To get this project up and running, start by cloning the repository:
```bash
git clone git@github.com:merenze/AuthService.git
```
Add some necessary variables to `.env`:
```
# Used to sign JWTs
JWT_KEY=my_secret_key

# Database settings
DB_DIALECT=mysql
DB_HOST=my_database_host
DB_DATABASE=my_database_name
DB_USER=my_database_username
DB_PASSWORD=my_database_password
```
Run the Sequelize database migrations:
```bash
cd AuthService
npx sequelize-cli db:migrate
```
Build and start the service:
```bash
docker build -t auth .
docker run -dp 3000:3000 auth
```
TODO: API reference documentation

## Contributing
Thank you for your interest in contributing to this project.
However, this is a learning experience for me, so I will remain the sole developer for the forseeable future.
As such, I am not accepting pull requests.
Feel free to report bugs or open issues.
