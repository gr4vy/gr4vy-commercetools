FROM gr4vy/ct-common

# create root application folder
WORKDIR /extension

# copy source code to app folder
COPY . /extension

RUN npm install

RUN npm link ../common

RUN npm run build

EXPOSE 3000

CMD [ "node", "./.build/index.js" ]