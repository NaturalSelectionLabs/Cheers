FROM node:16-alpine AS base

WORKDIR /pass

FROM base AS builder

COPY . ./

RUN yarn install
RUN yarn build
RUN rm -rf .git

FROM base AS runner

COPY --from=builder /pass/node_modules ./node_modules
COPY --from=builder /pass/dist ./dist
COPY package.json ./

CMD ["npm", "run", "serv"]
