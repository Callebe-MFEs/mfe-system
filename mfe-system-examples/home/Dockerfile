FROM nginx:1.23.3-alpine as build

LABEL name="mfe-system-examples-home" \
      description="Home Micro-Frontend application using Lit + Webpack, module federation and Web Components"

COPY nginx /etc/nginx

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "mfe-system-examples-home: $COMMIT_SHA" >> /etc/nginx/commit.sha

WORKDIR /usr/static

COPY ./dist .

USER nginx
