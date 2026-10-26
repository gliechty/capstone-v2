# Resolve Node 24 base to a tested immutable digest before deployment approval.
ARG NODE_IMAGE=node:24-bookworm-slim
FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
ARG RELEASE_ID
ENV CAPSTONE_BUILD_TARGET=private-preview CAPSTONE_PREVIEW_MODE=synthetic CAPSTONE_OFFLINE_TESTS=1 NEXT_TELEMETRY_DISABLED=1
RUN test -n "$RELEASE_ID" && npm run build && node -e "require('fs').writeFileSync('preview-release.json', JSON.stringify({id:process.argv[1]}))" "$RELEASE_ID"
RUN mkdir -p public && npm prune --omit=dev --ignore-scripts
FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 CAPSTONE_BUILD_TARGET=private-preview CAPSTONE_PREVIEW_MODE=synthetic RECOMMENDATION_PROVIDER=disabled
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next-preview ./.next-preview
COPY --from=build --chown=node:node /app/config ./config
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/package.json /app/preview-release.json ./
COPY --from=build --chown=node:node /app/deploy/preview/entrypoint.mjs ./entrypoint.mjs
RUN printf '%s\n' 'export default { distDir: ".next-preview", poweredByHeader: false };' > next.config.mjs
USER node
EXPOSE 3000
CMD ["node", "entrypoint.mjs"]
