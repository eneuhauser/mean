'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', function($resource) {
	return $resource('users', {}, {
		update: {
			method: 'PUT'
		}
	});
});
