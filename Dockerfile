FROM node:18.14.1

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
