FROM node:10.6.0
WORKDIR /cicada
RUN apt update
RUN apt install sudo
RUN apt install -y python 
RUN apt install -y python-pip
RUN pip install requests
RUN git clone https://github.com/krishnasrinivas/wetty.git .
RUN npm i -g yarn
RUN yarn
RUN yarn build
RUN useradd user -d /home/user
WORKDIR /home/user
ARG PASSWORD=password
ENV PASSWORD=$PASSWORD
RUN echo "$PASSWORD\n$PASSWORD" | passwd user
RUN echo "user   ALL = NOPASSWD: ALL" >> /etc/sudoers
ARG TOKEN=token
ENV TOKEN=$TOKEN
RUN export TOKEN=$TOKEN
RUN echo $TOKEN > /cicada/token
COPY ./client/* /bin/
COPY ./questions/* /home/user/
WORKDIR /cicada
CMD ["node", "index.js"]
