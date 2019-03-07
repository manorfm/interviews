FROM node:8.15.0-alpine
# FROM node:latest

WORKDIR /usr/app

COPY package.json loader.js gulpfile.js .env ./
RUN npm install pm2 -g && npm install --quiet --production

COPY api ./api/
COPY config ./config/
ENV ENV_DATABASE_URL $DATABASE_URL
EXPOSE 3003

CMD [ "pm2-runtime", "loader.js", " --name", "user-service" ]