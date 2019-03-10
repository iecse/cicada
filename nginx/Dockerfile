FROM nginx:1.10.3
ADD ./nginx/default.conf /etc/nginx/conf.d/default.conf
ADD ./nginx/proxy-headers.conf /etc/nginx/snippets/proxy-headers.conf
COPY  ./public/* /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]