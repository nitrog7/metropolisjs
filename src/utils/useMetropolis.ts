import {useFlux} from '@nlabs/arkhamjs-utils-react';
import {useMemo} from 'react';

import {Events} from '../actions/Events';
import {Images} from '../actions/Images';
import {Locations} from '../actions/Locations';
import {Messages} from '../actions/Messages';
import {Posts} from '../actions/Posts';
import {Reactions} from '../actions/Reactions';
import {Tags} from '../actions/Tags';
import {Users} from '../actions/Users';
import {Websocket} from '../actions/websocket';

export const useMetropolis = () => {
  const flux = useFlux();

  return useMemo(() => ({
    events: new Events(flux),
    images: new Images(flux),
    locations: new Locations(flux),
    messages: new Messages(flux),
    posts: new Posts(flux),
    reactions: new Reactions(flux),
    tags: new Tags(flux),
    users: new Users(flux),
    websocket: new Websocket(flux)
  }) , [flux]);
};