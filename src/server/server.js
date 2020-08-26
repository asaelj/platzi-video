/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
import helmet from 'helmet';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import cookieParser from 'cookie-parser';
import boom from '@hapi/boom';
import passport from 'passport';
import axios from 'axios';
import serverRoutes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
//import initialState from '../frontend/initialState';
import getManifest from './getManifest';

//Busca en todo el entorno un archivo .env y recibe sus variables
dotenv.config();

//Tiempos de expiracion en segundos
const THIRTY_DAYS_IN_SEC = 2592000000;
const TWO_HOURS_IN_SEC = 7200000;

const { ENV, PORT } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require('./utils/auth/strategies/basic');

if (ENV === 'development') {
  console.log('Development config');
  const webpackConfig = require('../../webpack.config');
  const wepackDevMiddleware = require('webpack-dev-middleware');
  const wepackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const serverConfig = { port: PORT, hot: true };

  app.use(wepackDevMiddleware(compiler, serverConfig));
  app.use(wepackHotMiddleware(compiler));

} else { //MODO PRODUCCION
  app.use((req, res, next) => {
    if (!req.hashManifest) req.hashManifest = getManifest();
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disabled('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';
  return (`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${mainStyles}" rel="stylesheet" type="text/css">
      <title>Platzi Video</title>
  </head>
  <body>
      <div id="app">${html}</div>
      <script type="text/javascript">
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      <script src="${mainBuild}" type="text/javascript"></script>
      <script src="${vendorBuild}" type="text/javascript"></script>
  </body>
  </html>
  `
  );
};

const renderApp = async (req, res) => {
  let initialState;
  const { token, email, name, id } = req.cookies;

  try {
    //Lista de peliculas
    let movieList = await axios({
      url: `${process.env.API_URL}/api/movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
    });

    //Lista de peliculas favoritas
    let favoriteList = await axios({
      url: `${process.env.API_URL}/api/user-movies?userId=${id}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
    });

    favoriteList = favoriteList.data.data;
    movieList = movieList.data.data;

    initialState = {
      user: {
        email, name, id,
      },
      playing: {},
      trends: movieList.filter((movie) => movie.contentRating === 'PG'),
      search: [],
      myList: favoriteList.map((movieFav) => {
        const obj = {
          ...movieList.filter((movie) => movieFav.movieId === movie._id)[0],
          'userMovieId': movieFav._id,
        };
        return obj;
      }),
      originals: movieList.filter((movie) => movie.contentRating === 'R'),
    };
  } catch (error) {
    initialState = {
      user: {},
      playing: {},
      search: [],
      myList: [],
      trends: [],
      originals: [],
    };
  }

  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = (initialState.user.id);
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes(isLogged))}
      </StaticRouter>
    </Provider>,
  );
  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.post('/auth/sign-in', async (req, res, next) => {
  //Obtener el atributo remeberMe desde el cuerpo del request
  const { rememberMe } = req.body;

  passport.authenticate('basic', (error, data) => {
    try {
      if (error || !data) {
        boom.unauthorized();
      }
      req.login(data, { session: false }, async (err) => {
        if (err) {
          next(err);
        }

        const { token, ...user } = data;

        res.cookie('token', token, {
          httpOnly: !(ENV === 'development'),
          secure: !(ENV === 'development'),
          maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC,
        });

        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${process.env.API_URL}/api/auth/sign-up`,
      method: 'post',
      data: {
        'email': user.email,
        'name': user.name,
        'password': user.password,
      },
    });

    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id,
    });

  } catch (error) {
    next(error);
  }
});

app.post('/api/user-movies', async (req, res, next) => {
  const { token, id } = req.cookies;
  const { body: movie } = req;

  try {
    const { data } = await axios({
      url: `${process.env.API_URL}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'post',
      data: {
        userId: id,
        movieId: movie._id,
      },
    });

    res.status(201).json({
      createUserMovieId: data,
      movie,
    });

  } catch (error) {
    next(error);
  }
});

app.delete('/api/user-movies/:userMovieId', async (req, res, next) => {
  const { userMovieId } = req.params;
  const { token } = req.cookies;

  try {
    const { data } = await axios({
      url: `${process.env.API_URL}/api/user-movies/${userMovieId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete',
    });

    res.status(200).json(data);

  } catch (error) {
    console.log(error);
    next(error);
  }

});

//Todas las rutas
app.get('*', renderApp);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server running on port ${PORT}`);
});
