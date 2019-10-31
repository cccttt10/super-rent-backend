## Configure your environment

1. [Install Node LTS](https://nodejs.org/en/download/), which will also install NPM (you should be able to execute `node --version` and `npm --version` in your terminal).

2. Clone this repository: `git clone https://github.com/chuntonggao/super-rent-backend.git`

3. Place the `config.env` file in the project root directory. Do NOT ever share this file with anyone.

## Run the server in development mode

Once your environment is configured, in the project root directory:

1. `npm install` to download the project's dependencies.

2. `npm run dev` to start the server in development mode.

##  Database Scripts (BE CAREFUL)

3. `npm run delete` to drop all tables and delete all data from the database.

4. `npm run import` to import all mock data in `src/dev-data/data/` into the database.

