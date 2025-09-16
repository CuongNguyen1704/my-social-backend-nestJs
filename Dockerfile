# Bước 1: chọn base image
FROM node:20-alpine

# Bước 2: thư mục làm việc trong container
WORKDIR /app

# Bước 3: copy package.json trước để cache
RUN apk add --no-cache python3 make g++ && npm install \ && apk del python3 make g++

# Bước 4: cài dependencies
RUN npm install

# Bước 5: copy code còn lại
COPY . .

# Bước 6: expose cổng app chạy
EXPOSE 3000

# Bước 7: lệnh chạy app
CMD ["npm", "start"]
