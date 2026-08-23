FROM denoland/deno:debian AS builder

WORKDIR /app

COPY deno.json deno.lock ./ 
COPY packages/ packages/ 
COPY apps/web/ apps/web/

WORKDIR /app/apps/web

RUN deno task build

FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
