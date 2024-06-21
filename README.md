# Cloud SQL Database Configuration and API Endpoint Setup
The Do-You application utilizes a Cloud SQL database to store all data accessed by users. We built this database using Prisma. Additionally, we created endpoints using the Express and Flask frameworks for user registration and login, as well as career and course recommendations, which are the main features of the Do-You application.

Here's how we use **Cloud SQL database** and **create API Endpoints** in our project.
- **SQL Database Configuration Using Prisma**
  - Install Prisma and initialize the Prisma project.
  - Configure the Cloud SQL database connection in the `prisma.schema` file, and create the database schema including the tables and attributes required by the application.
  - Create database migrations based on the `prisma.schema` file configuration.
  - Generate the Prisma Client to interact with the database.

- **Endpoint Creation Using Express Framework**
  - Install Node.js and initialize the project to create the `package.json` file.
  - The `package.json` file contains a list of dependencies needed by the Node.js project.
  - Install the Express framework.
  - Create a JavaScript file `app.js` as the main file of the Express application and configure Express.
  - Create servers in the `app.js` file.
  - Create handlers for user registration and login processes in `UserHandler.js`, as well as authentication in `AuthHandler.js`.
  - Create `jwtUtils.js` to generate and verify tokens for user authentication needs, and an `AuthMiddleware` for middleware.
  - Create routers to manage application endpoints accessible by users.

- **Endpoint Creation Using Flask Framework**
  - Initialize the Flask project and activate the virtual environment.
  - Install the Flask framework and create the application in the `app.py` file.
  - The `app.py` file contains the application endpoint settings for career and course recommendations.
  - Create a `requirements.txt` file that lists the dependencies needed.

- **Deploying the Backend Service**
  - Configure `.env` to store sensitive information such as database credentials, API keys, or other environment settings that need to be stored securely and should not be exposed in the public repository.
  - Configure the `Dockerfile` for deploying the application to Cloud Run.
  - The `Dockerfile` contains important information to configure the Docker container, including the base image, copying application files, installing dependencies, specifying the application port, and the command to run the Node.js application.
