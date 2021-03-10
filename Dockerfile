FROM node:12 as builder
ADD package.json /
RUN npm install
ADD src /src
ADD webpack /webpack
ADD postcss.config.js /postcss.config.js
ADD public /public
ADD .babelrc /
RUN npm run build

FROM nginx:1.9
COPY --from=builder /build /var/www/html/
COPY bravia.nginx.conf /etc/nginx/conf.d/
