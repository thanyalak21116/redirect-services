FROM node:erbium-alpha
LABEL MAINTAINER="Thanat Maneenut <thanat.ma@indexlivingmall.com>"

RUN apk add tzdata
RUN ls /usr/share/zoneinfo

RUN cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime
RUN echo "Asia/Bangkok" >  /etc/timezone
RUN date
RUN apk del tzdata

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# enforce compilation of node-rfc with the current compiler and glibc
# available in the node base image.
# Deny the access to github.com to block download of the prebuilt node binding.
RUN npm install

COPY . .
USER node