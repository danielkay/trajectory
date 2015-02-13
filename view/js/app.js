var app = angular.module('myApp',['ngRoute', 'lastfmService']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/about', {
            templateUrl: '/view/pages/about.html',
            pageTitle: 'About',
            controller: 'aboutController'
        })
        .when('/chart/pack', {
            templateUrl: '/view/pages/bubbleChart.html',
            pageTitle: 'Bubble Chart',
            controller: 'chartController'
        })
        .otherwise({
            redirectTo: '/'
        });
    
    $locationProvider.html5Mode(true);
});

app.run(['$location','$rootScope',function($location, $rootScope) {
    $rootScope.title = 'Trajectory';
    $rootScope.navigate = function(route) {
        $location.path('/'+route);
    };
}]); 
app.controller('aboutController',function($scope, $location) {
    
});
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
app.directive('bubbleChart', ['$window', function($window) {
	return {
		restrict: 'A',
		controller: 'chartController',
		link: function($scope, element, attrs) {
            var active = false;
            
            var w = angular.element($window);
            $scope.getWindowDimensions = function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            
            angular.element($window).on('resize', function(){
                $scope.$apply();
                
                if(active)
                    renderChart();
            });
        
            $scope.$watch("artistData", function(n,o) {
                if(n==o) return;
                renderChart();
            });
            
            $scope.clear = function() {
                $scope.searchTerm = '';
                element.empty();
            }
            
            function renderChart() {
                active = true;
                
                element.empty();
                
                var width = $window.innerWidth,
                    height = $window.innerHeight - 98,
                    format = d3.format(",d"),
                    color = d3.scale.category10();

                var bubble = d3.layout.pack()
                    .sort(null)
                    .size([width, height])
                    .padding(18);

                var root = $scope.artistData;

                var svg = d3.select(".d3").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "bubble");
                
//                var defs = d3.select("svg")
//                    .append("svg:defs")
//                    .attr("id","mdef")
//                    .selectAll("pattern")
//                    .data(bubble.nodes(classes(root))
//                    .filter(function(d) { return !d.children; }))
//                    .enter().append("pattern")
//                    .attr("id", function(d) { return "image"+d.value; })
//                    .attr('patternUnits', 'userSpaceOnUse')
//                    .attr("x", 0)
//                    .attr("y", 0)
//                    .attr("width", function(d) { return Math.round(d.x/10); })
//                    .attr("height", function(d) { return Math.round(d.x/10); })
//                    .append("svg:image")
//                    .attr("x", 0)
//                    .attr("y", 0)
//                    .attr("width", function(d) { return Math.round(d.x/10); })
//                    .attr("height", function(d) { return Math.round(d.x/10); })
//                    .attr("xlink:href", function(d) { return d.image; });
                    
                var node = svg.selectAll(".node")
                    .data(bubble.nodes(classes(root))
                    .filter(function(d) { return !d.children; }))
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .style("cursor", "pointer");

                switch($scope.searchType) {
                    case 'artist':
                        d3.selectAll(".node")
                            .append("title")
                            .text(function(d) { return format(d.value) + " listeners"; });
                        break;
                    case 'similar':
                        d3.selectAll(".node")
                            .append("title")
                            .text(function(d) { return d.value*100 + "% similarity"; });
                        break;
                }

                node.append("circle")
                    .attr("r", function(d) { return d.r; })
                    .style("fill", "#202020")
                    .on("mouseenter", function() {
                        d3.select(this)
                            .style("fill", "red");
                        
                        if(d3.select(this)[0][0].nextSibling) {
                            node.select("text").remove();
                            d3.select(this.parentNode)
                                .append("text")
                                .attr("dy", ".3em")
                                .style("text-anchor", "middle")
                                .style("pointer-events", "none")
                                .text(function(d) { return d.className });
                        }
                    })
                    .on("mouseleave", function() {
                        d3.select(this)
                            .style("fill", "#202020");
                        
                        if(d3.select(this)[0][0].nextSibling) {
                            node.select("text").remove();
                            node.append("text")
                                .attr("dy", ".3em")
                                .style("text-anchor", "middle")
                                .style("pointer-events", "none")
                                .text(function(d) { return d.className.substring(0, d.r / 3); });
                        }
                    })
                    .on("mousedown", function() {
                        $scope.searchTerm = d3.select(this)[0][0].nextSibling.innerHTML
                        $scope.searchAgain();
                    });

//                d3.select(".node").append("text")
//                    .attr("dy", ".3em")
//                    .style("text-anchor", "middle")
//                    .text(function(d) { return d.className; });
                    
                node.append("text")
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .style("pointer-events", "none")
                    .text(function(d) { return d.className.substring(0, d.r / 3); });

                // Returns a flattened hierarchy containing all leaf nodes under the root.
                function classes(root) {
                    var classes = [];

                    function recurse(name, node) {
                        if (node.children) {
                            node.children.forEach(function(child) {
                                recurse(node.name, child);
                            });
                        } else {
                            classes.push({packageName: name, className: node.name, value: node.size, image: (node.image) ? node.image : ''});
                        }
                    }

                    recurse(null, root);
                    return {children: classes};
                }

                d3.select(self.frameElement).style("height", height + "px");
            }
		}
	}
}]);
app.directive('circlePack', ['$window', function($window) {
	return {
		restrict: 'A',
		controller: 'chartController',
		link: function($scope, element, attrs) {
			var margin = 20,
			    diameter = 960,
				width = $window.innerWidth,
				height = $window.innerHeight - 98;

			var color = d3.scale.linear()
			    .domain([0, 5])
			    .range(["hsl(255,0%,60%)", "hsl(0,100%,0%)"])
			    .interpolate(d3.interpolateHcl);

			var pack = d3.layout.pack()
			    .padding(2)
			    .size([width - margin, height - margin])
			    .value(function(d) { return d.size; })

			var svg = d3.select(".d3").append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			d3.json('view/json.json', function(error, root) {
			  if (error) return console.error(error);

			  var focus = root,
			      nodes = pack.nodes(root),
			      view;

			  var circle = svg.selectAll("circle")
			      .data(nodes)
			    .enter().append("circle")
			      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
			      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
			      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

			  var text = svg.selectAll("text")
			      .data(nodes)
			    .enter().append("text")
			      .attr("class", "label")
			      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
			      .style("display", function(d) { return d.parent === root ? null : "none"; })
			      .text(function(d) { return d.name; });

			  var node = svg.selectAll("circle,text");

			  d3.select("body")
			      .on("click", function() { zoom(root); });

			  zoomTo([root.x, root.y, root.r * 2 + margin]);

			  function zoom(d) {
			    var focus0 = focus; focus = d;

			    var transition = d3.transition()
			        .duration(d3.event.altKey ? 7500 : 750)
			        .tween("zoom", function(d) {
			          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
			          return function(t) { zoomTo(i(t)); };
			        });

			    transition.selectAll("text")
			      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
			        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
			        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
			        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
			  }

			  function zoomTo(v) {
			    var k = height / v[2]; view = v;
			    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
			    circle.attr("r", function(d) { return d.r * k; });
			  }
			});

			d3.select(self.frameElement).style("height", height + "px");
		}
	}
}]);
var BASE_URL = "http://ws.audioscrobbler.com/2.0/?api_key=198aaad97ed3a7ae97043ccc5a327ba6&format=json";

angular.module('lastfmService', ['ngResource'])
    .factory('artistSearch', function($resource) {
        return $resource(BASE_URL + '&method=artist.search&artist=:artist', {}, {
            query: { method: 'GET', params: {}, isArray: false }
        });
    }).factory('artistGetSimilar', function($resource) {
        return $resource(BASE_URL + '&method=artist.getSimilar&artist=:artist', {}, {
            query: { method: 'GET', params: {}, isArray: false }
        });
    });