# ==============================================================================
# Stage 1: deps — Install production dependencies only
# ==============================================================================
FROM node:20-alpine AS deps

# Install openssl required by Prisma
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install all deps (needed for prisma generate)
RUN npm ci

# Generate Prisma Client for Linux target
RUN npx prisma generate

# ==============================================================================
# Stage 2: builder — Build the Next.js app
# ==============================================================================
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copy installed deps and generated prisma client from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app (production)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ==============================================================================
# Stage 3: runner — Minimal production image
# ==============================================================================
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy package files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma/

# Copy built Next.js app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy custom server
COPY --from=builder /app/server.js ./

# Create uploads directory with correct permissions
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

# Set correct ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Run database migration then start the server
CMD ["node", "server.js"]
