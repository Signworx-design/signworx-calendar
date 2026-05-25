<?php
declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validation.php';
require_once __DIR__ . '/../middleware/require-auth.php';

cors();
require_method('POST');

$data = read_json();
$id = (int)($data['id'] ?? 0);
if ($id <= 0) {
    json_error('Event id is required.', 422);
}

$errors = validate_event_payload($data);
if ($errors) {
    json_error('Event validation failed.', 422, ['errors' => $errors]);
}

$db = get_db();
$existingStmt = $db->prepare('SELECT * FROM events WHERE id = ?');
$existingStmt->execute([$id]);
$existing = $existingStmt->fetch();
if (!$existing) {
    json_error('Event not found.', 404);
}

$event = event_fields($data);
$user = event_user_name($data);
$now = now_iso();

try {
    $db->beginTransaction();

    $stmt = $db->prepare('UPDATE events SET title = :title, type = :type, clientName = :clientName, siteLocation = :siteLocation, startDate = :startDate, endDate = :endDate, startTime = :startTime, endTime = :endTime, allDay = :allDay, assignedTo = :assignedTo, status = :status, priority = :priority, notes = :notes, updatedByName = :updatedByName, updatedAt = :updatedAt WHERE id = :id');
    $stmt->execute($event + [
        'updatedByName' => $user,
        'updatedAt' => $now,
        'id' => $id,
    ]);

    $activity = $db->prepare('INSERT INTO activity_logs (eventId, action, description, changedByName, createdAt) VALUES (?, ?, ?, ?, ?)');
    $activity->execute([$id, 'updated', 'Updated event: ' . $event['title'], $user, $now]);
    if ($existing['status'] !== $event['status']) {
        $activity->execute([$id, 'status_changed', 'Changed status from ' . $existing['status'] . ' to ' . $event['status'], $user, $now]);
    }

    $existingStmt->execute([$id]);
    $updated = $existingStmt->fetch();

    $db->commit();
    json_success(['event' => normalize_event($updated)]);
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log($exception);
    json_error('Could not update event: ' . $exception->getMessage(), 500);
}
