#################
# Builder image #
#################
FROM node:18-alpine AS build

WORKDIR /code
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN
COPY . .
RUN apk update && apk upgrade && \
    apk add --no-cache python3 make g++ libexecinfo-dev \
# bump npm version
RUN npm i -g npm@8.4
RUN npm ci
ENV NODE_ENV=production
RUN npm run build
RUN npm ci --only=production

####################
# Production image #
####################
FROM node:18-alpine AS production

RUN apk add dumb-init python

EXPOSE 3000
WORKDIR /server
ENV NODE_ENV=production
ADD --chown=node:node https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem .
COPY --chown=node:node --from=build /code/dist ./dist/
COPY --chown=node:node --from=build /code/package.json /code/package-lock.json ./
COPY --chown=node:node --from=build /code/node_modules ./node_modules/

USER node

CMD ["dumb-init", "node", "dist/index.js"]
