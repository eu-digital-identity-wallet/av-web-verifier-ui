# builder
FROM node:21-alpine as builder

WORKDIR /app
COPY . .

RUN ls -ltr
RUN npm config set legacy-peer-deps true
RUN npm i
RUN npm run build && npm prune --production
RUN find /app

## final image, use nginx to serve
FROM nginx:alpine3.18-slim as final
#USER node:node
WORKDIR /usr/share/nginx/html
## copying build output
COPY --from=builder /app/dist ./

# create nginx config (redirect /page to page.html etc.)
RUN echo -e  "server {\n\
    listen       80;\n\
    server_name  localhost;\n\
    \n\
    location / {\n    \
    root   /usr/share/nginx/html;\n    \
    index  index.html index.htm;\n    \
    try_files \$uri \$uri.html /\$uri /index.html;\n\
    }\n\
    }\n" > /etc/nginx/conf.d/default.conf
