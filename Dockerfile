FROM node:10.6.0
WORKDIR /cicada
RUN apt update
RUN apt install sudo
RUN apt install python
RUN git clone https://github.com/krishnasrinivas/wetty.git .
RUN npm i -g yarn
RUN yarn
WORKDIR /cicada
RUN yarn build
RUN useradd user -d /home/user
ARG PASSWORD=password
ENV PASSWORD=$PASSWORD
ARG TOKEN=token
ENV TOKEN=$TOKEN
RUN echo "$PASSWORD\n$PASSWORD" | passwd user
RUN echo "user   ALL = NOPASSWD: ALL" >> /etc/sudoers
COPY ./client /
CMD ["node", "index.js"]
