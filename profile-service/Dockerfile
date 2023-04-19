FROM base:base As profile

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci \
  && npm install -g @nestjs/cli \
  && npm cache clean -- force \
  && apk del build-dependencies

COPY --chown=node:node . .

USER node

ENV PORT=${PROFILE_PORT:-5002}
EXPOSE $PORT

CMD ["npm", "run", "start"]