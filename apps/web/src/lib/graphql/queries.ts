import { gql } from '@apollo/client';

export const GET_APPS = gql`
  query GetApps(
    $status: String
    $visibility: String
    $platforms: [String!]
    $tags: [String!]
    $search: String
    $organizationId: String
    $limit: Int
    $offset: Int
  ) {
    apps(
      status: $status
      visibility: $visibility
      platforms: $platforms
      tags: $tags
      search: $search
      organizationId: $organizationId
      limit: $limit
      offset: $offset
    ) {
      id
      title
      slug
      shortDesc
      longDesc
      status
      visibility
      releaseDate
      platforms
      languages
      tags
      website
      repository
      demoUrl
      downloadUrl
      appStoreUrl
      playStoreUrl
      viewCount
      likeCount
      createdAt
      updatedAt
      createdBy
      createdByUser {
        id
        name
        email
      }
      organizationId
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_TIMELINE_APPS = gql`
  query GetTimelineApps($limit: Int, $offset: Int) {
    timelineApps(limit: $limit, offset: $offset) {
      id
      title
      slug
      shortDesc
      longDesc
      status
      visibility
      releaseDate
      platforms
      languages
      tags
      website
      repository
      demoUrl
      downloadUrl
      appStoreUrl
      playStoreUrl
      viewCount
      likeCount
      createdAt
      updatedAt
      createdBy
      createdByUser {
        id
        name
        email
      }
      organizationId
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_APP_BY_SLUG = gql`
  query GetAppBySlug($slug: String!) {
    appBySlug(slug: $slug) {
      id
      title
      slug
      shortDesc
      longDesc
      status
      visibility
      releaseDate
      platforms
      languages
      tags
      website
      repository
      demoUrl
      downloadUrl
      appStoreUrl
      playStoreUrl
      viewCount
      likeCount
      createdAt
      updatedAt
      createdBy
      createdByUser {
        id
        name
        email
      }
      organizationId
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_APP_BYID = gql`
  query GetAppById($id: String!) {
    app(id: $id) {
      id
      title
      slug
      shortDesc
      longDesc
      status
      visibility
      releaseDate
      platforms
      languages
      tags
      website
      repository
      demoUrl
      downloadUrl
      appStoreUrl
      playStoreUrl
      viewCount
      likeCount
      createdAt
      updatedAt
      createdBy
      createdByUser {
        id
        name
        email
      }
      organizationId
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_TIMELINE_EVENTS = gql`
  query GetTimelineEvents($limit: Int, $offset: Int) {
    timelineEvents(limit: $limit, offset: $offset) {
      id
      appId
      title
      description
      type
      date
      isPublic
      version
      url
      metadata
      createdBy {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TIMELINE_EVENTS_BY_APP = gql`
  query GetTimelineEventsByApp($appId: String!, $isPublic: Boolean) {
    timelineEventsByApp(appId: $appId, isPublic: $isPublic) {
      id
      title
      description
      type
      date
      isPublic
      version
      url
      metadata
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const GET_MEDIA_BY_APP = gql`
  query GetMediaByApp($appId: String!) {
    mediaByApp(appId: $appId) {
      id
      type
      url
      filename
      originalName
      mimeType
      size
      width
      height
      order
      isActive
      meta
      uploadedBy
      createdAt
      updatedAt
    }
  }
`;

export const INCREMENT_APP_VIEW = gql`
  mutation IncrementAppView($id: String!) {
    incrementAppView(id: $id)
  }
`;

export const INCREMENT_APP_LIKE = gql`
  mutation IncrementAppLike($id: String!) {
    incrementAppLike(id: $id)
  }
`;

export const CREATE_APP = gql`
  mutation CreateApp($input: CreateAppInput!) {
    createApp(input: $input) {
      id
      title
      slug
      shortDesc
      longDesc
      status
      visibility
      releaseDate
      platforms
      languages
      tags
      website
      repository
      demoUrl
      downloadUrl
      appStoreUrl
      playStoreUrl
      viewCount
      likeCount
      createdAt
      updatedAt
      createdBy
      createdByUser {
        id
        name
        email
      }
      organizationId
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const UPDATE_APP = gql`
  mutation UpdateApp($id: String!, $input: UpdateAppInput!) {
    updateApp(id: $id, input: $input) {
      id
      title
      slug
      shortDesc
      longDesc
      status
      visibility
      releaseDate
      platforms
      languages
      tags
      website
      repository
      demoUrl
      downloadUrl
      appStoreUrl
      playStoreUrl
      viewCount
      likeCount
      createdAt
      updatedAt
      createdBy
      createdByUser {
        id
        name
        email
      }
      organizationId
      organization {
        id
        name
        slug
      }
    }
  }
`;

// Authentication queries
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
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
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      access_token
      user {
        id
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
  }
`;

export const ME = gql`
  query Me {
    me {
      id
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
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

// Admin User Management queries
export const LIST_USERS = gql`
  query ListUsers {
    users {
      id
      email
      username
      name
      role
      organizationId
      organization {
        id
        name
        slug
        isActive
      }
      isActive
      avatar
      lastLoginAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
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
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    removeUser(id: $id)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: RegisterInput!) {
    register(input: $input) {
      access_token
      user {
        id
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
  }
`;

// Admin Organization Management queries
export const LIST_ORGANIZATIONS = gql`
  query ListOrganizations {
    organizations {
      id
      name
      slug
      description
      logo
      website
      isActive
      ownerId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: String!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      name
      slug
      description
      logo
      website
      isActive
      ownerId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: String!) {
    removeOrganization(id: $id)
  }
`;

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      slug
      description
      logo
      website
      isActive
      ownerId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_APP = gql`
  mutation DeleteApp($id: String!) {
    removeApp(id: $id)
  }
`;
