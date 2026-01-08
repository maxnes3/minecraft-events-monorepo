FROM node:22

RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

EXPOSE 3000
CMD [ "pnpm", "run", "start:dev" ]