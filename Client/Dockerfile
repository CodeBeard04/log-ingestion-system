FROM node:20

WORKDIR /usr/src/client

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]