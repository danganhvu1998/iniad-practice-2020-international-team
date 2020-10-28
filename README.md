#### Introduction
This project is to provide all RESTFUL APIs & do some processes in backend for Shozemi Web Application

It is using:
* ExpressJS, NodeJS, with Sequelize ORM
* MySQL
* https://www.npmjs.com/package/config: organizes hierarchical configurations
* morgan: HTTP request logger middleware
* @hapi/joi: Object schema description language and validator for JavaScript objects
* cron (setup cronjob): https://github.com/kelektiv/node-cron/tree/master/examples

#### Run migration
* Install globally sequelize-cli: https://www.npmjs.com/package/sequelize-cli
* `cd database`
*  Run `sequelize db:migrate --config '../config/default.json' --env database`
*  Run `sequelize db:seed:all --config '../config/default.json' --env database`
*  Example to seed one file: Ex: `sequelize db:seed --seed ./seeders/01-permission.js --config '../config/default.json' --env database`

#### Quick start
* run `npm run docker-dev` to spin up development api and db containers. `nodemon` is then running inside api container watching for source code changes.
* run `npm run clean` to remove all images.
* run `docker exec -it shozemi-api npm install` to install new packages. For example `docker exec -it shozemi-api npm install express --save`.
* on production server, run `npm run docker-prod` to spin up production api and db containers. run `npm stop` to shut down the containers.
* on production server, run `npm stop` to shut down running containers.

#### Verify in local
* use Postman to call api: `http://localhost:3000/api/login`

#### How API work
* Request send to `src/server.js`
  * Then request pass to `src/app.js` to this line 44 in code: `routerManager(app);`
  * Then to `src/routes/index.js`. From here it will import `index` file from controllers (exp: `src/components/auth/index.js`)
  * From `index` function from `validator` and `controller` will be called.
  * Function from `controller` will call function from `service` when need to connect to db (`mysql` and `redis`)

#### How Socket work
* Request send to `src/server.js`
  * Then the request will be sent to `/src/middleware/socket.io/index.js`
  * Each `socker.io` request contain 2 path: `eventName` and `eventData`. Each `eventName` will trigger a function to start. This function will then process the given data in `evenData`
