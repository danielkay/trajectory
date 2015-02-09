# What is Trajectory?

Trajectory is a simple development stack based on PHP micro-framework [Flight](http://flightphp.com) and Front-end MV* Framework [AngularJS](https://angularjs.org/).

# Requirements

Flight requires `PHP 5.3` or greater.

# Installation

To install, clone the repo to the required folder and run the following commands to pull in the development and frontend dependencies:

> npm install

> composer install

> bower install

# Development

Grunt is loaded as a dependency, and a gruntfile.js is provided ready to use with the project.
This includes grunt-contrib-watch, to automatically compile and concatenate SASS and javascript from the '/resources' folder when they are changed.

To use this, simply enter the following command:

> grunt

The main view is stored in the '/view' folder, and partials stored in '/view/pages'.