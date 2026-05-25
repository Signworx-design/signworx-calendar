<?php
declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/require-auth.php';

cors();
$eventId = isset($_GET['eventId']) ? (int)$_GET['eventId'] : 0;
if ($eventId > 0) {
    $stmt = get_db()->prepare('SELECT * FROM activity_logs WHERE eventId = ? ORDER BY createdAt DESC LIMIT 100');
    $stmt->execute([$eventId]);
    json_success(['activity' => $stmt->fetchAll()]);
}

$rows = get_db()->query('SELECT * FROM activity_logs ORDER BY createdAt DESC LIMIT 200')->fetchAll();
json_success(['activity' => $rows]);
