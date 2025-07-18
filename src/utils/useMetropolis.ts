import {useFlux} from '@nlabs/arkhamjs-utils-react';
import {useContext, useMemo} from 'react';

import {createAllActions} from '../utils/actionFactory';
import {MetropolisContext} from './MetropolisProvider';

export const useMetropolis = () => {
  const flux = useFlux();
  const {adapters} = useContext(MetropolisContext);
  const {
    Event: eventAdapter,
    Image: imageAdapter,
    Location: locationAdapter,
    Message: messageAdapter,
    Post: postAdapter,
    Reaction: reactionAdapter,
    Tag: tagAdapter,
    User: userAdapter
  } = adapters || {};

  return useMemo(() => {
    const {
      event,
      image,
      location,
      message,
      post,
      reaction,
      tag,
      user,
      websocket
    } = createAllActions(flux, {
      event: {eventAdapter},
      image: {imageAdapter},
      location: {locationAdapter},
      message: {messageAdapter},
      post: {postAdapter},
      reaction: {reactionAdapter},
      tag: {tagAdapter},
      user: {userAdapter}
    });

    return {
      eventActions: event,
      imageActions: image,
      locationActions: location,
      messageActions: message,
      postActions: post,
      reactionActions: reaction,
      tagActions: tag,
      userActions: user,
      websocketActions: websocket
    };
  }, [
    flux,
    eventAdapter,
    imageAdapter,
    locationAdapter,
    messageAdapter,
    postAdapter,
    reactionAdapter,
    tagAdapter,
    userAdapter
  ]);
};