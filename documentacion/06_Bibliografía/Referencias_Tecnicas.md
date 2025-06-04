# 🔧 Referencias Técnicas - EYRA

> **Documentación técnica, APIs, librerías y herramientas utilizadas en el desarrollo**
> 
> *Última actualización: 01/06/2025*

---

## 🐘 Backend - Symfony & PHP

### Framework Principal
```php
// ! 01/06/2025 - Referencias técnicas backend

Symfony 7.2
├── Documentación oficial: https://symfony.com/doc/7.2/
├── API Reference: https://api.symfony.com/7.2/
├── Best Practices: https://symfony.com/doc/current/best_practices.html
└── Security Guide: https://symfony.com/doc/current/security.html
```

### API Platform
```yaml
# ! 01/06/2025 - Configuración API Platform
api_platform:
  title: 'EYRA API'
  version: '1.0.0'
  description: 'API para aplicación de seguimiento menstrual'
  
Referencias:
  - Documentación: https://api-platform.com/docs/
  - OpenAPI Spec: https://spec.openapis.org/oas/v3.1.0
  - JSON:API: https://jsonapi.org/
```

### Bundles Utilizados
1. **LexikJWTAuthenticationBundle**
   - GitHub: https://github.com/lexik/LexikJWTAuthenticationBundle
   - Docs: https://github.com/lexik/LexikJWTAuthenticationBundle/blob/2.x/Resources/doc/index.md
   - Version: ^2.20

2. **DoctrineBundle**
   - GitHub: https://github.com/doctrine/DoctrineBundle
   - ORM Docs: https://www.doctrine-project.org/projects/orm.html
   - Version: ^2.11

3. **SecurityBundle**
   - Docs: https://symfony.com/doc/current/security.html
   - Voters: https://symfony.com/doc/current/security/voters.html
   - Version: Built-in

4. **ValidatorBundle**
   - Docs: https://symfony.com/doc/current/validation.html
   - Constraints: https://symfony.com/doc/current/reference/constraints.html
   - Version: Built-in

### PHP Extensions
```ini
; ! 01/06/2025 - Extensions PHP requeridas
php_extensions:
  - pdo_pgsql    # PostgreSQL
  - redis        # Cache (futuro)
  - intl         # Internacionalización
  - bcmath       # Cálculos precisos
  - gd           # Manipulación imágenes
  - curl         # HTTP requests
  - json         # JSON handling
  - mbstring     # Multibyte strings
```

---

## ⚛️ Frontend - React & TypeScript

### Framework y Librerías
```typescript
// ! 01/06/2025 - Stack frontend principal

React 19.0.0
├── Docs: https://react.dev/
├── TypeScript: https://www.typescriptlang.org/docs/
├── Hooks Reference: https://react.dev/reference/react
└── DevTools: https://react.dev/learn/react-developer-tools
```

### Build Tools
```json
{
  "vite": {
    "version": "^6.2.0",
    "docs": "https://vitejs.dev/guide/",
    "config": "https://vitejs.dev/config/"
  },
  "typescript": {
    "version": "^5.3.0",
    "handbook": "https://www.typescriptlang.org/docs/"
  }
}
```

### Routing y Estado
1. **React Router DOM v7.5**
   - Docs: https://reactrouter.com/en/main
   - Lazy Loading: https://reactrouter.com/en/main/route/lazy
   - Protected Routes: Custom implementation

2. **Context API (Built-in)**
   - Docs: https://react.dev/reference/react/createContext
   - Patterns: https://react.dev/learn/passing-data-deeply-with-context
   - Implementation: Custom contexts (Auth, Cycle)

### Styling
```css
/* ! 01/06/2025 - Framework de estilos */
Tailwind CSS 4.1
├── Docs: https://tailwindcss.com/docs
├── Components: https://tailwindui.com/
├── Customization: tailwind.config.js
└── Utilities: https://tailwindcss.com/docs/utility-first
```

### HTTP Client
```typescript
// ! 01/06/2025 - Cliente HTTP personalizado
// Ubicación: src/services/httpClient.tsx
// Basado en: Fetch API nativa
// Features:
//   - JWT token management
//   - Request/Response interceptors
//   - Error handling global
//   - TypeScript interfaces
```

---

## 🗄️ Base de Datos - PostgreSQL

### PostgreSQL 16
```sql
-- ! 01/06/2025 - Configuración PostgreSQL
-- Documentación: https://www.postgresql.org/docs/16/
-- Performance: https://wiki.postgresql.org/wiki/Performance_Optimization
-- Backup: https://www.postgresql.org/docs/16/backup.html

Features utilizadas:
├── JSON/JSONB columns (avatar, settings)
├── UUID types (cycle_id)
├── Date/Time types (timezone aware)
├── Enums (profile_type, cycle_phase)
├── Indexes (B-tree, partial)
└── Constraints (foreign keys, check)
```

### Doctrine ORM
```php
// ! 01/06/2025 - ORM Configuration
use Doctrine\ORM\Mapping as ORM;

Referencias:
- Documentation: https://www.doctrine-project.org/projects/orm.html
- Annotations: https://www.doctrine-project.org/projects/doctrine-orm/en/2.17/reference/annotations-reference.html
- Query Builder: https://www.doctrine-project.org/projects/doctrine-orm/en/2.17/reference/query-builder.html
- Migrations: https://www.doctrine-project.org/projects/doctrine-migrations/en/3.7/
```

### Migrations
```bash
# ! 01/06/2025 - Comandos de migración
php bin/console doctrine:migrations:generate
php bin/console doctrine:migrations:migrate
php bin/console doctrine:migrations:diff

# Referencias:
# https://symfony.com/doc/current/doctrine.html#migrations
```

---

## 🐳 DevOps - Docker & Deployment

### Docker Configuration
```dockerfile
# ! 01/06/2025 - Stack de contenedores

Services:
├── nginx:1.25-alpine       # Proxy reverso
├── php:8.2-fpm-alpine     # Backend PHP
├── postgres:16-alpine     # Base de datos
└── node:20-alpine         # Build frontend

Referencias:
- Docker: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Multi-stage builds: https://docs.docker.com/develop/dev-best-practices/
```

### Nginx Configuration
```nginx
# ! 01/06/2025 - Configuración servidor web
# Referencias:
# - https://nginx.org/en/docs/
# - https://www.nginx.com/resources/wiki/start/topics/examples/full/
# - https://symfony.com/doc/current/setup/web_server_configuration.html

server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    
    # API routes
    location /api {
        try_files $uri /index.php$is_args$args;
    }
}
```

---

## 🔒 Seguridad y Autenticación

### JWT (JSON Web Tokens)
```php
// ! 01/06/2025 - Configuración JWT
// Bundle: LexikJWTAuthenticationBundle
// RFC: https://tools.ietf.org/html/rfc7519
// JWT.io: https://jwt.io/

Configuración:
├── Algorithm: RS256
├── TTL: 3600 seconds (1 hour)
├── Refresh: 604800 seconds (7 days)
└── Private/Public Key pair
```

### Security Headers
```yaml
# ! 01/06/2025 - Headers de seguridad
# Referencias OWASP: https://owasp.org/www-project-secure-headers/

headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: SAMEORIGIN
  - X-XSS-Protection: "1; mode=block"
  - Strict-Transport-Security: "max-age=31536000"
  - Content-Security-Policy: "default-src 'self'"
```

### CORS Configuration
```php
// ! 01/06/2025 - Cross-Origin Resource Sharing
// Spec: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// Bundle: NelmioCorsBundle

nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['^https?://localhost(:[0-9]+)?$']
        allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']
        allow_headers: ['Content-Type', 'Authorization']
        expose_headers: ['Link']
        max_age: 3600
```

---

## 📊 Testing y Quality Assurance

### PHPUnit (Backend)
```php
// ! 01/06/2025 - Testing framework backend
// Docs: https://phpunit.de/documentation.html
// Symfony Testing: https://symfony.com/doc/current/testing.html

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

// Test types:
// - Unit tests: Individual classes
// - Integration tests: Database interactions  
// - Functional tests: HTTP requests/responses
// - API tests: Endpoint testing
```

### Jest + React Testing Library (Frontend)
```typescript
// ! 01/06/2025 - Testing frontend
// Jest: https://jestjs.io/docs/getting-started
// RTL: https://testing-library.com/docs/react-testing-library/intro/

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Test types:
// - Component tests: Rendering and behavior
// - Hook tests: Custom hooks logic
// - Integration tests: Component interactions
// - E2E tests: Full user flows (future)
```

### Code Quality Tools
1. **PHP-CS-Fixer**
   - GitHub: https://github.com/PHP-CS-Fixer/PHP-CS-Fixer
   - Rules: PSR-12 + Symfony standards

2. **PHPStan**
   - GitHub: https://github.com/phpstan/phpstan
   - Level: 6 (high strictness)

3. **ESLint**
   - Docs: https://eslint.org/docs/latest/
   - Config: @typescript-eslint/recommended

---

## 🔗 APIs Externas y Servicios

### Futuras Integraciones
```typescript
// ! 01/06/2025 - APIs planificadas para integración

// OpenAI API (Planned)
interface OpenAIConfig {
  endpoint: 'https://api.openai.com/v1/chat/completions';
  model: 'gpt-4';
  docs: 'https://platform.openai.com/docs/api-reference';
}

// SendGrid API (Email notifications)
interface SendGridConfig {
  endpoint: 'https://api.sendgrid.com/v3/mail/send';
  docs: 'https://docs.sendgrid.com/api-reference';
}

// Web Push API (Notifications)
interface WebPushConfig {
  standard: 'https://www.w3.org/TR/push-api/';
  implementation: 'Service Workers + Push Manager';
}
```

---

## 📱 Mobile y PWA (Futuro)

### React Native (Planificado)
```typescript
// ! 01/06/2025 - Stack móvil planificado
// Docs: https://reactnative.dev/docs/getting-started
// Expo: https://docs.expo.dev/

TechStack:
├── React Native 0.73+
├── TypeScript support
├── React Navigation v7
├── AsyncStorage for persistence
├── Push notifications (expo-notifications)
└── Biometric authentication
```

### Progressive Web App
```typescript
// ! 01/06/2025 - PWA Features planificadas
//PWA Docs: https://web.dev/progressive-web-apps/

Features:
├── Service Worker (offline support)
├── Web App Manifest (installable)
├── Push Notifications (Web Push API)
├── Background Sync (data sync offline)
└── Cache API (asset caching)
```

---

## 🛠️ Development Tools

### IDEs y Editores
1. **PhpStorm**
   - Symfony Plugin: https://plugins.jetbrains.com/plugin/7219-symfony-support
   - Database Tools: Built-in
   - Debugging: Xdebug integration

2. **Visual Studio Code**
   - PHP Extensions: PHP Intelephense, PHP Debug
   - React Extensions: ES7+ React/Redux snippets
   - Docker Extension: Microsoft Docker

### Version Control
```bash
# ! 01/06/2025 - Git workflow
# Git Flow: https://nvie.com/posts/a-successful-git-branching-model/
# Conventional Commits: https://www.conventionalcommits.org/

Branches:
├── main (production)
├── develop (integration)
├── feature/* (new features)
├── hotfix/* (urgent fixes)
└── release/* (version releases)
```

### API Testing
1. **Postman**
   - Collections: Organized by feature
   - Environment variables: dev/staging/prod
   - Automation: Newman for CI/CD

2. **Thunder Client** (VS Code)
   - Lightweight alternative
   - Git-friendly collections

---

## 📈 Monitoring y Analytics (Futuro)

### Application Performance Monitoring
```typescript
// ! 01/06/2025 - APM tools planificados

Candidates:
├── New Relic: https://newrelic.com/
├── DataDog: https://www.datadoghq.com/
├── Sentry: https://sentry.io/
└── Symfony Profiler: Built-in development
```

### Business Analytics
```typescript
// ! 01/06/2025 - Analytics planificadas

Options:
├── Google Analytics 4: https://analytics.google.com/
├── Mixpanel: https://mixpanel.com/
├── Amplitude: https://amplitude.com/
└── Custom metrics: Database-driven
```

---

## 🔧 Build y Deploy Tools

### CI/CD Pipeline (Planificado)
```yaml
# ! 01/06/2025 - Pipeline planificado
# GitHub Actions: https://docs.github.com/en/actions

Pipeline:
├── Code quality checks (PHPStan, ESLint)
├── Automated testing (PHPUnit, Jest)
├── Security scanning (Symfony Security Checker)
├── Docker image build
├── Deploy to staging
└── Production deployment (manual approval)
```

### Package Managers
```json
{
  "backend": {
    "composer": "https://getcomposer.org/doc/",
    "packagist": "https://packagist.org/"
  },
  "frontend": {
    "npm": "https://docs.npmjs.com/",
    "yarn": "https://yarnpkg.com/getting-started"
  }
}
```

---

## 📚 Learning Resources

### Tutorials Seguidos
1. **SymfonyCasts**
   - API Platform Course
   - Symfony Security Course
   - Doctrine Relations Course

2. **React Official Tutorial**
   - Tic-Tac-Toe tutorial
   - Thinking in React
   - Context API patterns

3. **Docker for Developers**
   - Multi-container applications
   - Development workflows
   - Production best practices

### Communities y Foros
- **Stack Overflow**: Troubleshooting específico
- **Symfony Slack**: Community support
- **React Discord**: Real-time help
- **Reddit r/webdev**: General discussions

---

## 🎯 Standards y Conventions

### Coding Standards
```php
// ! 01/06/2025 - Estándares de código

PHP:
├── PSR-12 (Extended Coding Style)
├── Symfony Coding Standards
├── DocBlocks completos
└── Type declarations estrictas

TypeScript:
├── Airbnb Style Guide adaptado
├── Prettier formatting
├── Strict TypeScript config
└── Component naming conventions
```

### API Standards
```yaml
# ! 01/06/2025 - Estándares API
# JSON:API: https://jsonapi.org/
# REST: https://restfulapi.net/
# OpenAPI: https://spec.openapis.org/

Standards:
├── RESTful endpoints
├── HTTP status codes (RFC 7231)
├── JSON:API format (API Platform)
├── OpenAPI 3.1 documentation
└── Versioning strategy (URI versioning)
```

---

## 🔍 Debug y Profiling

### Symfony Profiler
```php
// ! 01/06/2025 - Herramientas de debug
// Profiler: https://symfony.com/doc/current/profiler.html
// Debug toolbar: Automatic in dev environment
// Web Debug Toolbar: HTTP requests analysis

Features:
├── Database queries profiling
├── Memory usage tracking  
├── HTTP request/response details
├── Security token information
└── Form validation errors
```

### Browser DevTools
```typescript
// ! 01/06/2025 - Debug frontend
// Chrome DevTools: https://developer.chrome.com/docs/devtools/
// React DevTools: https://react.dev/learn/react-developer-tools

Tools:
├── Network tab (API calls)
├── Application tab (LocalStorage, Cookies)
├── Performance tab (rendering analysis)
├── Console (error logging)
└── React DevTools (component tree)
```

---

*Esta documentación técnica se mantiene actualizada con cada nueva integración o cambio en el stack tecnológico del proyecto EYRA.*