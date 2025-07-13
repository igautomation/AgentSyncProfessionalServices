FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Install Salesforce CLI
RUN npm install -g @salesforce/cli

# Copy package files first for better layer caching
COPY package*.json ./
COPY .npmrc* ./

# Set up GitHub authentication if GITHUB_TOKEN is provided
ARG GITHUB_TOKEN
RUN if [ -n "$GITHUB_TOKEN" ]; then \
    echo "@igautomation:registry=https://npm.pkg.github.com/" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> .npmrc; \
    fi

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Create necessary directories
RUN mkdir -p src/pages tests/pages sessions

# Set environment variables
ENV NODE_ENV=production
ENV CI=true
ENV HEADLESS=true

# Default command
CMD ["npm", "test"]