# Hướng dẫn sử dụng Docker cho Social Management System

## Tổng quan

Hệ thống Social Management bao gồm:
- **Backend**: Node.js API server (social-management)
- **Frontend**: React application (SocialManagementFE)
- **Database**: MongoDB
- **Reverse Proxy**: Nginx (tùy chọn cho production)

## Cấu trúc Docker

```
trucnv/
├── docker-compose.yml          # File cấu hình chính
├── mongo-init.js              # Script khởi tạo MongoDB
├── .dockerignore              # File loại trừ khi build
├── nginx/
│   └── nginx.conf            # Cấu hình Nginx reverse proxy
├── social-management/
│   └── Dockerfile            # Dockerfile cho backend
└── SocialManagementFE/
    ├── Dockerfile            # Dockerfile cho frontend
    └── nginx.conf           # Cấu hình Nginx cho React app
```

## Cách sử dụng

### 1. Khởi chạy toàn bộ hệ thống

```bash
# Build và chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 2. Chạy từng service riêng lẻ

```bash
# Chỉ chạy database
docker-compose up -d mongodb

# Chạy backend
docker-compose up -d backend

# Chạy frontend
docker-compose up -d frontend
```

### 3. Dừng hệ thống

```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (cảnh báo: sẽ mất dữ liệu)
docker-compose down -v

# Dừng và xóa images
docker-compose down --rmi all
```

### 4. Rebuild services

```bash
# Rebuild tất cả services
docker-compose build --no-cache

# Rebuild service cụ thể
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
```

## Ports và URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Nginx (production)**: http://localhost:80

## Environment Variables

### Backend (.env hoặc trong docker-compose.yml)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/social-management?authSource=admin
SESSION_SECRET=your-super-secret-session-key-change-in-production
CLIENT_URL=http://localhost:3000

# Social Media API Keys
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Production Deployment

### 1. Sử dụng Nginx Reverse Proxy

```bash
# Chạy với profile production
docker-compose --profile production up -d
```

### 2. SSL/HTTPS Setup

1. Tạo thư mục `nginx/ssl/`
2. Đặt SSL certificates vào thư mục:
   - `nginx/ssl/cert.pem`
   - `nginx/ssl/key.pem`
3. Uncomment HTTPS configuration trong `nginx/nginx.conf`
4. Restart nginx service

### 3. Environment Variables cho Production

Tạo file `.env` với các biến môi trường production:

```env
NODE_ENV=production
MONGODB_URI=mongodb://admin:your_secure_password@mongodb:27017/social-management?authSource=admin
SESSION_SECRET=your_very_secure_session_secret
CLIENT_URL=https://yourdomain.com
```

## Monitoring và Health Checks

### Health Check Endpoints

- **Frontend**: http://localhost:3000/health
- **Backend**: http://localhost:5000/api/auth/health
- **Nginx**: http://localhost/health

### Xem trạng thái services

```bash
# Xem health status
docker-compose ps

# Xem logs real-time
docker-compose logs -f

# Xem resource usage
docker stats
```

## Troubleshooting

### 1. MongoDB Connection Issues

```bash
# Kiểm tra MongoDB logs
docker-compose logs mongodb

# Kết nối vào MongoDB container
docker-compose exec mongodb mongosh -u admin -p password123
```

### 2. Backend Issues

```bash
# Kiểm tra backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Vào container để debug
docker-compose exec backend sh
```

### 3. Frontend Issues

```bash
# Kiểm tra frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### 4. Port Conflicts

Nếu có port conflicts, thay đổi ports trong `docker-compose.yml`:

```yaml
ports:
  - "3001:80"  # Thay vì 3000:80
  - "5001:5000"  # Thay vì 5000:5000
```

## Backup và Restore

### Backup MongoDB

```bash
# Backup database
docker-compose exec mongodb mongodump --out /data/backup --db social-management

# Copy backup từ container
docker cp social-management-mongodb:/data/backup ./backup
```

### Restore MongoDB

```bash
# Copy backup vào container
docker cp ./backup social-management-mongodb:/data/

# Restore database
docker-compose exec mongodb mongorestore --db social-management /data/backup/social-management
```

## Performance Optimization

### 1. Resource Limits

Thêm resource limits vào `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### 2. Volume Optimization

```yaml
volumes:
  mongodb_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/to/your/data/directory
```

## Security Considerations

1. **Thay đổi default passwords** trong `docker-compose.yml`
2. **Sử dụng secrets** thay vì environment variables cho sensitive data
3. **Enable SSL/HTTPS** trong production
4. **Regular security updates** cho base images
5. **Network isolation** với custom networks

## Development vs Production

### Development

```bash
# Chạy với development settings
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Production

```bash
# Chạy với production settings
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Useful Commands

```bash
# Xem tất cả containers
docker ps -a

# Xem tất cả images
docker images

# Cleanup unused resources (container/image)
docker system prune -a --volumes -f

# Xem disk usage
docker system df

# Restart tất cả services
docker-compose restart

# Scale services
docker-compose up -d --scale backend=3
``` 