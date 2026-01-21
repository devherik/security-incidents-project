# -------------------- Build Environment --------------------

FROM node:20-alpine AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/usr/local/bin:${PATH}"

RUN apk add --no-cache git

WORKDIR /app

ARG MODE=production

COPY package*.json ./
COPY tsconfig.json .

RUN npm install --production=false

COPY . .

RUN npm run build

RUN npm prune --production

# -------------------- Runtime Environment --------------------

FROM nginx:1.27-alpine-slim AS production

RUN apk add --no-cache curl

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]