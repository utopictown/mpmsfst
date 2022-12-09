FROM node:19-alpine
RUN mkdir -p /app/gateway
WORKDIR /app/gateway
COPY package*.json /app/gateway
RUN npm install
ADD . /app/gateway
CMD npm run build && npm run start:prod
