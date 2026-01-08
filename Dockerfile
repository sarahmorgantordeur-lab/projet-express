# Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Install dependencies in the image (will be overridden by volume but speeds up first run)
RUN npm install && npm rebuild sqlite3

COPY . .

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
