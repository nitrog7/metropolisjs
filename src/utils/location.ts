/**
 * Copyright (c) 2012-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {FluxFramework} from '@nlabs/arkhamjs';
import isEmpty from 'lodash/isEmpty';
import pDebounce from 'p-debounce';

import {Location} from '../adapters/Location';
import {appQuery, type ReaktorDbCollection} from '../utils/api';

const DATA_TYPE: ReaktorDbCollection = 'locations';

export const autoCompleteLocation = pDebounce(async (
  flux: FluxFramework,
  address: string,
  latitude?: number,
  longitude?: number,
  locationProps: string[] = [],
  CustomClass: typeof Location = Location
): Promise<Location[]> => {
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

    const {autoCompleteLocation = []} = await appQuery(flux, 'autoCompleteLocation', DATA_TYPE, queryVariables, [
      'address',
      'latitude',
      'longitude',
      ...locationProps
    ]) as {autoCompleteLocation: Record<string, unknown>[]};
    return autoCompleteLocation.map((item) => new CustomClass(item));
  } catch(error) {
    console.error(error);
    return [];
  }
}, 500);
