app.controller('chartController', function($scope, artistSearch, artistGetSimilar) {
    $scope.artistSearch = function() {
        var res = artistSearch.query({artist: $scope.searchTerm}, function () {
            if(res.results) {
                var artistArray = parseLastFmData(res.results.artistmatches.artist);
                
                if(artistArray.length) {
                    $scope.searchType = 'artist';
                    $scope.artistData = { name: "lastFmData", children: artistArray };
                }
            }
        });
    };

    $scope.artistGetSimilar = function() {
        var res = artistGetSimilar.query({artist: $scope.searchTerm}, function () {
            if(res.similarartists) {
                var artistArray = parseLastFmData(res.similarartists.artist);
                if(artistArray.length) {
                    $scope.searchType = 'similar';
                    $scope.artistData = { name: "lastFmData", children: artistArray };
                }
            }
        });
    };
    
    function parseLastFmData(data) {
        var artistArray = [];

        if(data && data.image) {
            var artist = {
                name: data.name,
                size: (data.match) ? data.match : data.listeners
            };

            if(data.image)
                artist['image'] = data.image[0]['#text'];

            artistArray.push(artist);
        } else {
            angular.forEach(data, function(value, key) {
                var artist = {
                    name: value['name'],
                    size: (value['match']) ? value['match'] : value['listeners']
                };

                if(value['image'])
                    artist['image'] = value['image'][0]['#text'];

                artistArray.push(artist);
            });
        }
        
        return artistArray;
    }
    
    $scope.searchAgain = function() {
        switch($scope.searchType) {
            case 'artist':
                $scope.artistSearch();
                break;
            case 'similar':
                $scope.artistGetSimilar();
                break;
        }
    };
});