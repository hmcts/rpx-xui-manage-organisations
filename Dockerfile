FROM hmctspublic.azurecr.io/base/node:20-alpine as base
LABEL maintainer = "HMCTS Expert UI <https://github.com/hmcts>"

USER root
RUN corepack enable
USER hmcts

WORKDIR /opt/app

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml tsconfig.json ./
COPY --chown=hmcts:hmcts api/package.json ./api/package.json

RUN yarn install --immutable

FROM base as build

COPY --chown=hmcts:hmcts . .

RUN yarn build

FROM base as runtime
USER hmcts

COPY --from=build /opt/app ./
EXPOSE 3000
CMD [ "yarn", "start" ]
