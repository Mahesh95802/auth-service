FROM alpine:latest

RUN apk add --update nodejs npm

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

# ENV JWT_SECRET=ThisIsTheJWTSecret
# ENV DB_DEV_USER=postgres
# ENV DB_DEV_HOST=auth-db
# ENV DB_DEV_NAME=e2e_auth
# ENV DB_DEV_PASSWORD=postgres
# ENV DB_DEV_PORT=5433
# ENV REDIS_HOST=auth-redis
# ENV REDIS_PORT=6380
# ENV DB_TEST_USER=postgres
# ENV DB_TEST_NAME=e2e_auth
# ENV DB_TEST_HOST=auth-db
# ENV DB_TEST_PORT=5433

# RUN npm run build

CMD ["node", "src/index.js"]