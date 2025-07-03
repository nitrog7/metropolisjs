/**
 * Copyright (c) 2019-Present, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {get as httpGet} from '@nlabs/rip-hunter';

import {Location} from '../adapters/legacyCompatibility';
import {Config} from '../config';
import {LocationConstants} from '../stores/locationStore';
import {appMutation} from '../utils/api';
import {autoCompleteLocation} from '../utils/location';

import type {ApiResultsType, ReaktorDbCollection} from '../utils/api';
import type {FluxFramework} from '@nlabs/arkhamjs';

const DATA_TYPE: ReaktorDbCollection = 'locations';

export type LocationApiResultsType = {
  addLocation: Location;
  deleteLocation: Location;
  getLocation: Location;
  getLocationsByItem: Location[];
  updateLocation: Location;
};

export class LocationActions {
  CustomAdapter: typeof Location;
  flux: FluxFramework;

  constructor(flux: FluxFramework, CustomAdapter: typeof Location = Location) {
    this.CustomAdapter = CustomAdapter;
    this.flux = flux;
  }

  async autocompleteLocation(
    address: string,
    latitude?: number,
    longitude?: number,
    locationProps: string[] = [],
    CustomClass: typeof Location = Location
  ): Promise<Location[]> {
    return autoCompleteLocation(this.flux, address, latitude, longitude, locationProps, CustomClass);
  }

  async add(
    location: Partial<Location>,
    locationProps: string[] = [],
    CustomClass: typeof Location = Location
  ): Promise<Location> {
    try {
      const queryVariables = {
        location: {
          type: 'LocationInput!',
          value: location
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {addLocation = {}} = data;
        return this.flux.dispatch({location: new CustomClass(addLocation), type: LocationConstants.ADD_ITEM_SUCCESS});
      };

      const {location: addedLocation} = await appMutation(
        this.flux,
        'addLocation',
        DATA_TYPE,
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
      return addedLocation as Location;
    } catch(error) {
      this.flux.dispatch({error, type: LocationConstants.ADD_ITEM_ERROR});
      throw error;
    }
  }

  async delete(locationId: string): Promise<Location> {
    try {
      const queryVariables = {
        locationId: {
          type: 'ID!',
          value: locationId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {deleteLocation: location = {}} = data;
        return this.flux.dispatch({location: new Location(location), type: LocationConstants.REMOVE_ITEM_SUCCESS});
      };

      const {location: deletedLocation} = await appMutation(
        this.flux,
        'deleteLocation',
        DATA_TYPE,
        queryVariables,
        ['id'],
        {onSuccess}
      );
      return deletedLocation as Location;
    } catch(error) {
      this.flux.dispatch({error, type: LocationConstants.REMOVE_ITEM_ERROR});
      throw error;
    }
  }

  async getCurrentLocation(setLocation?: (location: Location) => void): Promise<Location> {
    return new Promise((resolve, reject) => {
      const {userId} = this.flux.getState('user.session', {});
      const {city, country, latitude, longitude, state} = this.flux.getState(['user', 'users', userId], {});
      const locationStr: string = [city, state, country].join(', ');
      const profileLocation = new Location({
        latitude,
        location: locationStr,
        longitude
      });

      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async ({coords}) => {
            const current = new Location({
              latitude: coords.latitude,
              location: 'Current Location',
              longitude: coords.longitude
            });
            await this.flux.dispatch({current, type: LocationConstants.SET_CURRENT});
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

            this.flux.dispatch({current: profileLocation, type: LocationConstants.SET_CURRENT});
            reject(locationError);
          },
          {enableHighAccuracy: false, maximumAge: 0, timeout: 30000}
        );
      } else {
        console.log('getCurrentLocation::profileLocation2', profileLocation);
        if(setLocation) {
          setLocation(profileLocation);
        }

        this.flux.dispatch({current: profileLocation, type: LocationConstants.SET_CURRENT});
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  async getGoogleLocation(address: string): Promise<{latitude: number; location: string; longitude: number}> {
    const {key: googleKey, url: googleUrl} = Config.get('google.maps') as {key: string; url: string};
    const formatAddress: string = encodeURI(address);
    const url: string = `${googleUrl}?address=${formatAddress}&key=${googleKey}`;

    if(url) {
      return {latitude: 0, location: '', longitude: 0};
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

  async getLocation(
    location: Partial<Location>,
    locationProps: string[],
    CustomClass: typeof Location = Location
  ): Promise<Location> {
    try {
      const queryVariables = {
        location: {
          type: 'LocationInput!',
          value: location
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {location = {}} = data;
        return this.flux.dispatch({location: new CustomClass(location), type: LocationConstants.GET_ITEM_SUCCESS});
      };

      const {location: locationResult} = await appMutation(
        this.flux,
        'location',
        DATA_TYPE,
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
      return locationResult as Location;
    } catch(error) {
      this.flux.dispatch({error, type: LocationConstants.GET_ITEM_ERROR});
      throw error;
    }
  }

  async listByItem(
    itemId: string,
    locationProps: string[],
    CustomClass: typeof Location = Location
  ): Promise<Location[]> {
    try {
      const queryVariables = {
        itemId: {
          type: 'ID!',
          value: itemId
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {locationsByItem = []} = data as {locationsByItem: Location[]};
        return this.flux.dispatch({
          list: locationsByItem.map((item) => new CustomClass(item)),
          type: LocationConstants.GET_LIST_SUCCESS
        });
      };

      const {locationsByItem: locationsList} = await appMutation(
        this.flux,
        'location',
        DATA_TYPE,
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
      return locationsList as Location[];
    } catch(error) {
      this.flux.dispatch({error, type: LocationConstants.GET_LIST_ERROR});
      throw error;
    }
  }

  async update(
    location: Partial<Location>,
    locationProps: string[],
    CustomClass: typeof Location = Location
  ): Promise<Location> {
    try {
      const queryVariables = {
        location: {
          type: 'LocationInput!',
          value: location
        }
      };

      const onSuccess = (data: ApiResultsType = {}) => {
        const {updateLocation = {}} = data;
        return this.flux.dispatch({location: new CustomClass(updateLocation), type: LocationConstants.UPDATE_ITEM_SUCCESS});
      };

      const {location: updatedLocation} = await appMutation(
        this.flux,
        'updateLocation',
        DATA_TYPE,
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
      return updatedLocation as Location;
    } catch(error) {
      this.flux.dispatch({error, type: LocationConstants.UPDATE_ITEM_ERROR});
      throw error;
    }
  }
}
