<?php
declare(strict_types=1);

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

cors();
json_response(['valid' => valid_session(bearer_token())], valid_session(bearer_token()) ? 200 : 401);
