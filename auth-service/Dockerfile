FROM node:18-alpine As auth

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN echo >>/etc/apk/repositories \
  "https://mirror.yandex.ru/mirrors/alpine/v3.17/main/" \ 
  && apk add --no-cache --virtual build-dependencies \
  python3 make g++ \
  && npm ci --omit=dev\
  && npm install -g @nestjs/cli \
  && npm cache clean -- force \
  && apk del build-dependencies

COPY --chown=node:node . .

USER node

ENV PORT=${AUTH_PORT:-5001}
EXPOSE $PORT

CMD ["npm", "run", "start"]
