FROM homeassistant/amd64-base:latest

# Add env
ENV LANG C.UTF-8
ENV CHROME_BIN="/usr/bin/chromium-browser"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

WORKDIR /app

COPY . .
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    build-base \
    nodejs \
    npm \
    udev \
    ttf-freefont \
    chromium 

RUN npm install

RUN npm start
CMD tail -f /dev/null