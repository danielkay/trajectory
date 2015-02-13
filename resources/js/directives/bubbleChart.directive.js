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