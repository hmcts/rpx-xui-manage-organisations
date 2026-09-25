FROM hmctsprod.azurecr.io/base/node:24-alpine AS dependencies
LABEL maintainer="HMCTS Expert UI <https://github.com/hmcts>"

ENV PUPPETEER_SKIP_DOWNLOAD=1 \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 \
  CHROMEDRIVER_SKIP_DOWNLOAD=1 \
  CYPRESS_INSTALL_BINARY=0 \
  PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  PLAYWRIGHT_BROWSERS_PATH=0 \
  SENTRYCLI_SKIP_DOWNLOAD=1 \
  NPM_CONFIG_FUND=false \
  NPM_CONFIG_AUDIT=false \
  NPM_CONFIG_UPDATE_NOTIFIER=false \
  SCARF_ANALYTICS=false

USER root
RUN corepack enable
USER hmcts
WORKDIR /opt/app

COPY --chown=hmcts:hmcts .yarn/ ./.yarn/
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./
COPY --chown=hmcts:hmcts api/package.json ./api/package.json

RUN yarn install --immutable --mode=skip-build

FROM dependencies AS build
WORKDIR /opt/app

COPY --chown=hmcts:hmcts . .

RUN yarn build

FROM hmctsprod.azurecr.io/base/node:24-alpine AS runtime
LABEL maintainer="HMCTS Expert UI <https://github.com/hmcts>"

USER root
RUN corepack enable
USER hmcts
WORKDIR /opt/app

COPY --chown=hmcts:hmcts .yarn/ ./.yarn/
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./
COPY --chown=hmcts:hmcts api/package.json ./api/package.json

RUN yarn workspaces focus rpx-xui-manage-organisations --production && yarn cache clean

COPY --from=build --chown=hmcts:hmcts /opt/app/dist ./dist
COPY --from=build --chown=hmcts:hmcts /opt/app/config ./config

USER hmcts
EXPOSE 3000
CMD [ "yarn", "start" ]
