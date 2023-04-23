#make a docker image from node:alpine DEVELOPMENT MODE

FROM node:alpine As development

#set the working directory

WORKDIR /usr/src/app

#copy the package.json file to the working directory

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

#install globally pnpm

RUN npm install -g pnpm

#install the dependencies
RUN pnpm install -r

#copy the rest of the files to the working directory, only microservice and libs folder

COPY . .


# MAKE A BUILD

RUN pnpm run build payments

#make a docker image from node:alpine production MODE

FROM node:alpine as production

# set NODE_ENV argument that can be override as production
ARG NODE_ENV=production
# set environment variable NODE_ENV to the value of NODE_ENV argument
ENV NODE_ENV=${NODE_ENV}

#set the working directory

WORKDIR /usr/src/app

# copy the package.json file to the working directory

COPY package.json ./
COPY pnpm-lock.yaml ./

# install globally pnpm

RUN npm install -g pnpm

# install the dependencies in production mode (will not install devDependencies!)

RUN pnpm install --prod

# copy from development stage the dist folder to container folder ./dist 

COPY --from=development /usr/src/app/dist ./dist

# ejecuto el comando "node dist/apps/payments/main" de acuerdo al build hecho en stage development
CMD ["node", "dist/apps/payments/main"]



