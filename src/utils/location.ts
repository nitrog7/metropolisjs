/**
 * Copyright (c) 2012-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {FluxFramework} from '@nlabs/arkhamjs';
import isEmpty from 'lodash/isEmpty';
import pDebounce from 'p-debounce';

import {appQuery} from '../utils/api';

export const autoCompleteLocation = pDebounce(async (
  flux: FluxFramework,
  address: string,
  latitude?: number,
  longitude?: number,
  locationProps: string[] = [],
  CustomClass: any = Location
): Promise<any[]> => {
  if(isEmpty(address)) {
    return [];
  }

  try {
    const queryVariables = {
      address: {
        type: 'String',
        value: address
      },
      latitude: {
        type: 'Float',
        value: latitude
      },
      longitude: {
        type: 'Float',
        value: longitude
      }
    };

    const {autoCompleteLocation = []} = await appQuery(flux, 'autoCompleteLocation', queryVariables, [
      'address',
      'latitude',
      'longitude',
      ...locationProps
    ]);
    return autoCompleteLocation.map((item) => new CustomClass(item));
  } catch(error) {
    return [];
  }
}, 500);
