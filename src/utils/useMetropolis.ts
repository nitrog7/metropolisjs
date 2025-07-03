import {useFlux} from '@nlabs/arkhamjs-utils-react';
import {useContext, useMemo} from 'react';

import {EventActions} from '../actions/EventActions';
import {ImageActions} from '../actions/ImageActions';
import {LocationActions} from '../actions/LocationActions';
import {MessageActions} from '../actions/MessageActions';
import {PostActions} from '../actions/PostActions';
import {ReactionActions} from '../actions/ReactionActions';
import {TagActions} from '../actions/TagActions';
import {UserActions} from '../actions/UserActions';
import {WebsocketActions} from '../actions/WebsocketActions';
import {parseEvent, parseImage, parseLocation, parseMessage, parsePost, parseReaction, parseTag, parseUser} from '../adapters';
import {MetropolisContext} from './MetropolisProvider';

export const useMetropolis = () => {
  const flux = useFlux();
  const {adapters} = useContext(MetropolisContext);
  const {
    Event: EventAdapter = parseEvent,
    Image: ImageAdapter = parseImage,
    Location: LocationAdapter = parseLocation,
    Message: MessageAdapter = parseMessage,
    Post: PostAdapter = parsePost,
    Reaction: ReactionAdapter = parseReaction,
    Tag: TagAdapter = parseTag,
    User: UserAdapter = parseUser
  } = adapters || {};

  return useMemo(() => ({
    eventActions: new EventActions(flux, EventAdapter),
    imageActions: new ImageActions(flux, ImageAdapter),
    locationActions: new LocationActions(flux, LocationAdapter),
    messageActions: new MessageActions(flux, MessageAdapter),
    postActions: new PostActions(flux, PostAdapter),
    reactionActions: new ReactionActions(flux, ReactionAdapter),
    tagActions: new TagActions(flux, TagAdapter),
    userActions: new UserActions(flux, UserAdapter),
    websocketActions: new WebsocketActions(flux)
  }), [
    flux,
    EventAdapter,
    ImageAdapter,
    LocationAdapter,
    MessageAdapter,
    PostAdapter,
    ReactionAdapter,
    TagAdapter,
    UserAdapter
  ]);
};