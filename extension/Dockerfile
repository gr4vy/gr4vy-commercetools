FROM node:alpine

# create root application folder
WORKDIR /app

# copy source code to /app folder
COPY . /app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "node", "./.build/index.js" ]