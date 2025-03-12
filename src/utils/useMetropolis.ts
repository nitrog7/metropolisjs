import {useFlux} from '@nlabs/arkhamjs-utils-react';
import {useContext, useMemo} from 'react';

import {MetropolisContext} from './MetropolisProvider';
import {EventActions} from '../actions/EventActions';
import {ImageActions} from '../actions/ImageActions';
import {LocationActions} from '../actions/LocationActions';
import {MessageActions} from '../actions/MessageActions';
import {PostActions} from '../actions/PostActions';
import {ReactionActions} from '../actions/ReactionActions';
import {TagActions} from '../actions/TagActions';
import {UserActions} from '../actions/UserActions';
import {WebsocketActions} from '../actions/WebsocketActions';
import {Event} from '../adapters/Event';
import {Image} from '../adapters/Image';
import {Location} from '../adapters/Location';
import {Message} from '../adapters/Message';
import {Post} from '../adapters/Post';
import {Reaction} from '../adapters/Reaction';
import {Tag} from '../adapters/Tag';
import {User} from '../adapters/User';

export const useMetropolis = () => {
  const flux = useFlux();
  const {adapters} = useContext(MetropolisContext);
  const {
    Event: EventAdapter = Event,
    Image: ImageAdapter = Image,
    Location: LocationAdapter = Location,
    Message: MessageAdapter = Message,
    Post: PostAdapter = Post,
    Reaction: ReactionAdapter = Reaction,
    Tag: TagAdapter = Tag,
    User: UserAdapter = User
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