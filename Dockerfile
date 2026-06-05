FROM hmctsprod.azurecr.io/base/node:20-alpine AS base
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

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml tsconfig.json ./

RUN yarn

FROM base AS build

COPY --chown=hmcts:hmcts . .

RUN yarn build

FROM base AS runtime
COPY --from=build --chown=hmcts:hmcts $WORKDIR/dist ./dist
COPY --from=build --chown=hmcts:hmcts $WORKDIR/config ./config
USER hmcts
EXPOSE 3000
CMD [ "yarn", "start" ]
