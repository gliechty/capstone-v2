ARG NODE_IMAGE=node:24-bookworm-slim
FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
ARG RELEASE_ID
ENV NEXT_TELEMETRY_DISABLED=1 CAPSTONE_OFFLINE_TESTS=1
RUN test -n "$RELEASE_ID" && npm run build && mkdir -p public && npm prune --omit=dev --ignore-scripts
FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ARG RELEASE_ID
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 RECOMMENDATION_PROVIDER=disabled
LABEL org.opencontainers.image.revision=${RELEASE_ID}
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/config ./config
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/package.json ./
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/mosaic-browsers
RUN node node_modules/playwright-core/cli.js install --with-deps chromium --only-shell && chmod -R a+rX /opt/mosaic-browsers && rm -rf /var/lib/apt/lists/*
RUN printf '%s\n' 'export default { poweredByHeader: false };' > next.config.mjs
USER node
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
