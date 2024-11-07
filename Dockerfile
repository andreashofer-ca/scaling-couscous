ARG NODE_VERSION=20.15

FROM fioneer.jfrog.io/fioneer-virtual/node:${NODE_VERSION}-buster-slim AS builder-intermediate

WORKDIR /home/node
COPY package.json package-lock.json tsconfig*.json index.html vite.config.ts ./
RUN --mount=type=secret,id=NPMRC,dst=./.npmrc npm ci

COPY public ./public
COPY src ./src

RUN npm run build

FROM fioneer.jfrog.io/fioneer-virtual/nginx:1.27.2-alpine-slim

ENV PORT=8080

WORKDIR /app

COPY --from=builder-intermediate /home/node/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/log/nginx && \
  chown -R nginx:nginx /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

USER nginx

CMD ["nginx", "-g", "daemon off;"]
