import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder='Seihiarch'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query = 'school'
      key = 'AIzaSyCY9y--e3FKcdruI5Vg8peFmAXl25x4Iz8'
      query={{
        query: 'school',   // keyword: 'school',
        type: 'school',
        key: 'AIzaSyCY9y--e3FKcdruI5Vg8peFmAXl25x4Iz8',
        language: 'en',
      }}
    />
  );
};

export default GooglePlacesInput;