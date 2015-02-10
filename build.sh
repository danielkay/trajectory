#!/bin/bash

apt-get install curl
curl -sL https://deb.nodesource.com/setup | bash - 
apt-get install -y nodejs 
php -r "readfile('https://getcomposer.org/installer');" | php 
php composer.phar install
npm install bower