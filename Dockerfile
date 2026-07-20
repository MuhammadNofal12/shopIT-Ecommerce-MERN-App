# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# ENV NODE_ENV=DEVELOPMENT

# EXPOSE 4000

# CMD ["npm","run","dev"]


FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Environment
ENV NODE_ENV=development

# Expose backend port
EXPOSE 4000

# Start backend
CMD ["npm", "run", "dev"]