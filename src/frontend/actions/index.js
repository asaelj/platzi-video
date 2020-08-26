import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const setFavorite = (payload) => ({
  type: 'SET_FAVORITE',
  payload,
});

export const deleteFavorite = (payload) => (
  {
    type: 'DELETE_FAVORITE',
    payload,
  }
);

export const loginRequest = (payload) => (
  {
    type: 'LOGIN_REQUEST',
    payload,
  }
);

export const logoutRequest = (payload) => (
  {
    type: 'LOGOUT_REQUEST',
    payload,
  }
);

export const registerRequest = (payload) => (
  {
    type: 'REGISTER_REQUEST',
    payload,
  }
);

export const getVideosSource = (payload) => (
  {
    type: 'GET_VIDEOS_SOURCE',
    payload,
  }
);

export const getVideoSearch = (payload) => (
  {
    type: 'GET_VIDEO_SEARCH',
    payload,
  }
);

export const setError = (payload) => ({
  type: 'SET_ERROR',
  payload,
});

export const registerUser = (payload, redirectUrl) => {
  return (dispach) => {
    axios.post('/auth/sign-up', payload)
      .then(({ data }) => dispach(registerRequest(data)))
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((error) => dispatch(setError(error)));
  };
};

export const loginUser = ({ email, password }, redirectUrl) => {
  return (dispach) => {
    axios({
      url: '/auth/sign-in',
      method: 'post',
      auth: {
        username: email,
        password,
      },
    })
      .then(({ data }) => {
        document.cookie = `email=${data.user.email}`;
        document.cookie = `name=${data.user.name}`;
        document.cookie = `id=${data.user.id}`;
        dispach(loginRequest(data.user));
      })
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((err) => dispach(setError(err)));
  };
};

export const addFavorite = (movie) => {
  return (dispach) => {
    axios.post('/api/user-movies', movie)
      .then(({ data }) => {
        dispach(setFavorite(data.movie));
      })
      .catch((error) => dispatch(setError(error)));;
  };
};

export const removeFavorite = (movieId, id) => {
  return (dispach) => {
    axios.delete(`/api/user-movies/${movieId}`)
      .then(({ data }) => {
        dispach(deleteFavorite(id));
      })
      .catch((error) => {
        console.log(error);
        dispach(setError(error));
      });
  };
};
