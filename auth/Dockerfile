FROM node:19-alpine
WORKDIR /app/auth
COPY package*.json /app/auth
RUN npm install
ADD . /app/auth
RUN npm run build
RUN npm install pm2 -g
CMD ["pm2-runtime","dist/index.js"]
