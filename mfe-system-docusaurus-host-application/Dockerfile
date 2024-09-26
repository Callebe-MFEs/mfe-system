
FROM nginx:1.23.3-alpine as build

LABEL name="mfe-system-docusaurus-host-application" \
      description="Docusaurus Host application using Single SPA"

COPY nginx /etc/nginx

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "mfe-system-docusaurus-host-application: $COMMIT_SHA" >> /etc/nginx/commit.sha

WORKDIR /usr/static

COPY ./build .

USER nginx
