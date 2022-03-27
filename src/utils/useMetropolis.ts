import {useFlux} from '@nlabs/arkhamjs-utils-react';
import {useContext, useMemo} from 'react';

import {Events} from '../actions/Events';
import {Images} from '../actions/Images';
import {Locations} from '../actions/Locations';
import {Messages} from '../actions/Messages';
import {Posts} from '../actions/Posts';
import {Reactions} from '../actions/Reactions';
import {Tags} from '../actions/Tags';
import {Users} from '../actions/Users';
import {Websockets} from '../actions/Websockets';
import {Event} from '../adapters/Event';
import {Image} from '../adapters/Image';
import {Location} from '../adapters/Location';
import {Message} from '../adapters/Message';
import {Post} from '../adapters/Post';
import {Reaction} from '../adapters/Reaction';
import {Tag} from '../adapters/Tag';
import {User} from '../adapters/User';
import {MetropolisContext} from './MetropolisProvider';

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
    eventActions: new Events(flux, EventAdapter),
    imageActions: new Images(flux, ImageAdapter),
    locationActions: new Locations(flux, LocationAdapter),
    messageActions: new Messages(flux, MessageAdapter),
    postActions: new Posts(flux, PostAdapter),
    reactionActions: new Reactions(flux, ReactionAdapter),
    tagActions: new Tags(flux, TagAdapter),
    userActions: new Users(flux, UserAdapter),
    websocketActions: new Websockets(flux)
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