<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');

function cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, ['http://127.0.0.1:5173', 'http://localhost:5173'], true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    } else {
        header('Access-Control-Allow-Origin: http://127.0.0.1:5173');
    }
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function json_success(array $data = []): void
{
    json_response(['success' => true] + $data);
}

function json_error(string $message, int $status = 400, array $extra = []): void
{
    json_response(['success' => false, 'message' => $message] + $extra, $status);
}

function read_json(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        json_error('Method not allowed.', 405);
    }
}

set_exception_handler(function (Throwable $exception): void {
    error_log($exception);
    if (!headers_sent()) {
        cors();
        json_error('Server error: ' . $exception->getMessage(), 500);
    }
});
