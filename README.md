# GOAL3 Website

Professional landing page for GOAL3 - Enterprise ACORD AL3 Parser

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run start

# Build for production
npm run build

# Serve production build
npm run serve
```

## Structure

- `src/pages/index.js` - Custom homepage
- `src/pages/viewer.js` - WASM viewer page  
- `docs/api/` - API documentation
- `docs/deployment/` - Deployment guides
- `docs/pricing.md` - Pricing information
- `docs/product/` - Product docs (internal reference only, not in public sidebar)
- `static/viewer/` - WASM viewer assets
- `schemas/` - JSON schemas for API documentation generation

## JSON Schemas

The `schemas/` directory contains JSON schemas that can be used to:
- Generate API documentation from OpenAPI/Swagger specs
- Validate API requests/responses
- Auto-generate code examples

**Note**: Swagger API documentation is available at http://localhost:8080/swagger for reference.

## Key Endpoints

- **v1/parse** - Parse AL3 files to JSON/CSV/Parquet
- **v1/validate** - Validate AL3 files and return detailed errors/warnings

## Deployment

Site is configured for GitHub Pages deployment.

```bash
npm run build
# Upload build/ directory to GitHub Pages
```

## Contact

- Sales: sales@priyaiosystems.com
- Support: support@priyaiosystems.com
