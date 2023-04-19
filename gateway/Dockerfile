FROM base:base As gateway

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci \
  && npm install -g @nestjs/cli \
  && npm cache clean -- force \
  && apk del build-dependencies

COPY --chown=node:node . .

USER node

ENV PORT=${GATEWAY_PORT:-5000}
EXPOSE $PORT

CMD ["npm", "run", "start"]