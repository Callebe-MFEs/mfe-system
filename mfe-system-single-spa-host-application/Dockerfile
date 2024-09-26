FROM nginx:1.23.3-alpine as build

LABEL name="mfe-system-single-spa-host-application" \
      description="Micro-Frontend System Single SPA Host Application"

COPY nginx /etc/nginx

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "mfe-system-single-spa-host-application: $COMMIT_SHA" >> /etc/nginx/commit.sha

WORKDIR /usr/static

COPY ./dist .

# Gives nginx permission to write in the folder
RUN chmod o+rw /usr/static

USER nginx

# replace env vars into environment.template.json and writes it into environment.json
CMD ["/bin/sh", "-c", "envsubst < environment.template.json > environment.json && exec nginx -g 'daemon off;'"]
