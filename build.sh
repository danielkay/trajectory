#!/bin/bash

php -r "readfile('https://getcomposer.org/installer');" | php 
php composer.phar install