FROM node:16-alpine AS base

WORKDIR /pass

FROM base AS builder

COPY . ./

RUN apk add git
RUN yarn install
RUN yarn build

FROM base AS runner

COPY --from=builder /pass/node_modules ./node_modules
COPY --from=builder /pass/dist ./dist
COPY server.js ./
COPY package.json ./

CMD ["npm", "run", "serv"]
