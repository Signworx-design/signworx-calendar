<?php
declare(strict_types=1);

const APP_VERSION = '1.0.0';
const AUTH_REQUIRED = false;
const SESSION_HOURS = 12;
const SQLITE_PATH = __DIR__ . '/database/signworx_calendar.sqlite';

$envHash = getenv('SIGNWORX_APP_PASSWORD_HASH');
$envSecret = getenv('SIGNWORX_SESSION_SECRET');

// Development fallback password is "password". Replace this or set SIGNWORX_APP_PASSWORD_HASH before deploying.
define('APP_PASSWORD_HASH', $envHash ?: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi');
define('SESSION_SECRET', $envSecret ?: 'change-this-long-random-session-secret-before-production');
