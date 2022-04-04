FROM node:alpine

ENV DEBIAN_FRONTEND=noninteractive NODE_ENV=production

RUN apk add --no-cache \
    jq \
    unzip \
 && npm install --prefix /opt/action @actions/core @actions/github

COPY entrypoint.sh comment.mjs /opt/action/

ENTRYPOINT ["/opt/action/entrypoint.sh"]
