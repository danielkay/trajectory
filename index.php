<?php

    require 'vendor/mikecao/flight/flight/Flight.php';

    Flight::route('*', function(){
        include 'view/index.html';
    });

    Flight::start();

?>
