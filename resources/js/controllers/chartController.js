app.controller('chartController', function($scope, artistSearch, artistGetSimilar) {
    $scope.artistSearch = function() {
        var res = artistSearch.query({artist: $scope.searchTerm}, function () {
            if(res.results) {
                $scope.lastFmArtists = res.results.artistmatches.artist;
                var artistArray = [];

                angular.forEach($scope.lastFmArtists, function(value, key) {
                    var artist = {
                        name: value['name'],
                        size: value['listeners'],
                        image: value['image'][0]['#text']
                    }
                    artistArray.push(artist);
                });
                $scope.searchType = 'artist';
                $scope.artistData = { name: "lastFmData", children: artistArray };
            }
        });
    };

    $scope.artistGetSimilar = function() {
        var res = artistGetSimilar.query({artist: $scope.searchTerm}, function () {
            if(res.similarartists) {
                $scope.lastFmArtists = res.similarartists.artist;
                var artistArray = [];

                angular.forEach($scope.lastFmArtists, function(value, key) {
                    var artist = {
                        name: value['name'],
                        size: value['match'],
                        image: value['image'][0]['#text']
                    }
                    artistArray.push(artist);
                });
                $scope.searchType = 'similar';
                $scope.artistData = { name: "lastFmData", children: artistArray };
            }
        });
    };
});