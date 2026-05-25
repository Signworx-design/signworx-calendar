<?php
declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/require-auth.php';

cors();
$eventId = (int)($_GET['eventId'] ?? 0);
$stmt = get_db()->prepare('SELECT * FROM comments WHERE eventId = ? ORDER BY createdAt ASC');
$stmt->execute([$eventId]);
json_success(['comments' => $stmt->fetchAll()]);
