<?php
require __DIR__ . '/vendor/autoload.php';

\Ratchet\Client\connect('ws://localhost:8085/uebung')
    ->then(function($conn) {
        $conn->on('message', function($msg) use ($conn) {
            echo "Received: {$msg}\n";
        });
        $data = [
            "message" => "Test",
            "id" => 1
        ];
        $data = json_encode($data);
        $conn->send($data);
    }, function ($e) {
        echo "Could not connect: {$e->getMessage()}\n";
    });
