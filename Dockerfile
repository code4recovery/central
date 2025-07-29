FROM node:18.18.2-slim

# Install system dependencies
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app
COPY ./ /usr/app

# Set up prisma client (after system packages installed)
RUN npm install
RUN npx prisma generate

# Build your project
RUN npm run build

# Run the web service on container startup
CMD ["npm", "start"]
