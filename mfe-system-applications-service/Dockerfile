FROM node:20.12.2-alpine as build

ARG COMMIT_SHA=<not-specified>
ENV NODE_ENV=production

WORKDIR /build-dir

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY ./dist ./dist

RUN echo "mfe-system-applications-service: $COMMIT_SHA" >> ./commit.sha

########################################################################################################################

FROM node:20.12.2-alpine

LABEL maintainer="callebe.gomes@cnhind.com" \
      name="mfe-system-applications-service" \
      description="Nodejs express microservice"

ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV LOG_FORMAT=combined
ENV SERVICE_PREFIX=/
ENV HTTP_PORT=3000

WORKDIR /home/node/app

COPY --from=build /build-dir ./

USER node

CMD ["npm", "start"]
