# base image
FROM node:10.15.2-stretch

# set working directory
WORKDIR /app
RUN cd /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn install
RUN yarn global add @angular/cli@7.3.9
RUN yarn global add serve

# add app
COPY . /app
RUN ng build --prod="true"

