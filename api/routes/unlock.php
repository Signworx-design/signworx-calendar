<?php
declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

cors();
$data = read_json();
$password = (string)($data['password'] ?? '');

if (!password_verify($password, APP_PASSWORD_HASH)) {
    json_response(['success' => false, 'error' => 'Incorrect password.'], 401);
}

json_response(['success' => true] + issue_session());
