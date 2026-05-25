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

$user = event_user_name($data);
$db = get_db();
$stmt = $db->prepare('SELECT title FROM events WHERE id = ?');
$stmt->execute([$id]);
$event = $stmt->fetch();
if (!$event) {
    json_error('Event not found.', 404);
}

try {
    $db->beginTransaction();

    $activity = $db->prepare('INSERT INTO activity_logs (eventId, action, description, changedByName, createdAt) VALUES (?, ?, ?, ?, ?)');
    $activity->execute([$id, 'deleted', 'Deleted event: ' . $event['title'], $user, now_iso()]);

    $delete = $db->prepare('DELETE FROM events WHERE id = ?');
    $delete->execute([$id]);

    $db->commit();
    json_success(['deletedId' => $id]);
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log($exception);
    json_error('Could not delete event: ' . $exception->getMessage(), 500);
}
