# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build


# Production stage
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist

RUN pnpm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
