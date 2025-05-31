# EYRA Backend - Railway Deployment

## 🐳 Docker Deployment

This project uses **Docker** for deployment on Railway.

### Files:
- `Dockerfile.production` - Main Docker configuration
- `.railway.toml` - Railway deployment settings
- `railway-start.sh` - Startup script

### Build Command:
```bash
docker build -f Dockerfile.production -t eyra-backend .
```

### Runtime:
- PHP 8.2-CLI
- PostgreSQL
- Built-in PHP server
