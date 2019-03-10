FROM node:10.6.0
WORKDIR /cicada
RUN apt update
RUN apt install sudo
RUN git clone https://github.com/krishnasrinivas/wetty.git .
RUN npm i -g yarn
RUN yarn
WORKDIR /cicada/src/server
WORKDIR /cicada
RUN yarn build
RUN useradd user -d /home/user
ARG PASSWORD=password
ENV PASSWORD=$PASSWORD
RUN echo "$PASSWORD\n$PASSWORD" | passwd user
RUN echo "user   ALL = NOPASSWD: ALL" >> /etc/sudoers
CMD ["node", "index.js"]
