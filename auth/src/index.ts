import * as dotenv from 'dotenv';
import 'reflect-metadata';
import * as express from 'express';
import { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import oauth20 from 'oauth20-provider';

import * as user from './model/mysql/oauth2/user';
import path = require('path');
import { accessToken } from './model/mysql/oauth2';
import { LogActivity } from './entity/LogActivity';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

interface AppRequest extends Request {
  oauth2: any;
  session: any;
}

var TYPE = 'mysql';

var query = require('querystring'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  bodyParser = require('body-parser');

var oauth20 = require('./oauth20')(TYPE),
  model = require('./model/' + TYPE);
oauth20.renewRefreshToken = true;

// Configuration for renewing refresh token in refresh token flow

AppDataSource.initialize()
  .then(async () => {
    const server = express();
    server.set('oauth2', oauth20);

    // Middleware
    server.use(cookieParser());
    server.use(session({ secret: 'oauth20-provider-test-server', resave: false, saveUninitialized: false }));
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(oauth20.inject());

    // View
    server.set('views', path.join(__dirname, '..', 'view'));
    server.set('view engine', 'jade');

    // Middleware. User authorization
    function isUserAuthorized(req, res, next) {
      if (req.session.authorized) next();
      else {
        var params = req.query;
        params.backUrl = req.path;
        res.redirect('/login?' + query.stringify(params));
      }
    }

    // Define OAuth2 Authorization Endpoint
    server.get('/authorization', isUserAuthorized, oauth20.controller.authorization, function (req, res) {
      res.render('authorization', { layout: false });
    });
    server.post('/authorization', isUserAuthorized, oauth20.controller.authorization);

    // Define OAuth2 Token Endpoint
    server.post('/token', oauth20.controller.token);

    server.post('/logout', oauth20.middleware.bearer, accessToken.revokeToken, function (req, res) {
      res.json(true);
    });

    // TO-DO: add scope checking
    server.post('/validate-auth', oauth20.middleware.bearer, function (req: AppRequest, res) {
      const logRepo = AppDataSource.getRepository(LogActivity);
      logRepo.save(
        logRepo.create({
          requestPath: req.body.url,
          method: req.body.method,
          accessToken: req.oauth2.accessToken.token,
        }),
      );
      res.send(req.oauth2.accessToken.userId);
    });

    // Define user login routes
    server.get('/login', function (req, res) {
      res.render('login', { layout: false });
    });

    server.post('/login', function (req: AppRequest, res, next) {
      var backUrl = req.query.backUrl ? req.query.backUrl : '/';
      delete req.query.backUrl;
      backUrl += backUrl.toString().indexOf('?') > -1 ? '&' : '?';
      backUrl += query.stringify(req.query);

      // Already logged in
      if (req.session.authorized) res.redirect(backUrl.toString());
      // Trying to log in
      else if (req.body.username && req.body.password) {
        user.fetchByUsername(req.body.username, function (err, data) {
          if (err) next(err);
          else {
            user.checkPassword(data, req.body.password, function (err, valid) {
              if (err) next(err);
              else if (!valid) res.redirect(req.url);
              else {
                req.session.user = data;
                req.session.authorized = true;
                res.redirect(backUrl.toString());
              }
            });
          }
        });
      }
      // Please login
      else res.redirect(req.url);
    });

    // Some secure method
    server.get('/secure', oauth20.middleware.bearer, function (req: AppRequest, res) {
      if (!req.oauth2.accessToken) return res.status(403).send('Forbidden');
      if (!req.oauth2.accessToken.userId) return res.status(403).send('Forbidden');
      res.send('Hi! Dear user ' + req.oauth2.accessToken.userId + '!');
    });

    // Some secure client method
    server.get('/client', oauth20.middleware.bearer, function (req: AppRequest, res) {
      if (!req.oauth2.accessToken) return res.status(403).send('Forbidden');
      res.send('Hi! Dear client ' + req.oauth2.accessToken.clientId + '!');
    });

    // Expose functions
    server.listen(+process.env.AUTH_SERVICE_PORT, process.env.AUTH_SERVICE_HOST, function () {
      console.log('Server started at localhost:' + process.env.AUTH_SERVICE_PORT);
    });
  })
  .catch((error) => console.log(error));
