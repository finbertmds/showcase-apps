# 📮 Postman Collection Guide - Showcase Apps API

## 🚀 Cách sử dụng

### 1. Import Collection vào Postman
1. Mở Postman
2. Click **Import** button
3. Chọn file `postman-collection.json`
4. Collection sẽ được import với tên "Showcase Apps API"

### 2. Cấu hình Environment Variables
Tạo environment mới với các variables:
- `baseUrl`: `http://localhost:4000` (API server)
- `webUrl`: `http://localhost:3000` (Web app)

### 3. Các nhóm requests

## 📋 **Public Queries** (Không cần authentication)

### ✅ **Có thể test ngay:**
- **Get All Apps** - Lấy danh sách tất cả apps
- **Get Apps with Filters** - Lấy apps với bộ lọc
- **Get Timeline Apps** - Lấy apps cho timeline
- **Get Timeline Events** - Lấy timeline events
- **Get Organizations** - Lấy danh sách organizations

### ⚠️ **Cần thay đổi ID:**
- **Get App by ID** - Thay `YOUR_APP_ID_HERE` bằng ID thực
- **Get App by Slug** - Thay `my-awesome-app` bằng slug thực
- **Get Timeline Events by App** - Thay `YOUR_APP_ID_HERE`
- **Get Media by App** - Thay `YOUR_APP_ID_HERE`

## 🔐 **Protected Queries** (Cần JWT Token)

### Cách lấy JWT Token:
1. Sử dụng **Login with Clerk** mutation
2. Thay `YOUR_CLERK_TOKEN_HERE` bằng Clerk token thực
3. Copy JWT token từ response
4. Thay `YOUR_JWT_TOKEN_HERE` trong các protected requests

### Requests cần JWT:
- **Get Current User (Me)**
- **Get All Users (Admin Only)**
- **Get User by ID**

## ⚡ **Mutations** (Cần JWT Token)

### App Management:
- **Create App** - Tạo app mới
- **Update App** - Cập nhật app
- **Delete App** - Xóa app

### Timeline Events:
- **Create Timeline Event** - Tạo timeline event

### Media:
- **Upload Media** - Upload media files

### User Management (Admin Only):
- **Update User** - Cập nhật thông tin user

## 🌐 **Public Mutations** (Không cần authentication)

- **Increment App View** - Tăng view count
- **Increment App Like** - Tăng like count
- **Login with Clerk** - Đăng nhập với Clerk

## 🔧 **Test Cases**

### 1. Test Basic Functionality
```bash
# 1. Test health check
GET http://localhost:4000/health

# 2. Test basic query
POST http://localhost:4000/graphql
{
  "query": "{ apps { _id title slug } }"
}
```

### 2. Test with Filters
```bash
POST http://localhost:4000/graphql
{
  "query": "query GetApps($platforms: [String!]) { apps(platforms: $platforms) { _id title } }",
  "variables": { "platforms": ["web"] }
}
```

### 3. Test Web Proxy
```bash
POST http://localhost:3000/api/graphql
{
  "query": "{ apps { _id title slug } }"
}
```

## 📊 **Expected Responses**

### Success Response:
```json
{
  "data": {
    "apps": [
      {
        "_id": "app_id",
        "title": "App Name",
        "slug": "app-slug"
      }
    ]
  }
}
```

### Error Response:
```json
{
  "errors": [
    {
      "message": "Error description",
      "locations": [{"line": 1, "column": 1}],
      "path": ["fieldName"]
    }
  ],
  "data": null
}
```

## 🎯 **Quick Test Sequence**

1. **Health Check** → Should return 200
2. **Get All Apps** → Should return empty array `[]`
3. **Get Timeline Apps** → Should return empty array `[]`
4. **Get Organizations** → Should return empty array `[]`
5. **Get Timeline Events** → Should return empty array `[]`

## 🔍 **Debugging Tips**

### Common Issues:
1. **Connection refused** → Check if API server is running on port 4000
2. **GraphQL errors** → Check query syntax and variable types
3. **Authentication errors** → Verify JWT token is valid
4. **Empty responses** → Normal for new database, try creating data first

### Useful Queries for Testing:
```graphql
# Get schema information
{
  __schema {
    types {
      name
    }
  }
}

# Get specific type info
{
  __type(name: "AppDto") {
    fields {
      name
      type {
        name
      }
    }
  }
}
```

## 📝 **Notes**

- Tất cả timestamps sử dụng ISO 8601 format
- IDs sử dụng MongoDB ObjectId format
- Arrays không được null (sử dụng `[String!]` thay vì `[String]`)
- JWT tokens có thời hạn, cần refresh khi hết hạn

## 🚀 **Next Steps**

1. Test tất cả public endpoints
2. Set up authentication để test protected endpoints
3. Tạo sample data để test queries với filters
4. Test error handling với invalid inputs
