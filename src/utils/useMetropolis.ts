import {useFlux} from '@nlabs/arkhamjs-utils-react';
import {useContext, useMemo} from 'react';

import {MetropolisContext} from './MetropolisProvider';
import {createAllActions} from '../utils/actionFactory';

export const useMetropolis = () => {
  const flux = useFlux();
  const {adapters} = useContext(MetropolisContext);
  const {
    eventAdapter,
    imageAdapter,
    locationAdapter,
    messageAdapter,
    postAdapter,
    reactionAdapter,
    tagAdapter,
    userAdapter
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