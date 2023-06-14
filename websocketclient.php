<?php
/**
 * /websocketclient.php (im Laravel-Wurzelverzeichnis)
 * composer.json +Abhängigkeit: ratchet/pawl
 * Quelle des Beispiels: https://github.com/ratchetphp/Pawl (Letzter Zugriff 8.3.2022)
 */
require __DIR__ . '/vendor/autoload.php';

\Ratchet\Client\connect('ws://localhost:8085/uebung')
    ->then(function($conn) {
        $conn->on('message', function($msg) use ($conn) {
            echo "Received: {$msg}\n";
        });
        $conn->send('Test');
    }, function ($e) {
        echo "Could not connect: {$e->getMessage()}\n";
    });
