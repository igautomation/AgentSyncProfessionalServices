FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Install Salesforce CLI
RUN npm install -g @salesforce/cli

# Copy project files first
COPY . .

# Install dependencies (skip postinstall script)
RUN npm ci --legacy-peer-deps --ignore-scripts

# Create necessary directories
RUN mkdir -p src/pages tests/pages sessions

# Set environment variables
ENV NODE_ENV=production
ENV CI=true
ENV HEADLESS=true

# Default command
CMD ["npm", "test"]