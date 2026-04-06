FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM base AS builder
WORKDIR /app
COPY .git .git
RUN GIT_SHA=$(cat .git/HEAD | awk '{print $2}' | xargs -I{} cat .git/{} 2>/dev/null || cat .git/HEAD) && \
    echo "${GIT_SHA}" > .git-sha && \
    rm -rf .git
ARG NEXT_PUBLIC_GIT_SHA=unknown
ENV NEXT_PUBLIC_GIT_SHA=${NEXT_PUBLIC_GIT_SHA}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN if [ "$NEXT_PUBLIC_GIT_SHA" = "unknown" ] && [ -f .git-sha ]; then \
      export NEXT_PUBLIC_GIT_SHA=$(cat .git-sha); \
    fi && \
    NEXT_PUBLIC_GIT_SHA=$NEXT_PUBLIC_GIT_SHA npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
