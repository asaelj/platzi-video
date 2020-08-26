import { setFavorite, loginRequest } from '../../actions';
import movieMock from '../../__mocks__/movieMock';

describe('Action', () => {
  test('set favorite', () => {
    const payload = movieMock;
    const expectedAction = {
      type: 'SET_FAVORITE',
      payload,
    };
    expect(setFavorite(payload).toEqual(expectedAction));
  });

  test('Login', () => {
    const payload = {
      email: 'test@test.com',
      password: 'password',
    };
    const expectedAction = {
      type: 'LOGN_REQUEST',
      payload,
    };
    expect(loginRequest(payload)).toEqual(expectedAction);
  });
});
