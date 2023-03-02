FROM gr4vy/ct-common

# create root application folder
WORKDIR /setup

# copy source code to app folder
COPY . /setup

RUN npm install

RUN npm link ../common

RUN npm run build

EXPOSE 5000

CMD [ "node", "./.build/index.js" ]