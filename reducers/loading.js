import {
  LOADING_SHOW,
  LOADING_HIDE,
  FETCH_START,
  FETCH_END,
  FETCH_ERROR,
  FETCH_CANCEL
} from '../constants/ActionTypes';

export default (previousState = 0, { type }) => {
  switch (type) {
    case LOADING_SHOW:
    case FETCH_START:
      return previousState + 1;
    case LOADING_HIDE:
    case FETCH_END:
    case FETCH_ERROR:
    case FETCH_CANCEL:
      return Math.max(previousState - 1, 0);
    default:
      return previousState;
  }
};
