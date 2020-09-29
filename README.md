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
#### Project Structure
* Server starts from bin/www.js
* `src` folder contains all logic code
* `database` folder contains migrations, models & seeders
* `config` folder contains config files, refer to https://github.com/lorenwest/node-config/wiki/Configuration-Files
* `logs` folder contains access log to server

#### Quick start
* run `npm run docker-dev` to spin up development api and db containers. `nodemon` is then running inside api container watching for source code changes.
* run `npm run clean` to remove all images.
* run `docker exec -it shozemi-api npm install` to install new packages. For example `docker exec -it shozemi-api npm install express --save`.
* on production server, run `npm run docker-prod` to spin up production api and db containers. run `npm stop` to shut down the containers.
* on production server, run `npm stop` to shut down running containers.

#### Verify in local
* use Postman to call api: `http://localhost:3000/api/login`

#### Allow connecting to mysql service from host machine
Normally you should not allow connecting to mysql service from host machine. In case you would like to, do the following:
* run `cp docker-compose.override.yml.dev docker-compose.override.yml` to enable port mapping from container to host. By default it binds to port 33060 on host machine.
* then, run `npm run docker-dev`

#### Erase all mysql data
`npm run clean` removes mysql image, but does not remove mysql data saved in `data_dir/`, so you can rebuild images without losing data.

If you want to erease all mysql data, after running `npm run clean`, run `rm -r data_dir/*`

### File-Folder And Where To Find Them

+ File in Docker were defined at `/config/default.json`. But because this is the env inside docker, we hardly able to access them directly. 
+ So to be able to access it, we also define `STORAGE_UPLOAD_PATH` and `LOGS_DIR` in `.env` (or `.env.example`) to link between folder in docker and folder in host system.
+ This link was defined at `docker-compose.yml`
    ```dockerfile
        - ${LOGS_DIR}:/usr/src/app/logs
        - ${STORAGE_UPLOAD_PATH}:/usr/src/app/public
    ```
  + This means:
    + docker folder `/usr/src/app/logs` was linked to host system folder `LOGS_DIR`, which was defined in `.env`
    + docker folder `/usr/src/app/public` was linked to host system folder `STORAGE_UPLOAD_PATH`, which was defined in `.env`