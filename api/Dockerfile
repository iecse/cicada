FROM node:10.14.2-alpine
WORKDIR /usr/src/api
COPY ["package.json", "yarn.lock*", "./"]
RUN npm install --production --silent
COPY . .
CMD ["npm", "start"]