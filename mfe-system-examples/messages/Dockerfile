FROM nginx:1.23.3-alpine as build

LABEL name="mfe-system-examples-messages" \
      description="Messages Micro-Frontend application using React + Vite, module federation and Web Components"

COPY nginx /etc/nginx

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "mfe-system-examples-messages: $COMMIT_SHA" >> /etc/nginx/commit.sha

WORKDIR /usr/static

COPY ./dist .

USER nginx
