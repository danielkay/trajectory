angular.module('lastfmService', ['ngResource'])
	.factory('artistSearch', function(apiUrl, $resource) {
		return $resource(apiUrl + '&method=artist.search&artist=:artist', {}, {
			query: { method: 'GET', params: {}, isArray: false }
		});
	});