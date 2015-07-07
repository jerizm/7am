FROM node:0.12

RUN mkdir -p /web
ADD . /web/
WORKDIR /web
RUN npm install --verbose
RUN chmod +x /web/run.sh

ENTRYPOINT /web/run.sh

EXPOSE 80
