import {parseConversation, type ConversationType} from './conversationAdapter';
import {parseEvent, type EventType} from './eventAdapter';
import {parseImage, type ImageType} from './imageAdapter';
import {parseLocation, type LocationType} from './locationAdapter';
import {parseMessage, type MessageType} from './messageAdapter';
import {parsePersona, type PersonaType} from './personaAdapter';
import {parsePost, type PostType} from './postAdapter';
import {parseReaction, type ReactionType} from './reactionAdapter';
import {parseTag, type TagType} from './tagAdapter';
import {parseUser, type UserType} from './userAdapter';

// Legacy compatibility classes that wrap the new adapter functions
export class Conversation {
  static TYPE = 'conversations';
  static TYPE_ID = 'conversationId';

  [key: string]: any;

  constructor(data: Partial<ConversationType>) {
    const parsed = parseConversation(data);
    Object.assign(this, parsed);
  }

  getInput(): Partial<ConversationType> {
    return {
      id: this.id,
      conversationId: this.conversationId,
      type: this.type
    };
  }

  toJson(): ConversationType {
    return {...this};
  }
}

export class Image {
  static TYPE = 'images';
  static TYPE_ID = 'imageId';

  [key: string]: any;

  constructor(data: Partial<ImageType>) {
    const parsed = parseImage(data);
    Object.assign(this, parsed);
  }

  getInput(): Partial<ImageType> {
    return {
      id: this.id,
      imageId: this.imageId,
      type: this.type
    };
  }

  toJson(): ImageType {
    return {...this};
  }
}

export class Message {
  static TYPE = 'messages';
  static TYPE_ID = 'messageId';

  [key: string]: any;

  constructor(data: Partial<MessageType>, sessionId?: string) {
    const parsed = parseMessage(data);
    Object.assign(this, parsed);

    // Handle session-specific logic
    if(sessionId && this.user && this.user.userId === sessionId) {
      this.position = 'right';
    } else {
      this.position = 'left';
    }
  }

  getInput(): Partial<MessageType> {
    return {
      id: this.id,
      messageId: this.messageId,
      type: this.type
    };
  }

  toJson(): MessageType {
    return {...this};
  }
}

export class Post {
  static TYPE = 'posts';
  static TYPE_ID = 'postId';

  [key: string]: any;

  constructor(data: Partial<PostType>) {
    const parsed = parsePost(data);
    Object.assign(this, parsed);
  }

  getInput(): Partial<PostType> {
    return {
      id: this.id,
      postId: this.postId,
      type: this.type
    };
  }

  toJson(): PostType {
    return {...this};
  }
}

export class Tag {
  static TYPE = 'tags';
  static TYPE_ID = 'tagId';

  [key: string]: any;

  constructor(data: Partial<TagType>) {
    const parsed = parseTag(data);
    Object.assign(this, parsed);
  }

  getInput(): Partial<TagType> {
    return {
      id: this.id,
      tagId: this.tagId,
      type: this.type
    };
  }

  toJson(): TagType {
    return {...this};
  }
}

export class User {
  static TYPE = 'users';
  static TYPE_ID = 'userId';

  [key: string]: any;

  constructor(data: Partial<UserType>) {
    const parsed = parseUser(data);
    Object.assign(this, parsed);
  }

  getInput(): Partial<UserType> {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type
    };
  }

  toJson(): UserType {
    return {...this};
  }
}

export class Event {
  static TYPE = 'events';
  static TYPE_ID = 'eventId';

  [key: string]: any;

  constructor(data: Partial<EventType>) {
    const parsed = parseEvent(data);
    Object.assign(this, parsed);
  }

  getInput(): Partial<EventType> {
    return {
      id: this.id,
      eventId: this.eventId,
      type: this.type
    };
  }

  toJson(): EventType {
    return {...this};
  }
}

export class Location {
  static TYPE = 'locations';
  static TYPE_ID = 'locationId';

  [key: string]: any;

  constructor(data: Partial<LocationType>) {
    const parsed = parseLocation(data);
    Object.assign(this, parsed);
  }

  getInput(): Partial<LocationType> {
    return {
      id: this.id,
      locationId: this.locationId,
      type: this.type
    };
  }

  toJson(): LocationType {
    return {...this};
  }
}

export class Persona {
  static TYPE = 'persona';
  static TYPE_ID = 'personaId';

  [key: string]: any;

  constructor(data: Partial<PersonaType>) {
    const parsed = parsePersona(data);
    Object.assign(this, parsed);
  }

  getInput(): Partial<PersonaType> {
    return {
      id: this.id,
      personaId: this.personaId,
      type: this.type
    };
  }

  toJson(): PersonaType {
    return {...this};
  }
}

export class Reaction {
  static TYPE = 'reactions';
  static TYPE_ID = 'reactionId';

  [key: string]: any;

  constructor(data: Partial<ReactionType>) {
    const parsed = parseReaction(data);
    Object.assign(this, parsed);
  }

  getInput(): Partial<ReactionType> {
    return {
      id: this.id,
      reactionId: this.reactionId,
      type: this.type
    };
  }

  toJson(): ReactionType {
    return {...this};
  }
}