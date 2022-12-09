FROM node:19-alpine
RUN npm i -g npm@8.5.1
RUN mkdir -p /app/order
WORKDIR /app/order
COPY package*.json /app/order
RUN npm install
ADD . /app/order
CMD npm run build && npm run start:prod
