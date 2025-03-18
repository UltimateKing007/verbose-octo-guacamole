# Modern Todo Application

A feature-rich, modern Todo application built with React, Firebase, and Vite. This application includes authentication, real-time updates, drag-and-drop functionality, and PWA support.

## 🚀 Features

- 📱 Responsive design with dark mode support
- 🔐 User authentication with Firebase
- 🔄 Real-time todo synchronization
- 📎 File attachments support
- 🎨 Customizable themes
- ⌨️ Keyboard shortcuts
- 📊 Performance monitoring
- 🔍 Advanced filtering and sorting
- 🎯 Priority levels and categories
- 📅 Due date management

## 🛠️ Tech Stack

- React 18
- Firebase
- Vite
- TypeScript
- Tailwind CSS
- React Router v6
- React Beautiful DnD
- React Hook Form
- Framer Motion
- Headless UI

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment files:
   - Copy `.env.example` to `.env.local` for development
   - Set up `.env.production` for production

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

### Firebase Configuration
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase application ID | ✅ |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement ID | ❌ |

### Application Settings
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | Todo App |
| `VITE_APP_URL` | Application URL | http://localhost:5173 |
| `VITE_API_URL` | API endpoint URL | http://localhost:5173/api |

### Feature Flags
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENABLE_PWA` | Enable PWA support | true |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | false (dev), true (prod) |
| `VITE_ENABLE_NOTIFICATIONS` | Enable push notifications | true |

### Authentication Settings
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_AUTH_COOKIE_SECURE` | Use secure cookies | false (dev), true (prod) |
| `VITE_AUTH_COOKIE_DOMAIN` | Cookie domain | localhost (dev) |
| `VITE_AUTH_COOKIE_EXPIRES` | Cookie expiration (days) | 7 (dev), 30 (prod) |
| `VITE_AUTH_COOKIE_SAMESITE` | SameSite cookie policy | Lax (dev), Strict (prod) |

### Performance Settings
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENABLE_QUERY_DEBUG` | Enable query debugging | true (dev), false (prod) |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | Enable performance monitoring | false (dev), true (prod) |
| `VITE_LOG_LEVEL` | Logging level | debug (dev), error (prod) |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | - |

### Cache Settings
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_CACHE_TTL` | Cache time-to-live (seconds) | 3600 (dev), 7200 (prod) |
| `VITE_CACHE_MAX_ITEMS` | Maximum cache items | 1000 (dev), 10000 (prod) |
| `VITE_CACHE_STRATEGY` | Service worker cache strategy | network-first |

### Todo Settings
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_MAX_TODOS_PER_USER` | Maximum todos per user | 1000 (dev), 5000 (prod) |
| `VITE_ENABLE_TODO_ATTACHMENTS` | Enable file attachments | true |
| `VITE_MAX_ATTACHMENT_SIZE` | Maximum attachment size (bytes) | 5MB (dev), 10MB (prod) |
| `VITE_ALLOWED_ATTACHMENT_TYPES` | Allowed attachment file types | image/jpeg,image/png,image/gif,application/pdf |

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment-Specific Builds
```bash
# Development
npm run dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

### Vercel Deployment
The application is configured for deployment on Vercel with the following features:
- Automatic HTTPS
- Edge Functions
- Asset optimization
- Automatic CI/CD

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use different values for development and production
   - Regularly rotate API keys

2. **Authentication**
   - Use secure cookies in production
   - Implement rate limiting
   - Enable strict CORS policies

3. **File Uploads**
   - Validate file types and sizes
   - Scan for malware
   - Use secure storage

## 📈 Performance Optimization

1. **Build Optimization**
   - Code splitting
   - Tree shaking
   - Asset compression

2. **Runtime Optimization**
   - Service worker caching
   - CDN integration
   - Lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 