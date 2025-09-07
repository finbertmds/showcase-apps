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
      _id
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
      organizationId
    }
  }
`;

export const GET_TIMELINE_APPS = gql`
  query GetTimelineApps($limit: Int, $offset: Int) {
    timelineApps(limit: $limit, offset: $offset) {
      _id
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
      organizationId
    }
  }
`;

export const GET_APP_BY_SLUG = gql`
  query GetAppBySlug($slug: String!) {
    appBySlug(slug: $slug) {
      _id
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
      organizationId
    }
  }
`;

export const GET_APP_BY_ID = gql`
  query GetAppById($id: String!) {
    app(id: $id) {
      _id
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
      organizationId
    }
  }
`;

export const GET_TIMELINE_EVENTS = gql`
  query GetTimelineEvents($limit: Int, $offset: Int) {
    timelineEvents(limit: $limit, offset: $offset) {
      _id
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
      _id
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
      _id
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

// Authentication queries
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
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
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      access_token
      user {
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
  }
`;

export const ME = gql`
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
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;
