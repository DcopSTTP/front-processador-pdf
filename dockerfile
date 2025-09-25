
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN mkdir -p uploads

EXPOSE 3000 3001

CMD ["npm", "run", "dev"]