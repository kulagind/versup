FROM node:20-alpine

RUN mkdir -p /usr/bin/
WORKDIR /usr/bin

COPY bin/index.js ./

CMD ["node", "index.js"]