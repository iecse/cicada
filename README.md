# Cicada

Start application with
```
docker-compose up
```

In detached mode
```
docker-compose up -d
```

Work with particular services
```
docker-compose up servicename
docker-compose restart servicename
```

When you make changes to files you have to rebuild the images
```
docker-compose up --build
```

To stop all containers
```
docker-compose down
```

View stats of running containers
```
docker stats
```

View running containers
```
docker ps
```

List containers, images, volumes, networks
```
docker container ls -a
docker image ls -a
docker volume ls
docker network ls
```

To access the shell from a running container
```
docker exec -it <container-id> /bin/bash
```