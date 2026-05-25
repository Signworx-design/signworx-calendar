<?php
declare(strict_types=1);

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/response.php';

function now_iso(): string
{
    return gmdate('Y-m-d\TH:i:s\Z');
}

function token_hash(string $token): string
{
    return hash_hmac('sha256', $token, SESSION_SECRET);
}

function issue_session(): array
{
    $token = bin2hex(random_bytes(32));
    $expiresAt = gmdate('Y-m-d\TH:i:s\Z', time() + SESSION_HOURS * 3600);
    $stmt = db()->prepare('INSERT INTO sessions (tokenHash, expiresAt, createdAt) VALUES (?, ?, ?)');
    $stmt->execute([token_hash($token), $expiresAt, now_iso()]);
    return ['token' => $token, 'expiresAt' => $expiresAt];
}

function bearer_token(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
        return trim($matches[1]);
    }
    return '';
}

function valid_session(string $token): bool
{
    if ($token === '') {
        return false;
    }
    $stmt = db()->prepare('SELECT expiresAt FROM sessions WHERE tokenHash = ? LIMIT 1');
    $stmt->execute([token_hash($token)]);
    $row = $stmt->fetch();
    return $row && strtotime($row['expiresAt']) > time();
}

function require_auth(): void
{
    if (!AUTH_REQUIRED) {
        return;
    }

    if (!valid_session(bearer_token())) {
        json_error('Unauthorized', 401);
    }
}
