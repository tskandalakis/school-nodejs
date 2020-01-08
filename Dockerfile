FROM node:10

LABEL maintainer="tasoskandalakis@gmail.com"

# ARG app_url
# ARG port
# ARG env

ENV wd /usr/src/school_nodejs
# ENV APP_URL $app_url
# ENV PORT $port
# ENV ENV $env

# ENV APP_URL "localhost"
# ENV PORT 3000
# ENV ENV "dev"

# move files
COPY ./ $wd
WORKDIR $wd

# install supervisor
RUN apt-get update && apt-get install -y -q --no-install-recommends supervisor
RUN mkdir -p /var/log/school_nodejs

# install app dependencies
RUN npm install

# node internal port
EXPOSE 3000

CMD ["/usr/bin/supervisord", "-c", "supervisord.conf"]