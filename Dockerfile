FROM hmctspublic.azurecr.io/base/node:20-alpine as deps
LABEL maintainer = "HMCTS Expert UI <https://github.com/hmcts>"

USER root
RUN corepack enable
USER hmcts

WORKDIR /opt/app

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml tsconfig.json ./
COPY --chown=hmcts:hmcts api/package.json ./api/package.json

RUN yarn install --immutable

FROM deps as build

COPY --chown=hmcts:hmcts . .

RUN yarn build

FROM hmctspublic.azurecr.io/base/node:20-alpine as runtime
LABEL maintainer = "HMCTS Expert UI <https://github.com/hmcts>"

USER hmcts
WORKDIR /opt/app

COPY --from=deps /opt/app/node_modules ./node_modules
COPY --from=deps /opt/app/api/node_modules ./api/node_modules
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/package.json ./package.json

EXPOSE 3000
CMD [ "node", "./dist/rpx-xui-manage-organisations/api/server.bundle.js" ]
