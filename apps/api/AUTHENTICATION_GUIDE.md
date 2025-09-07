# Authentication Guide

This guide explains how to use the new JWT-based authentication system with role-based access control.

## Overview

The authentication system has been updated to use:
- **JWT tokens** instead of Clerk OAuth
- **Username/Email + Password** authentication
- **Role-based access control** with three roles: ADMIN, DEVELOPER, VIEWER

## User Roles

- **ADMIN**: Full access to all features
- **DEVELOPER**: Can create, update, and delete apps
- **VIEWER**: Read-only access

## GraphQL Mutations

### Register a new user
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    access_token
    user {
      _id
      email
      username
      name
      role
    }
  }
}
```

Variables:
```json
{
  "input": {
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe",
    "password": "password123",
    "role": "VIEWER"
  }
}
```

### Login
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    access_token
    user {
      _id
      email
      username
      name
      role
    }
  }
}
```

Variables:
```json
{
  "input": {
    "usernameOrEmail": "johndoe", // Can be username or email
    "password": "password123"
  }
}
```

### Change Password
```graphql
mutation ChangePassword($input: ChangePasswordInput!) {
  changePassword(input: $input)
}
```

Variables:
```json
{
  "input": {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }
}
```

## GraphQL Queries

### Get current user
```graphql
query Me {
  me {
    _id
    email
    username
    name
    role
    organizationId
    isActive
    avatar
    lastLoginAt
    createdAt
    updatedAt
  }
}
```

## Using Authentication in Resolvers

### Basic Authentication
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Query(() => String)
@UseGuards(JwtAuthGuard)
async protectedQuery(@Context() context: any): Promise<string> {
  const user = context.req.user;
  return `Hello ${user.name}!`;
}
```

### Role-based Access Control
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Mutation(() => String)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DEVELOPER)
async adminOnlyMutation(): Promise<string> {
  return 'Only admins and developers can access this';
}
```

## HTTP Headers

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

Make sure to set the JWT secret in your environment:
```env
JWT_SECRET=your-super-secret-jwt-key
```

## Password Requirements

- Minimum 6 characters
- Passwords are automatically hashed using bcrypt

## User Schema Changes

The user schema now includes:
- `username`: Unique username field
- `password`: Hashed password field
- Removed `clerkId` field

## Migration Notes

If you have existing users with Clerk, you'll need to:
1. Create new user accounts with username/password
2. Update any frontend code to use the new authentication endpoints
3. Remove Clerk dependencies from your frontend applications
