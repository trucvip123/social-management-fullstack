// Script khởi tạo MongoDB
db = db.getSiblingDB('social-management');

// Tạo user cho database social-management
db.createUser({
  user: 'social_user',
  pwd: 'social_password',
  roles: [
    {
      role: 'readWrite',
      db: 'social-management'
    }
  ]
});

// Tạo collections cơ bản
db.createCollection('users');
db.createCollection('posts');
db.createCollection('sessions');

// Tạo indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.posts.createIndex({ "userId": 1 });
db.posts.createIndex({ "createdAt": -1 });
db.sessions.createIndex({ "expires": 1 }, { expireAfterSeconds: 0 });

print('MongoDB đã được khởi tạo thành công!'); 