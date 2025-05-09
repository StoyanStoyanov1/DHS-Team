import { Middleware } from 'redux';
import { RootState } from './index';

/**
 * Example middleware for logging actions in development environment
 */
const loggerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (process.env.NODE_ENV !== 'production') {
    console.group(`Redux Action: ${action.type}`);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
  }
  
  return next(action);
};

/**
 * Custom middleware array to be added to the store
 * Add your additional middleware here
 */
export const customMiddleware = [loggerMiddleware];