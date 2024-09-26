FROM nginx:1.23.3-alpine as build

LABEL name="mfe-system-examples-shell" \
      description="Shell Micro-Frontend application using Lit + Vite, module federation"

COPY nginx /etc/nginx

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "mfe-system-examples-shell: $COMMIT_SHA" >> /etc/nginx/commit.sha

WORKDIR /usr/static

COPY ./dist .

USER nginx
