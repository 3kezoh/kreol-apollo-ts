FROM node:16.13.1

WORKDIR /usr/kreol

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "./dist/index.js"]