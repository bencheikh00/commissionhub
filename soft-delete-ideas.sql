-- Ajouter colonne deleted_at pour soft delete
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_ideas_deleted_at ON ideas(deleted_at);
