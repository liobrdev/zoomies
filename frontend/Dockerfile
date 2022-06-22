FROM node:lts-alpine@sha256:9da65f99264be2a78682095c4789b3d8cab12e0012def7d937d7125ed6e7695c AS compiler
RUN apk add --no-cache libc6-compat
WORKDIR /client
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV NEXT_PUBLIC_API_URL /api
RUN npm run build

FROM node:lts-alpine@sha256:9da65f99264be2a78682095c4789b3d8cab12e0012def7d937d7125ed6e7695c AS cleanup
WORKDIR /client
COPY --from=compiler /client/.next ./.next
COPY --from=compiler /client/public ./public
COPY --from=compiler /client/package.json ./package.json
COPY --from=compiler /client/package-lock.json ./package-lock.json
RUN npm install --omit=dev

FROM node:lts-alpine@sha256:9da65f99264be2a78682095c4789b3d8cab12e0012def7d937d7125ed6e7695c AS runner
WORKDIR /client
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=cleanup --chown=nextjs:nodejs /client ./
EXPOSE 3000
