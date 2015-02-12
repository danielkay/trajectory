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

                var svg = d3.select(".d3").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "bubble");

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
            }
		}
	}
}]);