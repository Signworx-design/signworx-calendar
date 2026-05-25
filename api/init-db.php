<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$schema = file_get_contents(__DIR__ . '/schema.sql');
get_db()->exec($schema);

echo "SQLite database ready at " . SQLITE_PATH . PHP_EOL;
