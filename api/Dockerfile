FROM node:10 as dependencies
WORKDIR /home/api
ADD ./package.json .
ADD ./yarn.lock .
RUN yarn --frozen-lockfile

FROM node:10
# ngrok config
WORKDIR /home/node/.ngrok2
RUN touch ngrok.yml && echo 'web_addr: 0.0.0.0:4040' > ngrok.yml
# node app config
WORKDIR /home/api
ENV PATH=${PATH}:/home/api/node_modules/.bin
COPY --from=dependencies /home/api/node_modules /home/api/node_modules
RUN yarn add ngrok@2
COPY entrypoint.sh /entrypoint.sh

EXPOSE 3000 4040

ENTRYPOINT [ "/entrypoint.sh" ]
