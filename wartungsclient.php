<?php
require __DIR__ . '/vendor/autoload.php';

\Ratchet\Client\connect('ws://localhost:8085/broadcast')
    ->then(function($conn) {
        $conn->send("In Kürze verbessern wir Abalo für Sie!\n
        Nach einer kurzen Pause sind wir wieder für Sie da!\n
        Versprochen.\n");
    }, function ($e) {
        echo "Could not connect: {$e->getMessage()}\n";
    });
