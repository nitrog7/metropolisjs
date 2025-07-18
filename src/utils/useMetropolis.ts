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
    Profile: profileAdapter,
    Reaction: reactionAdapter,
    Tag: tagAdapter,
    User: userAdapter
  } = adapters || {};

  return useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const {
      event,
      image,
      location,
      message,
      post,
      profile,
      reaction,
      tag,
      user,
      websocket
    } = createAllActions(flux, {
      // Use type assertions to bridge the gap between the adapter signatures
      event: eventAdapter ? {eventAdapter: eventAdapter as any} : undefined,
      image: imageAdapter ? {imageAdapter: imageAdapter as any} : undefined,
      location: locationAdapter ? {locationAdapter: locationAdapter as any} : undefined,
      message: messageAdapter ? {messageAdapter: messageAdapter as any} : undefined,
      post: postAdapter ? {postAdapter: postAdapter as any} : undefined,
      profile: profileAdapter ? {profileAdapter: profileAdapter as any} : undefined,
      reaction: reactionAdapter ? {reactionAdapter: reactionAdapter as any} : undefined,
      tag: tagAdapter ? {tagAdapter: tagAdapter as any} : undefined,
      user: userAdapter ? {userAdapter: userAdapter as any} : undefined
    });

    return {
      eventActions: event,
      imageActions: image,
      locationActions: location,
      messageActions: message,
      postActions: post,
      profileActions: profile,
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
    profileAdapter,
    reactionAdapter,
    tagAdapter,
    userAdapter
  ]);
};