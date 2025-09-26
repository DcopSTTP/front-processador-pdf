
# Base image
FROM node:20.14.0 as build

# Set working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install serve globally
RUN npm install -g serve

EXPOSE 3029

CMD ["npx", "serve", "-s", "build", "-l", "3029"]








