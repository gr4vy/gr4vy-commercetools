FROM gr4vy/ct-common

# create root application folder
WORKDIR /notification

# copy source code to app folder
COPY . /notification

RUN npm install

RUN npm link ../common

RUN npm run build

EXPOSE 3000

CMD [ "node", "./.build/index.js" ]