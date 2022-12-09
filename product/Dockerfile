FROM node:19-alpine
RUN npm i -g npm@8.5.1
RUN mkdir -p /app/product
WORKDIR /app/product
COPY package*.json /app/product
RUN npm install
ADD . /app/product
CMD npm run build && npm run start:prod
