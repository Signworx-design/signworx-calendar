<?php
declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validation.php';
require_once __DIR__ . '/../middleware/require-auth.php';

cors();
require_method('POST');

$data = read_json();
$eventId = (int)($data['eventId'] ?? 0);
$message = clean_string($data['message'] ?? '');
$user = event_user_name($data);
if ($eventId <= 0 || $message === '') {
    json_error('Comment message is required.', 422);
}

$db = get_db();
$exists = $db->prepare('SELECT title FROM events WHERE id = ?');
$exists->execute([$eventId]);
$event = $exists->fetch();
if (!$event) {
    json_error('Event not found.', 404);
}

try {
    $db->beginTransaction();

    $now = now_iso();
    $stmt = $db->prepare('INSERT INTO comments (eventId, message, userName, createdAt) VALUES (?, ?, ?, ?)');
    $stmt->execute([$eventId, $message, $user, $now]);
    $id = (int)$db->lastInsertId();

    $activity = $db->prepare('INSERT INTO activity_logs (eventId, action, description, changedByName, createdAt) VALUES (?, ?, ?, ?, ?)');
    $activity->execute([$eventId, 'comment_added', 'Added comment to: ' . $event['title'], $user, $now]);

    $fetch = $db->prepare('SELECT * FROM comments WHERE id = ?');
    $fetch->execute([$id]);
    $comment = $fetch->fetch();

    $db->commit();
    json_success(['comment' => $comment]);
} catch (Throwable $exception) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log($exception);
    json_error('Could not create comment: ' . $exception->getMessage(), 500);
}
