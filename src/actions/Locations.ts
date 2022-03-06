/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {FluxFramework} from '@nlabs/arkhamjs';
import {get as httpGet} from '@nlabs/rip-hunter';
import isEmpty from 'lodash/isEmpty';
import pDebounce from 'p-debounce';

import {Location} from '../adapters/Location';
import {Config} from '../config';
import {
  LOCATION_ADD_ERROR,
  LOCATION_ADD_SUCCESS,
  LOCATION_DELETE_ERROR,
  LOCATION_DELETE_SUCCESS,
  LOCATION_GET_DETAILS_ERROR,
  LOCATION_GET_DETAILS_SUCCESS,
  LOCATION_GET_LIST_ERROR,
  LOCATION_GET_LIST_SUCCESS,
  LOCATION_SET_CURRENT,
  LOCATION_UPDATE_ERROR,
  LOCATION_UPDATE_SUCCESS
} from '../stores/locationStore';
import {ApiResultsType, appMutation, appQuery} from '../utils/api';

export class Locations {
  flux: FluxFramework;

  constructor(flux: FluxFramework) {
    this.flux = flux;
  }

  async autocompleteLocation(
    address: string,
    latitude?: number,
    longitude?: number,
    locationProps: string[] = [],
    CustomClass: any = Location
  ) {
    const results = await pDebounce(async (
      address: string,
      latitude?: number,
      longitude?: number,
      locationProps: string[] = []
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

        const {autoCompleteLocation = []} = await appQuery(this.flux, 'autoCompleteLocation', queryVariables, [
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

    return results;
  }

  async addLocation(location: any, locationProps: string[] = [], CustomClass = Location): Promise<any> {
    try {
      const queryVariables = {
        location: {
          type: 'LocationInput!',
          value: location
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {addLocation = {}} = data;
        return this.flux.dispatch({location: new CustomClass(addLocation), type: LOCATION_ADD_SUCCESS});
      };

      return await appMutation(
        this.flux,
        'addLocation',
        queryVariables,
        [
          'added',
          'address',
          'city',
          'country',
          'id',
          'latitude',
          'longitude',
          'modified',
          'state',
          'street',
          'zip',
          ...locationProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: LOCATION_ADD_ERROR});
    }
  }

  async deleteLocation(locationId: string): Promise<any> {
    try {
      const queryVariables = {
        locationId: {
          type: 'ID!',
          value: locationId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {deleteLocation: location = {}} = data;
        return this.flux.dispatch({location: new Location(location), type: LOCATION_DELETE_SUCCESS});
      };

      return await appMutation(this.flux, 'deleteLocation', queryVariables, ['id'], {onSuccess});
    } catch(error) {
      return this.flux.dispatch({error, type: LOCATION_DELETE_ERROR});
    }
  }

  async getCurrentLocation(setLocation?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const {userId} = this.flux.getState('user.session', {});
      const {city, country, latitude, longitude, state} = this.flux.getState(['user', 'users', userId], {});
      const location: string = [city, state, country].join(', ');
      const profileLocation = {latitude, location, longitude};

      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async ({coords}) => {
            const current = {
              accuracy: coords.accuracy,
              altitude: coords.altitude,
              altitudeAccuracy: coords.altitudeAccuracy,
              heading: coords.heading,
              latitude: coords.latitude,
              location: 'Current Location',
              longitude: coords.longitude,
              speed: coords.speed
            };
            console.log('getCurrentLocation::current', current);
            await this.flux.dispatch({current, type: LOCATION_SET_CURRENT});

            if(setLocation) {
              setLocation(current);
            }

            resolve(current);
          },
          (locationError) => {
            console.log('getCurrentLocation::locationError', locationError);
            console.log('getCurrentLocation::profileLocation1', profileLocation);
            if(setLocation) {
              setLocation(profileLocation);
            }

            this.flux.dispatch({current: profileLocation, type: LOCATION_SET_CURRENT});
            reject(locationError);
          },
          {enableHighAccuracy: false, maximumAge: 0, timeout: 30000}
        );
      } else {
        console.log('getCurrentLocation::profileLocation2', profileLocation);
        if(setLocation) {
          setLocation(profileLocation);
        }

        this.flux.dispatch({current: profileLocation, type: LOCATION_SET_CURRENT});
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  getGoogleLocation(address: string): Promise<any> {
    const {key: googleKey, url: googleUrl} = Config.get('google.maps');
    const formatAddress: string = encodeURI(address);
    const url: string = `${googleUrl}?address=${formatAddress}&key=${googleKey}`;

    if(url) {
      return null;
    }
    return httpGet(url).then((data) => {
      const {results} = data;
      const locationData = results && results.length ? results[0] : {};
      const {
        formatted_address: location,
        geometry: {
          location: {lat: latitude, lng: longitude}
        }
      } = locationData;
      return {latitude, location, longitude};
    });
  }

  async getLocation(location, locationProps: string[], CustomClass = Location): Promise<any> {
    try {
      const queryVariables = {
        location: {
          type: 'LocationInput!',
          value: location
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {location = {}} = data;
        return this.flux.dispatch({location: new CustomClass(location), type: LOCATION_GET_DETAILS_SUCCESS});
      };

      return await appMutation(
        this.flux,
        'location',
        queryVariables,
        [
          'added',
          'address',
          'city',
          'country',
          'id',
          'latitude',
          'longitude',
          'modified',
          'state',
          'street',
          'zip',
          ...locationProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: LOCATION_GET_DETAILS_ERROR});
    }
  }

  async getLocationsByItem(itemId: string, locationProps: string[], CustomClass = Location): Promise<any> {
    try {
      const queryVariables = {
        itemId: {
          type: 'ID!',
          value: itemId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {locationsByItem = []} = data;
        return this.flux.dispatch({
          list: locationsByItem.map((item) => new CustomClass(item)),
          type: LOCATION_GET_LIST_SUCCESS
        });
      };

      return await appMutation(
        this.flux,
        'location',
        queryVariables,
        [
          'added',
          'address',
          'city',
          'country',
          'id',
          'latitude',
          'longitude',
          'modified',
          'state',
          'street',
          'zip',
          ...locationProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: LOCATION_GET_LIST_ERROR});
    }
  }

  async updateLocation(location: any, locationProps: string[], CustomClass = Location): Promise<any> {
    try {
      const queryVariables = {
        location: {
          type: 'LocationInput!',
          value: location
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {updateLocation = {}} = data;
        return this.flux.dispatch({location: new CustomClass(updateLocation), type: LOCATION_UPDATE_SUCCESS});
      };

      return await appMutation(
        this.flux,
        'updateLocation',
        queryVariables,
        [
          'added',
          'address',
          'city',
          'country',
          'id',
          'latitude',
          'longitude',
          'modified',
          'state',
          'street',
          'zip',
          ...locationProps
        ],
        {onSuccess}
      );
    } catch(error) {
      return this.flux.dispatch({error, type: LOCATION_UPDATE_ERROR});
    }
  }
}
