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
FROM node:12

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

