FROM denoland/deno:alpine-1.40.0 AS base

WORKDIR /app 

COPY deno.json deno.lock ./ 
COPY packages/ packages/
COPY apps/api/ apps/api/

WORKDIR /app/apps/api

RUN deno cache src/index.ts

EXPOSE 3000

ENV PORT=3000
ENV DENO_ENV=development

CMD ["deno", "run", "--allow-net", "--allow-env", "src/index.ts"]
