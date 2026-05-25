CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  clientName TEXT,
  siteLocation TEXT,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  startTime TEXT,
  endTime TEXT,
  allDay INTEGER DEFAULT 0,
  assignedTo TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  notes TEXT,
  createdByName TEXT,
  updatedByName TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eventId INTEGER NOT NULL,
  message TEXT NOT NULL,
  userName TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY(eventId) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  eventId INTEGER,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  changedByName TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tokenHash TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(startDate);
CREATE INDEX IF NOT EXISTS idx_comments_event_id ON comments(eventId);
CREATE INDEX IF NOT EXISTS idx_activity_event_id ON activity_logs(eventId);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(tokenHash);
