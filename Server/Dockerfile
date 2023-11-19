FROM node:20

WORKDIR /usr/src/api

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENV PORT=3000
ENV MONGODB_URI=mongodb+srv://xander:vZlqfhvOdS5iQgvM@logData.3uhefd0.mongodb.net/log_ingestion?retryWrites=true&w=majority

EXPOSE 3000

CMD ["npm", "start"]