# Prophyt Protocol - Indexer

The Prophyt Indexer is a comprehensive blockchain data indexing service and REST API for the Prophyt Protocol. It monitors Sui blockchain events, processes prediction market data, generates NFT portfolio images, and provides a complete API for frontend applications.

## Overview

The indexer serves as the critical infrastructure layer that:
- **Monitors Blockchain Events**: Real-time indexing of Prophyt contract events on Sui
- **Database Management**: Structured storage of markets, bets, users, and protocol data
- **Image Generation**: Dynamic NFT portfolio image creation with Walrus storage integration
- **REST API**: Complete API endpoints for frontend applications
- **Market Data Integration**: External market data from Adjacent API
- **Oracle Services**: Price feeds and market resolution data

## Architecture

### Core Components

#### Event Indexer (`indexer/event-indexer.ts`)
- **Real-time Event Monitoring**: Continuous polling of Sui blockchain events
- **Cursor Management**: Tracks processed events to prevent duplicates
- **Concurrent Processing**: Handles multiple event types simultaneously
- **Error Recovery**: Automatic cursor reset and retry mechanisms

#### Event Handlers (`indexer/prophyt-handler.ts`)
- **Market Events**: MarketCreated, MarketResolved processing
- **Betting Events**: BetPlaced, WinningsClaimed handling
- **NFT Events**: BetProofNFTMinted, WinningProofNFTMinted tracking
- **Yield Events**: YieldDeposited monitoring

#### REST API Server (`server.ts`)
- **Market Endpoints**: Market listing, details, and statistics
- **Betting Endpoints**: Bet tracking, user portfolios, and claims
- **Image Generation**: Dynamic portfolio NFT creation
- **Oracle Data**: Price feeds and market data
- **User Analytics**: Portfolio tracking and performance metrics

### Data Services

#### Market Service (`services/market-service.ts`)
- **Market Seeding**: Integration with Adjacent API for market creation
- **Statistics Tracking**: Volume, odds, and participation metrics
- **Resolution Processing**: Market outcome handling and payout calculations
- **Data Synchronization**: Blockchain to database sync operations

#### Image Generation (`services/portfolio-image-generator.ts`)
- **Dynamic NFT Creation**: Custom portfolio images for bets and winnings
- **Canvas-based Rendering**: High-quality image generation with custom branding
- **Walrus Integration**: Decentralized storage for generated images
- **Template System**: Bet proof and winning proof image templates

#### Walrus Uploader (`services/walrus-uploader.ts`)
- **Decentralized Storage**: Walrus network integration for NFT images
- **HTTP and CLI Support**: Multiple upload methods with fallbacks
- **Image Validation**: Content verification before upload
- **Error Handling**: Robust upload retry mechanisms

### Database Integration

#### Prisma ORM (`db.ts`)
- **Type-safe Database Access**: Full TypeScript integration
- **Connection Management**: Optimized connection pooling
- **Migration Support**: Database schema versioning
- **Query Optimization**: Efficient data retrieval patterns

#### Data Models
- **Markets**: Question, status, outcomes, statistics
- **Bets**: User positions, amounts, claim status
- **Events**: Complete blockchain event history
- **Users**: Portfolio tracking and analytics
- **Protocols**: DeFi integration metadata

## API Endpoints

### Market Endpoints
```
GET  /api/markets                    # List all markets
GET  /api/markets/:marketId          # Get market details
POST /api/markets/seed               # Seed markets from external data
```

### Betting Endpoints
```
GET  /api/bets/:betId                # Get bet details
GET  /api/bets/user/:address         # Get user's bets
GET  /api/bets/market/:marketId      # Get market bets
POST /api/bets/generate-bet-image    # Generate bet NFT image
POST /api/bets/generate-winning-image # Generate winning NFT image
```

### User Endpoints
```
GET  /api/users/:address/bets        # User portfolio
GET  /api/users/:address/stats       # User statistics
```

### Oracle Endpoints
```
GET  /api/oracle/price/latest        # Latest price data
GET  /api/oracle/markets             # Market data feed
```

### Chart Endpoints
```
GET  /api/charts/market/:id          # Market chart data
GET  /api/charts/volume              # Volume analytics
```

## Features

### 1. Real-time Event Processing
- Continuous monitoring of Sui blockchain events
- Sub-second event processing with cursor-based tracking
- Automatic error recovery and retry mechanisms
- Concurrent processing of multiple event streams

### 2. Dynamic NFT Generation
- Custom portfolio images for betting positions
- Winning celebration images with profit calculations
- Walrus integration for decentralized storage
- Professional branding with custom fonts and assets

### 3. Market Data Integration
- External market seeding from Adjacent API
- Real-time odds calculation and updates
- Volume and participation tracking
- Performance analytics and statistics

### 4. Comprehensive API
- RESTful endpoints for all platform functionality
- Pagination and filtering support
- Real-time data synchronization
- Error handling and validation

## Technology Stack

### Core Technologies
- **TypeScript**: Type-safe development environment
- **Node.js**: Server runtime with ES modules
- **Express.js**: REST API framework with middleware
- **Prisma ORM**: Type-safe database access layer
- **PostgreSQL**: Primary database for structured data

### Blockchain Integration
- **@mysten/sui**: Official Sui TypeScript SDK
- **Event Streaming**: Real-time blockchain event monitoring
- **Transaction Processing**: Sui transaction analysis

### Image Processing
- **Canvas**: High-quality image generation
- **Custom Fonts**: Professional typography with StackSans
- **Dynamic Content**: Data-driven image composition
- **Buffer Management**: Efficient image data handling

### External Integrations
- **Walrus Network**: Decentralized blob storage
- **Adjacent API**: Market data and seeding
- **CoinGecko**: Price oracle integration

## Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5433/data

# Sui Network
NETWORK=mainnet|testnet|devnet
PROPHYT_PACKAGE_ID=0x...

# Walrus Storage
WALRUS_CLI_PATH=/path/to/walrus
WALRUS_CONFIG_PATH=~/.config/walrus/client_config.yaml
WALRUS_EPOCHS=5
WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space

# External APIs
ADJACENT_API_KEY=your_adjacent_api_key

# Server
PORT=8000
DEBUG=false
```

### Docker Deployment
The indexer includes Docker Compose configuration for PostgreSQL:
```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_USER: sandworm
      POSTGRES_PASSWORD: 44rfuG5D2
      POSTGRES_DB: data
    ports:
      - "5433:5432"
```

## Development

### Installation
```bash
# Install dependencies
pnpm install

# Set up database
npx prisma migrate dev --name init
npx prisma generate

# Start development server
pnpm dev

# Start indexer
pnpm indexer
```

### Available Scripts
```bash
# Development
pnpm dev                    # Start API server
pnpm indexer               # Start event indexer

# Database
pnpm db:setup:dev          # Initialize database
pnpm db:reset:dev          # Reset database
pnpm db:studio            # Open Prisma Studio

# Data Management
pnpm sync:markets          # Sync markets from blockchain
pnpm backfill:live         # Backfill historical events

# Code Quality
pnpm lint                  # ESLint checking
pnpm format               # Prettier formatting
```

### Testing and Validation
```bash
# Dry run operations
pnpm sync:dry-run          # Test market sync
pnpm backfill:dry-run      # Test event backfill

# Image generation testing
npx tsx test-image-gen.ts  # Test NFT image generation
```

## Deployment

### Production Setup
1. **Database Configuration**: Set up PostgreSQL with proper credentials
2. **Environment Variables**: Configure all required environment variables
3. **Walrus Setup**: Install and configure Walrus CLI or use HTTP API
4. **API Keys**: Set up Adjacent API and other external service keys
5. **Process Management**: Use PM2 or similar for process management

### Monitoring
- **Event Processing**: Monitor cursor advancement and error rates
- **API Performance**: Track response times and error rates
- **Database Health**: Monitor connection pool and query performance
- **Image Generation**: Track Walrus upload success rates

## Security Considerations

- **Input Validation**: Comprehensive validation of all API inputs
- **Rate Limiting**: Protection against API abuse
- **Error Handling**: Secure error messages without sensitive data exposure
- **Database Security**: Parameterized queries and connection security
- **Image Validation**: Content verification before Walrus upload

## Performance Optimization

- **Connection Pooling**: Efficient database connection management
- **Concurrent Processing**: Parallel event stream processing
- **Caching Strategy**: Strategic caching of frequently accessed data
- **Image Optimization**: Efficient canvas rendering and buffer management
- **Pagination**: Large dataset handling with proper pagination

## Future Enhancements

- **WebSocket Support**: Real-time event streaming to clients
- **Advanced Analytics**: Machine learning-powered market insights
- **Enhanced NFTs**: More sophisticated image generation templates
- **Performance Monitoring**: Comprehensive observability and alerting

---

**Version**: 1.0.10  
**License**: Apache-2.0  
**Node.js**: >=18.0.0
