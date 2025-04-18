FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

RUN npm run build

EXPOSE 8080

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run start"]