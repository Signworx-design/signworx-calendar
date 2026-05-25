<?php
declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validation.php';
require_once __DIR__ . '/../middleware/require-auth.php';

cors();
require_method('POST');

$data = read_json();
$errors = validate_event_payload($data);
if ($errors) {
    json_error('Event validation failed.', 422, ['errors' => $errors]);
}

$db = get_db();
$event = event_fields($data);
$user = event_user_name($data);
$now = now_iso();

try {
    $db->beginTransaction();

    $stmt = $db->prepare('INSERT INTO events (title, type, clientName, siteLocation, startDate, endDate, startTime, endTime, allDay, assignedTo, status, priority, notes, createdByName, updatedByName, createdAt, updatedAt) VALUES (:title, :type, :clientName, :siteLocation, :startDate, :endDate, :startTime, :endTime, :allDay, :assignedTo, :status, :priority, :notes, :createdByName, :updatedByName, :createdAt, :updatedAt)');
    $stmt->execute($event + [
        'createdByName' => $user,
        'updatedByName' => $user,
        'createdAt' => $now,
        'updatedAt' => $now,
    ]);

    $id = (int)$db->lastInsertId();
    $activity = $db->prepare('INSERT INTO activity_logs (eventId, action, description, changedByName, createdAt) VALUES (?, ?, ?, ?, ?)');
    $activity->execute([$id, 'created', 'Created event: ' . $event['title'], $user, $now]);

    $fetch = $db->prepare('SELECT * FROM events WHERE id = ?');
    $fetch->execute([$id]);
    $created = $fetch->fetch();

    $db->commit();
    json_success(['event' => normalize_event($created)]);
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log($exception);
    json_error('Could not create event: ' . $exception->getMessage(), 500);
}
