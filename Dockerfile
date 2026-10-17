# syntax=docker/dockerfile:1
# Production image of the website: Next.js standalone server, non-root. See DEPLOY.md.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are inlined into the browser bundle at build time, so they're build arguments
ARG NEXT_PUBLIC_SITE_URL=https://superflats.in
ARG NEXT_PUBLIC_SUPPORT_EMAIL=support@superflats.in
ARG NEXT_PUBLIC_LEGAL_NAME=Superflats
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_SUPPORT_EMAIL=$NEXT_PUBLIC_SUPPORT_EMAIL \
    NEXT_PUBLIC_LEGAL_NAME=$NEXT_PUBLIC_LEGAL_NAME \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
# SUPERFLATS_API_URL (server-side only) is read at runtime; set it in .env next to docker-compose.yml
CMD ["node", "server.js"]
