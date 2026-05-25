<?php
declare(strict_types=1);

require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/db.php';

cors();

$db = get_db();
$requiredTables = ['events', 'comments', 'activity_logs', 'sessions'];
$found = $db->query("SELECT name FROM sqlite_master WHERE type = 'table'")->fetchAll(PDO::FETCH_COLUMN);
$missing = array_values(array_diff($requiredTables, $found));
if ($missing) {
    json_error('Missing database tables.', 500, ['missing' => $missing]);
}

$now = gmdate('Y-m-d\TH:i:s\Z');

try {
    $db->beginTransaction();

    $insert = $db->prepare('INSERT INTO events (title, type, clientName, siteLocation, startDate, endDate, startTime, endTime, allDay, assignedTo, status, priority, notes, createdByName, updatedByName, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $insert->execute([
        'API Smoke Test Job',
        'installation',
        'Test Client',
        'Mossel Bay',
        '2026-05-25',
        '2026-05-25',
        '08:00',
        '10:00',
        0,
        'Team',
        'planned',
        'normal',
        'Testing SQLite event save.',
        'API Test',
        'API Test',
        $now,
        $now,
    ]);

    $id = (int)$db->lastInsertId();
    $event = $db->prepare('SELECT * FROM events WHERE id = ?');
    $event->execute([$id]);
    $created = $event->fetch();

    $delete = $db->prepare('DELETE FROM events WHERE id = ?');
    $delete->execute([$id]);

    $db->commit();
    json_success([
        'dbConnected' => true,
        'tables' => $found,
        'insertedId' => $id,
        'createdEvent' => $created,
        'deletedTestEvent' => true,
    ]);
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log($exception);
    json_error('API smoke test failed: ' . $exception->getMessage(), 500);
}
