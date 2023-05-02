FROM node:18.14.0 as node
ARG env
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN if [ "$env" = "staging" ] ; then npm run build-staging ; else npm run build ; fi

FROM nginx:latest
COPY --from=node /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
