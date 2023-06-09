<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require __DIR__ . '/vendor/autoload.php';

class Uebung implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        foreach ($this->clients as $client) {
            if ($from != $client) {
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        echo "Closing connection\n";
        $this->clients->detach($conn);
    }
    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Closing connection with errors\n";
        $conn->close();
    }
}
class Broadcast implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        echo "connected to server\n";
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Received: " . $msg;
        foreach ($this->clients as $client) {
            if ($from != $client) {
                $client -> send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        echo "Closing connection\n";
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Closing connection with errors\n";
        $conn->close();
    }
}

$app = new Ratchet\App('localhost', 8085);
$app->route('/uebung', new Uebung, array('*'));
$app->route('/broadcast', new Broadcast, array('*'));

echo "Starting WebSocketServer\n";
$app->run();
