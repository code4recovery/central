FROM node:17-slim


# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/app
COPY ./ /usr/app

# Set up prisma client
ADD prisma .
RUN npx prisma generate

# Install dependencies and build the project.
RUN npm install
RUN npm run build

# Run the web service on container startup.
CMD ["npm", "start"]