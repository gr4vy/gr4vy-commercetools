FROM node:alpine

# create root application folder
WORKDIR /common

# copy source code to app folder
COPY . /common

RUN npm install

RUN npm run build