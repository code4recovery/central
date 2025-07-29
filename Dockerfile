FROM node:18.18.2-slim


WORKDIR /usr/app
COPY ./ /usr/app

# Set up prisma client
RUN npx prisma generate

# Install dependencies and build the project
RUN npm install
RUN npm run build

# Run the web service on container startup
CMD ["npm", "start"]