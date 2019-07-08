import { NavigationActions } from 'react-navigation';

const reset = (navigation, routeName) => {
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })]
  });
  navigation.dispatch(resetAction);
};

const setParams = (navigation, routeName, params) => {
  const setParamsAction = NavigationActions.setParams({
    params,
    key: routeName
  });
  navigation.dispatch(setParamsAction);
};

export default {
  reset,
  setParams
};
