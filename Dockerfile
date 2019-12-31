# base image
FROM node:12.13.0-stretch

# set working directory
WORKDIR /app
RUN cd /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json ./package.json
RUN yarn install
RUN yarn global add serve
RUN yarn global add @angular/cli

# add app
COPY . /app
RUN ng build --prod="true" --output-path=dist

