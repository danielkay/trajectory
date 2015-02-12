var BASE_URL = "http://ws.audioscrobbler.com/2.0/?api_key=198aaad97ed3a7ae97043ccc5a327ba6&format=json";

angular.module('lastfmService', ['ngResource'])
	.factory('artistSearch', function($resource) {
		return $resource(BASE_URL + '&method=artist.search&artist=:artist', {}, {
			query: { method: 'GET', params: {}, isArray: false }
		});
	});