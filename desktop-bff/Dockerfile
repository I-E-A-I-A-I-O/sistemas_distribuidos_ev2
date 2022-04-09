FROM node:16-alpine3.14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY dev ./
COPY tsconfig.json ./
EXPOSE 3001
CMD [ "npm", "run", "start" ]