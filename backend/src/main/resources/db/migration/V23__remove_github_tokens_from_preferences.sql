-- GitHub tokens must never be kept in a server-side JSON preferences blob.
UPDATE user_settings
SET preferences = preferences - 'githubPat' - 'githubRepo'
WHERE preferences IS NOT NULL
  AND (preferences ? 'githubPat' OR preferences ? 'githubRepo');
