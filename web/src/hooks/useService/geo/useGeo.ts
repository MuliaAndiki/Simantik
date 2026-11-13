import { useGeoReverse, useGeoSearchSchools } from './state/query';

export const useGeo = () => {
  return {
    query: {
      searchSchools: useGeoSearchSchools,
      reverse: useGeoReverse,
    },
  };
};

export default useGeo;
