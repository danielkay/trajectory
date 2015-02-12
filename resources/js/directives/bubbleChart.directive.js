app.directive('bubbleChart', ['$window', 'artistSearch', function($window, artistSearch) {
	return {
		restrict: 'A',
		controller: 'chartController',
		link: function($scope, element, attrs) {
            function imageTfr (images){
                for (var i in images){
                    images[images[i]['size']] = images[i]['#text'];
                }
            }
            
            var res = artistSearch.query({artist: 'ghost'}, function () {
                var lastFmData = res.results.artistmatches.artist;
                for (var a in lastFmData) imageTfr(lastFmData[a].image);
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
                $scope.artistData = { name: "lastFmData", children: artistArray };
            })
            
            $scope.$watch("artistData", function(n,o) {
               if(n==o) return;
                
                var width = $window.innerWidth,
                    height = $window.innerHeight - 98,
                    format = d3.format(",d"),
                    color = d3.scale.category10();

                var bubble = d3.layout.pack()
                    .sort(null)
                    .size([width, height])
                    .padding(18);

                var svg = d3.select(".d3").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "bubble");

                console.log($scope.artistData);
                var root = $scope.artistData;
                var node = svg.selectAll(".node")
                    .data(bubble.nodes(classes(root))
                    .filter(function(d) { return !d.children; }))
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .style("cursor","pointer");

                d3.selectAll(".node").append("title")
                    .text(function(d) { return d.className + ": " + format(d.value); });

                node.append("circle")
                    .attr("r", function(d) { return d.r; })
                    .style("fill", "#202020")
                    .on("mouseover", function() {
                        d3.select(this)
                            .style("fill","red");
                    })
                    .on("mouseout", function() {
                        d3.select(this)
                            .style("fill", "#202020");
                    });

                d3.select(".node").append("text")
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .text(function(d) { return d.className; });

                // Returns a flattened hierarchy containing all leaf nodes under the root.
                function classes(root) {
                  var classes = [];

                  function recurse(name, node) {
                    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
                    else classes.push({packageName: name, className: node.name, value: node.size});
                  }

                  recurse(null, root);
                  return {children: classes};
                }

                d3.select(self.frameElement).style("height", height + "px");
            });
		}
	}
}]);