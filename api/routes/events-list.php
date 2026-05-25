<?php
declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validation.php';
require_once __DIR__ . '/../middleware/require-auth.php';

cors();

$rows = get_db()->query('SELECT * FROM events ORDER BY startDate ASC, startTime ASC, id DESC')->fetchAll();
$events = array_map('normalize_event', $rows);

json_success(['events' => $events]);
