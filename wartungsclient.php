<?php
require __DIR__ . '/vendor/autoload.php';

\Ratchet\Client\connect('ws://localhost:8085/broadcast')
    ->then(function($conn) {
        $data = [
            "message" => "In Kürze verbessern wir Abalo für Sie!\nNach einer kurzen Pause sind wir wieder für Sie da!\nVersprochen.\n",
            "type" => "maintenance"
        ];
        $conn->send("");
    }, function ($e) {
        echo "Could not connect: {$e->getMessage()}\n";
    });
