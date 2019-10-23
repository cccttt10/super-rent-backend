## Configure your environment

1. [Install Node LTS](https://nodejs.org/en/download/), which will also install NPM (you should be able to execute `node --version` and `npm --version` on the command line).

2. Clone your repository by running `git clone REPO_URL` on the command line. You get the `REPO_URL` by clicking on the green button on the GitHub repository page.

3. Place the `config.env` file in the project root directory. Do NOT ever share this file with anyone.

## Start the server

Once your environment is configured you need to further prepare the project's tooling and dependencies. In the project directory:

1. `npm install` to download the project's dependencies.

2. `npm run dev` to start the server in development mode.

## Additional scripts

1. `npm run check` to check code styles.

2. `npm run pretty` to fix code styles.

3. `npm run delete` to drop all tables and delete all data from the database.

4. `npm run import` to import all mock data in `src/dev-data/data/` into the database.

## Helpful links

1. [Quick intro to Node.js](https://nodejs.dev/introduction-to-nodejs)

2. NPM package [mysql2](https://www.npmjs.com/package/mysql2) allows us to connect our Node backend with MySQL database. 

3. [JSON Generator – Tool for generating random data](https://www.json-generator.com) 
