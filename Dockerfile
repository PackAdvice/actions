FROM node:bullseye

ENV DEBIAN_FRONTEND=noninteractive NODE_ENV=production

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    jq \
    unzip \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/* \
 && npm install --prefix /opt/action @actions/core @actions/github

COPY entrypoint.sh comment.mjs /opt/action/

ENTRYPOINT ["/opt/action/entrypoint.sh"]
