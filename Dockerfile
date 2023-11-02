FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["sh", "-c", "npx sequelize db:migrate && npm start"]
EXPOSE 3000