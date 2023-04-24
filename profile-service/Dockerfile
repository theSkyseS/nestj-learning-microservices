FROM base:base As profile

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci \
  && npm install -g @nestjs/cli \
  && npm cache clean -- force \
  && apk del build-dependencies

COPY --chown=node:node . .

USER node

CMD ["npm", "run", "start"]