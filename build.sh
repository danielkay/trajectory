#!/bin/bash

curl -sL https://deb.nodesource.com/setup | bash - 
yum install -y nodejs
php -r "readfile('https://getcomposer.org/installer');" | php 
php composer.phar install
npm install bower