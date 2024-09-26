FROM nginx:1.23.3-alpine as build

LABEL name="mfe-system-applications-mfe" \
      description="Micro-Frontend application using angular to manage the registration of Micro-Frontend applications"

COPY nginx /etc/nginx

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "mfe-system-applications-mfe: $COMMIT_SHA" >> /etc/nginx/commit.sha

WORKDIR /usr/static

COPY ./dist/applications .

# Gives nginx permission to write in the folder
RUN chmod o+rw /usr/static
RUN chmod o+rw /usr/static/assets

USER nginx

# replace env vars into environment.template.json and writes it into environment.json
CMD ["/bin/sh", "-c", "envsubst < assets/environment.template.json > assets/environment.json && exec nginx -g 'daemon off;'"]
