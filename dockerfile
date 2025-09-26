
# Base image
FROM node:22.14.0 as build

# Set working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

EXPOSE 3000 3001

CMD ["npm", "run", "dev"]
