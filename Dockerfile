FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json (создадим его)
COPY package*.json ./

# Устанавливаем TypeScript глобально
RUN npm install -g typescript && \
    npm install

# Копируем TypeScript файлы
COPY ts/ ./ts/
COPY tsconfig.json .

# Компилируем TypeScript
RUN tsc

FROM nginx:alpine

# Копируем статические файлы
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY images/ /usr/share/nginx/html/images/
COPY --from=builder /app/js/ /usr/share/nginx/html/js/

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]