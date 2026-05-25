<?php
declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

cors();
$token = bearer_token();
if ($token !== '') {
    $stmt = db()->prepare('DELETE FROM sessions WHERE tokenHash = ?');
    $stmt->execute([token_hash($token)]);
}
json_response(['success' => true]);
