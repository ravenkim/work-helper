# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# 공통 의존성 설치
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 의존성 설치 단계
FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

RUN yarn install --frozen-lockfile

# 빌드 단계
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY . .

RUN corepack enable && corepack prepare yarn@4.9.2 --activate
RUN yarn build

# 실행 단계
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
