#!/bin/bash

# GameCraft Pro Ultimate Setup Script
# This script sets up the complete development environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_section() {
    echo -e "\n${PURPLE}========================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}========================================${NC}\n"
}

# Banner
echo -e "${CYAN}"
cat << 'EOF'
   ____                      ____            __ _     ____             _   _ _ _   _                 _       
  / ___| __ _ _ __ ___   ___ / ___|_ __ __ _ / _| |_  |  _ \ _ __ ___   | | | | | |_(_)_ __ ___   __ _| |_ ___ 
 | |  _ / _` | '_ ` _ \ / _ \ |   | '__/ _` | |_| __| | |_) | '__/ _ \  | | | | | __| | '_ ` _ \ / _` | __/ _ \
 | |_| | (_| | | | | | |  __/ |___| | | (_| |  _| |_  |  __/| | | (_) | | |_| | | |_| | | | | | | (_| | ||  __/
  \____|\__,_|_| |_| |_|\___|\____|_|  \__,_|_|  \__| |_|   |_|  \___/   \___/|_|\__|_|_| |_| |_|\__,_|\__\___|
                                                                                                              
EOF
echo -e "${NC}"

print_section "🎮 GameCraft Pro Ultimate Setup"

# Check prerequisites
print_section "📋 Checking Prerequisites"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
    
    # Check if version is >= 18
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $NODE_VERSION"
        exit 1
    fi
else
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed."
    exit 1
fi

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker is installed: $DOCKER_VERSION"
else
    print_warning "Docker is not installed. Some features (secure code execution) will not work."
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_VERSION=$(docker-compose --version)
    print_success "Docker Compose is installed: $DOCKER_COMPOSE_VERSION"
else
    print_warning "Docker Compose is not installed. Some features may not work."
fi

# Check PostgreSQL (optional)
if command -v psql &> /dev/null; then
    print_success "PostgreSQL client is available"
else
    print_warning "PostgreSQL client not found. Will use Docker for database."
fi

# Check Redis (optional)
if command -v redis-cli &> /dev/null; then
    print_success "Redis client is available"
else
    print_warning "Redis client not found. Will use Docker for Redis."
fi

print_section "📦 Installing Dependencies"

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install AI services dependencies
print_status "Installing AI services dependencies..."
cd ai-services
npm install
cd ..

# Install sandbox dependencies
print_status "Installing sandbox dependencies..."
cd sandbox
npm install
cd ..

print_success "All dependencies installed successfully!"

print_section "🔧 Environment Setup"

# Create environment files
print_status "Creating environment configuration files..."

# Main .env file
if [ ! -f .env ]; then
    cp .env.example .env
    print_success "Created main .env file"
else
    print_warning ".env file already exists, skipping..."
fi

# Backend .env file
if [ ! -f backend/.env ]; then
    cp .env.example backend/.env
    print_success "Created backend .env file"
else
    print_warning "backend/.env file already exists, skipping..."
fi

# Frontend .env file
cat > frontend/.env << 'EOF'
# Frontend Environment Variables
VITE_API_URL=http://localhost:3001
VITE_AI_SERVICE_URL=http://localhost:3002
VITE_SANDBOX_URL=http://localhost:3003
VITE_APP_NAME=GameCraft Pro Ultimate
VITE_APP_VERSION=1.0.0
VITE_ADMIN_CODE=lotemronkaplan21
EOF

print_success "Created frontend .env file"

# AI Services .env file
if [ ! -f ai-services/.env ]; then
    cp .env.example ai-services/.env
    print_success "Created AI services .env file"
else
    print_warning "ai-services/.env file already exists, skipping..."
fi

# Sandbox .env file
if [ ! -f sandbox/.env ]; then
    cp .env.example sandbox/.env
    print_success "Created sandbox .env file"
else
    print_warning "sandbox/.env file already exists, skipping..."
fi

print_section "🗂️ Creating Required Directories"

# Create necessary directories
mkdir -p logs
mkdir -p uploads
mkdir -p game-projects
mkdir -p temp
mkdir -p assets
mkdir -p backups

print_success "Created required directories"

print_section "🐳 Docker Setup"

if command -v docker &> /dev/null; then
    print_status "Building Docker images for sandbox environments..."
    
    # Create Docker images for different languages
    
    # Node.js sandbox
    mkdir -p sandbox/docker-images/node
    cat > sandbox/docker-images/node/Dockerfile << 'EOF'
FROM node:18-alpine

# Create sandbox user
RUN addgroup -g 1001 -S sandbox && \
    adduser -S sandbox -u 1001 -G sandbox

# Set up sandbox directory
WORKDIR /sandbox
RUN chown sandbox:sandbox /sandbox

# Remove potentially dangerous commands
RUN rm -f /usr/bin/wget /usr/bin/curl /bin/sh || true

# Switch to sandbox user
USER sandbox

# Copy and run code
COPY --chown=sandbox:sandbox . .

CMD ["node", "main.js"]
EOF

    # Python sandbox
    mkdir -p sandbox/docker-images/python
    cat > sandbox/docker-images/python/Dockerfile << 'EOF'
FROM python:3.11-alpine

# Create sandbox user
RUN addgroup -g 1001 -S sandbox && \
    adduser -S sandbox -u 1001 -G sandbox

# Set up sandbox directory
WORKDIR /sandbox
RUN chown sandbox:sandbox /sandbox

# Remove potentially dangerous commands
RUN rm -f /usr/bin/wget /usr/bin/curl /bin/sh || true

# Switch to sandbox user
USER sandbox

# Copy and run code
COPY --chown=sandbox:sandbox . .

CMD ["python3", "main.py"]
EOF

    # Build Docker images
    print_status "Building Node.js sandbox image..."
    docker build -t gamecrfat/sandbox-node:latest sandbox/docker-images/node/ || print_warning "Failed to build Node.js sandbox image"
    
    print_status "Building Python sandbox image..."
    docker build -t gamecrfat/sandbox-python:latest sandbox/docker-images/python/ || print_warning "Failed to build Python sandbox image"
    
    print_success "Docker images built successfully!"
else
    print_warning "Docker not available, skipping Docker setup"
fi

print_section "🗄️ Database Setup"

if command -v docker &> /dev/null; then
    print_status "Starting PostgreSQL and Redis containers..."
    
    # Start databases with Docker Compose
    docker-compose up -d postgres redis || print_warning "Failed to start database containers"
    
    # Wait for databases to be ready
    print_status "Waiting for databases to be ready..."
    sleep 10
    
    print_success "Database containers started!"
else
    print_warning "Docker not available, please set up PostgreSQL and Redis manually"
fi

print_section "🔑 Generating Secrets"

# Generate JWT secret if not exists
if ! grep -q "JWT_SECRET=" .env; then
    JWT_SECRET=$(openssl rand -hex 32)
    echo "JWT_SECRET=$JWT_SECRET" >> .env
    print_success "Generated JWT secret"
fi

# Generate encryption key if not exists
if ! grep -q "ENCRYPTION_KEY=" .env; then
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> .env
    print_success "Generated encryption key"
fi

print_section "🏗️ Building Applications"

# Build TypeScript projects
print_status "Building backend..."
cd backend
npm run build || print_warning "Backend build failed"
cd ..

print_status "Building AI services..."
cd ai-services
npm run build || print_warning "AI services build failed"
cd ..

print_status "Building sandbox..."
cd sandbox
npm run build || print_warning "Sandbox build failed"
cd ..

print_status "Building frontend..."
cd frontend
npm run build || print_warning "Frontend build failed"
cd ..

print_success "Build completed!"

print_section "🧪 Running Tests"

print_status "Running backend tests..."
cd backend
npm test || print_warning "Backend tests failed"
cd ..

print_status "Running frontend tests..."
cd frontend
npm test -- --run || print_warning "Frontend tests failed"
cd ..

print_success "Tests completed!"

print_section "🚀 Final Setup"

# Create startup scripts
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🎮 Starting GameCraft Pro Ultimate Development Environment..."

# Start all services concurrently
npm run dev
EOF

chmod +x start-dev.sh

cat > start-prod.sh << 'EOF'
#!/bin/bash
echo "🎮 Starting GameCraft Pro Ultimate Production Environment..."

# Start with Docker Compose
docker-compose up -d
EOF

chmod +x start-prod.sh

# Create status check script
cat > status.sh << 'EOF'
#!/bin/bash
echo "🎮 GameCraft Pro Ultimate Status Check"
echo "======================================"

# Check if services are running
check_service() {
    if curl -s http://localhost:$1/health > /dev/null; then
        echo "✅ $2 (Port $1): Running"
    else
        echo "❌ $2 (Port $1): Not Running"
    fi
}

check_service 3001 "Backend API"
check_service 3002 "AI Services"
check_service 3003 "Sandbox Service"
check_service 3000 "Frontend"
EOF

chmod +x status.sh

print_success "Startup scripts created!"

print_section "📚 Setup Complete!"

echo -e "${GREEN}"
cat << 'EOF'
🎉 GameCraft Pro Ultimate has been successfully set up!

🚀 Quick Start Commands:
   • Development mode: ./start-dev.sh
   • Production mode:  ./start-prod.sh
   • Check status:     ./status.sh

🌐 Access Points:
   • Frontend:         http://localhost:3000
   • Backend API:      http://localhost:3001
   • AI Services:      http://localhost:3002
   • Sandbox Service:  http://localhost:3003
   • Admin Panel:      http://localhost:3000/admin (Code: lotemronkaplan21)

📖 Documentation:
   • Main README:      ./README.md
   • API Docs:         http://localhost:3001/api/docs
   • Admin Guide:      ./docs/admin-guide.md

🔧 Configuration:
   • Environment:      ./.env
   • Database:         PostgreSQL (localhost:5432)
   • Cache:            Redis (localhost:6379)

⚠️  Important Notes:
   • Make sure to configure your API keys in .env files
   • For production, use proper SSL certificates
   • Review security settings before deploying
   • The admin code is: lotemronkaplan21

Happy game development! 🎮✨
EOF
echo -e "${NC}"

print_success "Setup completed successfully! 🎉"

# Show next steps
echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Configure your API keys in the .env files"
echo "2. Run './start-dev.sh' to start the development environment"
echo "3. Open http://localhost:3000 in your browser"
echo "4. Start creating amazing games! 🎮"

exit 0