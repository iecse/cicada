FROM mysql

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

COPY ./sql-scripts/ /docker-entrypoint-initdb.d/