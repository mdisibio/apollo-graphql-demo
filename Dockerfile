FROM node:8-alpine
WORKDIR /home/node/app

COPY package*.json ./
RUN npm install --quiet
COPY . .

USER node

CMD ["npm", "start"]