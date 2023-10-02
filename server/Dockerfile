FROM node:18.16.1
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 9001
CMD ["nodemon","server.js"]
