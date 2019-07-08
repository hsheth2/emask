FROM node:8 as builder

WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --no-cache --production

COPY . .
RUN yarn build

FROM nginx

RUN apt-get update && apt-get install -y curl

COPY --from=builder /app/build /usr/share/nginx/html/

HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

# CMD inherited from nginx
