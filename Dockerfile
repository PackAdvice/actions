FROM node:bullseye

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    jq \
    unzip \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /opt/action/

ENTRYPOINT ["/opt/action/entrypoint.sh"]
