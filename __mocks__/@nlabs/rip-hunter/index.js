// Mock for @nlabs/rip-hunter to prevent actual HTTP requests during testing

class ApiError extends Error {
  constructor(errors, message) {
    super(message);
    this.errors = errors;
    this.name = 'ApiError';
  }
}

const graphqlQuery = jest.fn().mockResolvedValue({
  users: {
    signIn: {
      expires: Date.now() + 900000, // 15 minutes from now
      issued: Date.now(),
      token: 'mock-jwt-token',
      userId: 'mock-user-id',
      username: 'mock-username'
    },
    signUp: {
      userId: 'mock-user-id',
      username: 'mock-username',
      email: 'mock@example.com'
    },
    add: {
      userId: 'mock-user-id',
      username: 'mock-username'
    },
    update: {
      userId: 'mock-user-id',
      username: 'mock-username'
    },
    refreshSession: {
      expires: Date.now() + 900000,
      issued: Date.now(),
      token: 'mock-refreshed-token',
      userId: 'mock-user-id',
      username: 'mock-username'
    }
  },
  locations: {
    addLocation: {
      id: 'mock-location-id',
      address: 'Mock Address',
      city: 'Mock City',
      country: 'Mock Country',
      latitude: 40.7128,
      longitude: -74.0060
    },
    updateLocation: {
      id: 'mock-location-id',
      address: 'Updated Mock Address'
    },
    deleteLocation: {
      id: 'mock-location-id'
    },
    getLocation: {
      id: 'mock-location-id',
      address: 'Mock Address'
    },
    locationsByItem: [
      {
        id: 'mock-location-id-1',
        address: 'Mock Address 1'
      },
      {
        id: 'mock-location-id-2',
        address: 'Mock Address 2'
      }
    ]
  },
  posts: {
    addPost: {
      id: 'mock-post-id',
      title: 'Mock Post',
      content: 'Mock content'
    },
    updatePost: {
      id: 'mock-post-id',
      title: 'Updated Mock Post'
    },
    deletePost: {
      id: 'mock-post-id'
    },
    getPost: {
      id: 'mock-post-id',
      title: 'Mock Post'
    },
    postsByUser: [
      {
        id: 'mock-post-id-1',
        title: 'Mock Post 1'
      },
      {
        id: 'mock-post-id-2',
        title: 'Mock Post 2'
      }
    ]
  },
  messages: {
    addMessage: {
      id: 'mock-message-id',
      content: 'Mock message'
    },
    updateMessage: {
      id: 'mock-message-id',
      content: 'Updated mock message'
    },
    deleteMessage: {
      id: 'mock-message-id'
    },
    getMessage: {
      id: 'mock-message-id',
      content: 'Mock message'
    },
    messagesByConversation: [
      {
        id: 'mock-message-id-1',
        content: 'Mock message 1'
      },
      {
        id: 'mock-message-id-2',
        content: 'Mock message 2'
      }
    ]
  },
  events: {
    addEvent: {
      id: 'mock-event-id',
      title: 'Mock Event',
      description: 'Mock event description'
    },
    updateEvent: {
      id: 'mock-event-id',
      title: 'Updated Mock Event'
    },
    deleteEvent: {
      id: 'mock-event-id'
    },
    getEvent: {
      id: 'mock-event-id',
      title: 'Mock Event'
    },
    eventsByUser: [
      {
        id: 'mock-event-id-1',
        title: 'Mock Event 1'
      },
      {
        id: 'mock-event-id-2',
        title: 'Mock Event 2'
      }
    ]
  },
  images: {
    addImage: {
      id: 'mock-image-id',
      url: 'https://mock-image-url.com/image.jpg',
      alt: 'Mock image'
    },
    updateImage: {
      id: 'mock-image-id',
      url: 'https://mock-image-url.com/updated-image.jpg'
    },
    deleteImage: {
      id: 'mock-image-id'
    },
    getImage: {
      id: 'mock-image-id',
      url: 'https://mock-image-url.com/image.jpg'
    },
    imagesByUser: [
      {
        id: 'mock-image-id-1',
        url: 'https://mock-image-url.com/image1.jpg'
      },
      {
        id: 'mock-image-id-2',
        url: 'https://mock-image-url.com/image2.jpg'
      }
    ]
  },
  reactions: {
    addReaction: {
      id: 'mock-reaction-id',
      type: 'like',
      userId: 'mock-user-id'
    },
    updateReaction: {
      id: 'mock-reaction-id',
      type: 'love'
    },
    deleteReaction: {
      id: 'mock-reaction-id'
    },
    getReaction: {
      id: 'mock-reaction-id',
      type: 'like'
    },
    reactionsByItem: [
      {
        id: 'mock-reaction-id-1',
        type: 'like'
      },
      {
        id: 'mock-reaction-id-2',
        type: 'love'
      }
    ]
  },
  tags: {
    addTag: {
      id: 'mock-tag-id',
      name: 'mock-tag',
      tagId: 'mock-tag-id'
    },
    updateTag: {
      id: 'mock-tag-id',
      name: 'updated-mock-tag'
    },
    deleteTag: {
      id: 'mock-tag-id'
    },
    getTag: {
      id: 'mock-tag-id',
      name: 'mock-tag'
    },
    tagsByUser: [
      {
        id: 'mock-tag-id-1',
        name: 'mock-tag-1'
      },
      {
        id: 'mock-tag-id-2',
        name: 'mock-tag-2'
      }
    ]
  }
});

const post = jest.fn().mockResolvedValue({
  data: {
    url: 'https://mock-upload-url.com/image.jpg',
    id: 'mock-upload-id'
  }
});

const get = jest.fn().mockResolvedValue({
  results: [
    {
      formatted_address: 'Mock Address, Mock City, Mock State',
      geometry: {
        location: {
          lat: 40.7128,
          lng: -74.0060
        }
      }
    }
  ]
});

// Type definitions for TypeScript
const HunterOptionsType = {};
const HunterQueryType = {};

module.exports = {
  ApiError,
  graphqlQuery,
  post,
  get,
  HunterOptionsType,
  HunterQueryType
};