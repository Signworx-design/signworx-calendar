<?php
declare(strict_types=1);

const EVENT_TYPES = ['installation', 'maintenance', 'quote', 'meeting', 'delivery', 'production', 'follow_up', 'apparel', 'vehicle_branding', 'signage', 'other'];
const EVENT_STATUSES = ['planned', 'in_progress', 'completed', 'cancelled', 'needs_attention'];
const EVENT_PRIORITIES = ['low', 'normal', 'high', 'urgent'];

function clean_string(mixed $value): string
{
    return trim((string)($value ?? ''));
}

function validate_event_payload(array $data): array
{
    $errors = [];
    $startDate = clean_string($data['startDate'] ?? '');
    $endDate = clean_string($data['endDate'] ?? '');
    $type = clean_string($data['type'] ?? '');
    $status = clean_string($data['status'] ?? '');
    $priority = clean_string($data['priority'] ?? '');

    if (clean_string($data['title'] ?? '') === '') {
        $errors['title'] = 'Title is required.';
    }
    if (!in_array($type, EVENT_TYPES, true)) {
        $errors['type'] = 'Type is required.';
    }
    if ($startDate === '') {
        $errors['startDate'] = 'Start date is required.';
    }
    if ($endDate === '') {
        $errors['endDate'] = 'End date is required.';
    }
    if ($startDate !== '' && $endDate !== '' && $endDate < $startDate) {
        $errors['endDate'] = 'End date cannot be before start date.';
    }
    if (!in_array($status, EVENT_STATUSES, true)) {
        $errors['status'] = 'Status is required.';
    }
    if (!in_array($priority, EVENT_PRIORITIES, true)) {
        $errors['priority'] = 'Priority is required.';
    }

    return $errors;
}

function event_fields(array $data): array
{
    return [
        'title' => clean_string($data['title'] ?? ''),
        'type' => clean_string($data['type'] ?? ''),
        'clientName' => clean_string($data['clientName'] ?? ''),
        'siteLocation' => clean_string($data['siteLocation'] ?? ''),
        'startDate' => clean_string($data['startDate'] ?? ''),
        'endDate' => clean_string($data['endDate'] ?? ''),
        'startTime' => clean_string($data['startTime'] ?? ''),
        'endTime' => clean_string($data['endTime'] ?? ''),
        'allDay' => !empty($data['allDay']) ? 1 : 0,
        'assignedTo' => clean_string($data['assignedTo'] ?? ''),
        'status' => clean_string($data['status'] ?? ''),
        'priority' => clean_string($data['priority'] ?? ''),
        'notes' => clean_string($data['notes'] ?? ''),
    ];
}

function event_user_name(array $data, string $fallback = 'Unknown User'): string
{
    $name = clean_string($data['changedByName'] ?? $data['userName'] ?? $data['createdByName'] ?? $data['updatedByName'] ?? '');
    return $name !== '' ? $name : $fallback;
}

function normalize_event(array $event): array
{
    if (array_key_exists('allDay', $event)) {
        $event['allDay'] = (bool)$event['allDay'];
    }
    return $event;
}
