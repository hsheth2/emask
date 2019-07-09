FROM node:8

WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --no-cache --production

COPY . .

HEALTHCHECK \
  CMD curl -f http://localhost/auth/ping || exit 1

CMD ["yarn", "start-prod"]
