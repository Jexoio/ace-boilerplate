FROM node:10 as dependencies
WORKDIR /api
ADD ./package.json .
ADD ./yarn.lock .
RUN yarn --frozen-lockfile

FROM node:10
# this is still buggy, ngrok tries to bind to port 4040 before it's released during hot reload
# RUN mkdir /root/.ngrok2 && echo 'web_addr: 0.0.0.0:4040' > /root/.ngrok2/ngrok.yml
WORKDIR /api
COPY . .
ENV PATH=${PATH}:/api/node_modules/.bin
COPY --from=dependencies /api/node_modules /api/node_modules
COPY entrypoint.sh /entrypoint.sh

EXPOSE 3000 4040

ENTRYPOINT [ "/entrypoint.sh" ]
