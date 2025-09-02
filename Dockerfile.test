FROM node:22-alpine

WORKDIR /app

COPY package*.json .
RUN npm install
RUN npx playwright install --with-deps 

COPY . .

CMD ["npm", "run", "test:e2e"]
