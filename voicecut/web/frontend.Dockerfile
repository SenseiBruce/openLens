FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

EXPOSE 5173

# Run the frontend dev server exposing to network
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
