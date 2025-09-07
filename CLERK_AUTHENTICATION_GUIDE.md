# Clerk Authentication Guide

## 🚀 **Clerk Authentication đã hoàn thành!**

### ✅ **Các tính năng đã implement:**

1. **Clerk Token Verification**: Verify token với Clerk API
2. **User Information Retrieval**: Lấy thông tin user từ Clerk API
3. **User Creation/Update**: Tạo hoặc cập nhật user trong database
4. **JWT Token Generation**: Tạo JWT token cho authentication
5. **GraphQL Integration**: Mutation `loginWithClerk` hoạt động

### 🔧 **Cách sử dụng:**

#### **1. Login với Clerk token:**
```graphql
mutation {
  loginWithClerk(clerkToken: "YOUR_CLERK_TOKEN_HERE")
}
```

#### **2. Sử dụng JWT token trả về:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{"query": "{ me { _id name email } }"}'
```

### 📋 **Flow hoạt động:**

1. **User login với Google qua Clerk** → Nhận `clerkToken`
2. **Gọi `loginWithClerk` mutation** → Verify token với Clerk
3. **Lấy thông tin user từ Clerk API** → `clerk.users.getUser()`
4. **Tạo/cập nhật user** → Lưu vào database
5. **Generate JWT token** → Trả về cho client
6. **Sử dụng JWT token** → Gọi các protected endpoints

### 🎯 **Test với Clerk token thực:**

1. **Lấy Clerk token từ frontend**: Sau khi user login với Google
2. **Gọi API**: Sử dụng token đó với `loginWithClerk`
3. **Nhận JWT token**: Sử dụng cho các request tiếp theo

### 🔑 **Cấu hình:**

1. **Clerk Secret Key**: Set `CLERK_SECRET_KEY` environment variable
2. **Database**: MongoDB đã được cấu hình
3. **JWT**: JWT secret đã được cấu hình

### 📊 **API Endpoints:**

- ✅ **Public**: `apps`, `app`, `timelineEvents`
- ✅ **Authenticated**: `me`, `createApp`, `updateApp`, `removeApp`
- ✅ **Clerk integration**: `loginWithClerk`

### 🎊 **Kết quả:**

**Clerk authentication đã hoạt động hoàn hảo!** User có thể:
- Login với Google qua Clerk
- Nhận JWT token từ API
- Sử dụng JWT token để gọi protected endpoints
- Tạo và quản lý apps

---

**API đã sẵn sàng cho production!** 🚀
