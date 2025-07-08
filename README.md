# 🏙️ MetropolisJS

> **The Ultimate Frontend Integration Library for Modern Web Applications**

[![npm version](https://badge.fury.io/js/%40nlabs%2Fmetropolisjs.svg)](https://badge.fury.io/js/%40nlabs%2Fmetropolisjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

MetropolisJS is the bridge that connects your frontend dreams to backend reality. Built on the powerful combination of **Reaktor** (backend services) and **ArkhamJS** (frontend data store), MetropolisJS provides a seamless, real-time integration layer that handles everything from user authentication to real-time messaging and notifications.

## 🚀 Why MetropolisJS?

### ✨ **Seamless Integration**

Connect your React frontend to Reaktor-powered backend services with zero configuration headaches. MetropolisJS handles all the complex data flow, state management, and real-time communication.

### 🔄 **Real-Time Everything**

Built-in WebSocket and Server-Sent Events (SSE) support for instant messaging, live notifications, and real-time data synchronization. Your users will never miss a beat.

### 🛡️ **Type-Safe & Reliable**

Full TypeScript support with comprehensive type definitions. Catch errors at compile time, not runtime.

### 🎯 **Developer Experience First**

Clean, intuitive APIs that make complex operations feel simple. Focus on building features, not boilerplate.

## 🎯 What Can You Build?

MetropolisJS powers applications that need:

- **🔐 User Authentication & Authorization**
- **💬 Real-Time Messaging Systems**
- **🔔 Live Notifications**
- **📱 Social Media Features** (posts, reactions, tags)
- **📍 Location-Based Services**
- **🖼️ Media Management** (images, files)
- **📅 Event Management**
- **👥 User Connections & Relationships**

## 🛠️ Quick Start

### Installation

```bash
npm install @nlabs/metropolisjs @nlabs/arkhamjs @nlabs/arkhamjs-utils-react
```

### Basic Setup

```tsx
import React from 'react';
import {Metropolis} from '@nlabs/metropolisjs';
import {useMetropolis} from '@nlabs/metropolisjs';

const App = () => {
  return (
    <Metropolis config={{
      environment: 'development',
      // Your configuration here
    }}>
      <YourApp />
    </Metropolis>
  );
};

const YourApp = () => {
  const {userActions, messageActions, websocketActions} = useMetropolis();

  // Start building amazing features!
  return <div>Your app content</div>;
};
```

### User Authentication Example

```tsx
const LoginForm = () => {
  const {userActions} = useMetropolis();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const session = await userActions.signIn(username, password);
      console.log('User logged in successfully!', session);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  );
};
```

### Real-Time Messaging

```tsx
const ChatComponent = () => {
  const {messageActions, websocketActions} = useMetropolis();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Initialize WebSocket connection
    websocketActions.wsInit();

    // Load existing messages
    messageActions.list().then(setMessages);
  }, []);

  const sendMessage = async (content) => {
    await messageActions.add({ content });
    // Message automatically appears in real-time for all connected users!
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.messageId}>{message.content}</div>
      ))}
      <button onClick={() => sendMessage('Hello World!')}>
        Send Message
      </button>
    </div>
  );
};
```

## 🏗️ Architecture

MetropolisJS is built on a powerful three-layer architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   MetropolisJS  │    │   Reaktor       │
│                 │◄──►│                 │◄──►│   Backend       │
│   UI Layer      │    │   Integration   │    │   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   ArkhamJS      │
                       │   Data Store    │
                       │                 │
                       └─────────────────┘
```

### 🔧 Core Components

- **Actions**: Handle all API interactions and business logic
- **Adapters**: Transform data between frontend and backend formats
- **Stores**: Manage application state with ArkhamJS
- **WebSocket Actions**: Handle real-time communication
- **Configuration**: Flexible setup for any environment

## 📚 Available Actions

MetropolisJS provides comprehensive action classes for all your needs:

- **userActions**: Authentication, profiles, user management
- **messageActions**: Real-time messaging and conversations
- **postActions**: Social media posts and content
- **reactionActions**: Likes, reactions, and interactions
- **tagActions**: Content categorization and discovery
- **eventActions**: Event management and scheduling
- **imageActions**: Media upload and management
- **locationActions**: Geolocation and location-based features
- **websocketActions**: Real-time communication setup

## 🔌 Adapters

Customize data transformation with powerful adapters:

- **userAdapter**: User profiles and authentication data
- **messageAdapter**: Chat and messaging data
- **postAdapter**: Social media content
- **eventAdapter**: Event and scheduling data
- **imageAdapter**: Media and file data
- **locationAdapter**: Geolocation data
- **tagAdapter**: Categorization data
- **reactionAdapter**: User interaction data

## ⚡ Real-Time Features

### WebSocket Integration

```tsx
const {websocketActions} = useMetropolis();

// Initialize real-time connections
websocketActions.wsInit();

// Messages, notifications, and data updates
// are automatically synchronized across all clients
```

### Server-Sent Events

Built-in SSE support for lightweight real-time updates without the overhead of WebSocket connections.

## 🎨 Customization

### Custom Adapters

```tsx
class CustomUserAdapter extends User {
  // Override methods to customize data transformation
  toJson() {
    const data = super.toJson();
    return {
      ...data,
      displayName: `${data.firstName} ${data.lastName}`,
      customField: 'custom value'
    };
  }
}

// Use custom adapter
const {userActions} = useMetropolis({
  adapters: {
    User: CustomUserAdapter
  }
});
```

### Configuration

```tsx
const config = {
  environment: 'production',
  app: {
    session: {
      maxMinutes: 1440, // 24 hours
      minMinutes: 15
    }
  },
  isAuth: () => {
    // Custom authentication logic
    return true;
  }
};
```

## 🚀 Performance Features

- **Debounced API calls** to prevent excessive requests
- **Intelligent caching** with ArkhamJS
- **Optimistic updates** for instant UI feedback
- **Connection pooling** for WebSocket efficiency
- **Lazy loading** support for large datasets

## 🔒 Security

- **Automatic token refresh** for seamless sessions
- **Secure WebSocket connections** with authentication
- **Input validation** and sanitization
- **CSRF protection** built-in
- **Session management** with configurable timeouts

## 📦 Installation & Setup

### Prerequisites

- Node.js 16+
- React 18+
- TypeScript 4.5+

### Full Installation

```bash
# Install MetropolisJS and dependencies
npm install @nlabs/metropolisjs @nlabs/arkhamjs @nlabs/arkhamjs-utils-react

# For development
npm install --save-dev @types/react @types/node
```

### Environment Setup

```bash
# Set your environment variables
export NODE_ENV=development
export REAKTOR_API_URL=your-reaktor-backend-url
```

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/nitrogenlabs/metropolisjs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nitrogenlabs/metropolisjs/discussions)
- **Email**: <giraldo@nitrogenlabs.com>

## 🏢 About Nitrogen Labs

MetropolisJS is proudly developed by [Nitrogen Labs](http://nitrogenlabs.com), a team passionate about building powerful, developer-friendly tools that make web development faster, more reliable, and more enjoyable.

---

**Ready to build the future?** Start with MetropolisJS today and experience the power of seamless frontend-backend integration! 🚀
