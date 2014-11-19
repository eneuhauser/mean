'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
    // User Routes
    var authentication = require('./authentication.controller.js'),
        authorization = require('./authorization.controller.js'),
        password = require('./password.controller.js');

    // Setting up the users password api
    app.route('/auth/forgot').post(password.forgot);
    app.route('/auth/reset/:token').get(password.validateResetToken);
    app.route('/auth/reset/:token').post(password.reset);
    app.route('/auth/password').post(password.changePassword);

    // Setting up the users authentication api
    app.route('/auth/signup').post(authentication.signup);
    app.route('/auth/signin').post(authentication.signin);
    app.route('/auth/signout').get(authentication.signout);

    // Setting the facebook oauth routes
    app.route('/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.route('/auth/facebook/callback').get(authentication.oauthCallback('facebook'));

    // Setting the google oauth routes
    app.route('/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.route('/auth/google/callback').get(authentication.oauthCallback('google'));

    // Setting the standard oauth routes
    ['twitter', 'linkedin', 'github'].forEach(function(provider) {
        app.route('/auth/'+provider).get(passport.authenticate(provider));
        app.route('/auth/'+provider+'/callback').get(authentication.oauthCallback(provider));
    });

    // Removing social account
    app.route('/auth/accounts').delete(authentication.removeOAuthProvider);

    // Finish by binding the user middleware
    app.param('userId', authorization.userByID);
};
