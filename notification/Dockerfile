FROM node:alpine

# create root application folder
WORKDIR /notification

# copy source code to /app folder
COPY . /notification

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "node", "./.build/index.js" ]