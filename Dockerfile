# This Dockerfile is still far from perfect. Until now, for some reason, when build using babel, 
# in file: dist/middleware/auth.js:3 : invar _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"),
# babel is calling itself, and thus we cannot (yet) RUN npm ci --only=production
# Current build docker image size is ~1GB

# Stage 1: build node_modules
FROM node:12 AS nodeModulesBuilder

WORKDIR /tmp_dir

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# RUN npm ci --only=production
RUN npm install

# Stage 2: compile source code
FROM nodeModulesBuilder as sourceCompiler
COPY . .
RUN npm install
RUN npm run build


# Stage 3: copy node_modules and compiled source code
FROM node:10

WORKDIR /usr/src/app

COPY --from=nodeModulesBuilder /tmp_dir/node_modules ./node_modules
COPY --from=sourceCompiler /tmp_dir/dist ./dist
COPY --from=sourceCompiler /tmp_dir/src ./src
COPY --from=sourceCompiler /tmp_dir/package.json ./
COPY --from=sourceCompiler /tmp_dir/config/ ./config/
COPY --from=sourceCompiler /tmp_dir/database/ ./database/
RUN npm i -g sequelize-cli

EXPOSE 3000
ENTRYPOINT ["npm", "start"]






# Create app directory
# WORKDIR /usr/src/app

# COPY ./docker/wait-for-it.sh /
# COPY ./docker/init.sh /

# RUN chmod +x /wait-for-it.sh
# RUN chmod +x /init.sh

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./
# RUN npm install
# RUN npm i -g sequelize-cli
# # If you are building your code for production
# # RUN npm ci --only=production

# COPY . .

# EXPOSE 3000

# CMD /init.sh
