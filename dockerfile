
# Base image
FROM node:20.14.0 as build

# Set working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

EXPOSE 3029

CMD ["npx", "serve", "-s", "build", "-p", "3029"]




