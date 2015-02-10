var app = angular.module('myApp',['ngRoute', 'lastfmService']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/about', {
            templateUrl: '/view/pages/about.html',
            pageTitle: 'about',
            controller: 'aboutController'
        })
        .when('/chart', {
            templateUrl: '/view/pages/chart.html',
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
app.controller('chartController',function($scope, $location) {
    
});
app.directive('bubbleChart', ['$window', function($window) {
	return {
		restrict: 'A',
		controller: 'chartController',
		link: function($scope, element, attrs) {
			var diameter = 960,
				width = $window.innerWidth,
				height = $window.innerHeight - 98,
                format = d3.format(",d"),
                color = d3.scale.category10();

            var bubble = d3.layout.pack()
                .sort(null)
                .size([width, height])
                .padding(1.5);

            var svg = d3.select(".d3").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "bubble");

            d3.json("view/json.json", function(error, root) {
              var node = svg.selectAll(".node")
                  .data(bubble.nodes(classes(root))
                  .filter(function(d) { return !d.children; }))
                .enter().append("g")
                  .attr("class", "node")
                  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

              node.append("title")
                  .text(function(d) { return d.className + ": " + format(d.value); });

              node.append("circle")
                  .attr("r", function(d) { return d.r; })
                  .style("fill", function(d) { return color(d.packageName); });

              node.append("text")
                  .attr("dy", ".3em")
                  .style("text-anchor", "middle")
                  .text(function(d) { return d.className.substring(0, d.r / 3); });
            });

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
angular.module('lastfmService', ['ngResource'])
	.factory('artistSearch', function(apiUrl, $resource) {
		return $resource(apiUrl + '&method=artist.search&artist=:artist', {}, {
			query: { method: 'GET', params: {}, isArray: false }
		});
	});