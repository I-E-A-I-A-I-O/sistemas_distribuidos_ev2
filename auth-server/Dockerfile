FROM node:16-alpine3.14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY dev ./
COPY tsconfig.json ./
EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]