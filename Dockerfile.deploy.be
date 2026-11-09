# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

# IMPORTANT: Docker Hardened Image (DHI) Version Maintenance
# This Dockerfile uses dhi.io/node. Regularly validate and update to the latest DHI versions in the catalog for security and compatibility.

FROM dhi.io/node:24-alpine3.22-dev AS dependencies

# Set working directory
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json* ./
COPY services/api/package.json ./services/api/
COPY packages/types/package.json ./packages/types/

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/usr/local/share/.cache/yarn \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
  if [ -f package-lock.json ]; then \
    npm ci --no-audit --no-fund; \
  else \
    echo "No lockfile found." && exit 1; \
  fi

# ============================================
# Stage 2: Build NestJS application
# ============================================

FROM dhi.io/node:24-alpine3.22-dev AS builder

# Set working directory
WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code and workspace packages
COPY package.json package-lock.json* ./
COPY packages/types ./packages/types
COPY services/api ./services/api

ENV NODE_ENV=production

# Build NestJS application
# If you want to speed up Docker rebuilds, you can cache the build artifacts by adding build caches if needed.
RUN if [ -f package-lock.json ]; then \
    npm --prefix services/api run build; \
  else \
    echo "No lockfile found." && exit 1; \
  fi

# ============================================
# Stage 3: Run NestJS application
# ============================================

FROM dhi.io/node:24-alpine3.22-dev AS runner

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Copy dependencies and built dist bundle from builder stage
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/services/api/dist ./services/api/dist
COPY --from=builder --chown=node:node /app/services/api/package.json ./services/api/package.json

# Switch to non-root user for security best practices
USER node

# Expose port 3001 to allow traffic
EXPOSE 3001

# Start NestJS production server
CMD ["node", "services/api/dist/index.js"]