"""Dry-run the additive migrations against a legacy in-memory SQLite database."""
import sqlite3, json
from pathlib import Path

db = sqlite3.connect(':memory:')
db.executescript(Path('drizzle/0000_safe_blue_marvel.sql').read_text(encoding='utf-8'))
db.execute("INSERT INTO users(id,name,created) VALUES ('legacy','Original','2026-09-18')")
old = json.dumps({'reading':'campus-cups','results':{'cups-1':{'correct':True,'attempts':2}},'hints':{'cups-1':1},'note':'Keep me'})
db.execute("INSERT INTO records(owner,kind,id,data,updated) VALUES ('legacy','session','old',?,'2026-09-18')", (old,))
db.commit()
for name in ['0001_dashing_epoch.sql','0002_brief_the_hunter.sql']:
    db.executescript(Path('drizzle',name).read_text(encoding='utf-8'))
assert db.execute("SELECT data FROM records WHERE id='old'").fetchone()[0] == old
assert db.execute('SELECT COUNT(*) FROM learning_history').fetchone()[0] == 0
alias = db.execute("SELECT participant FROM research_identities WHERE owner='legacy'").fetchone()[0]
assert alias.startswith('P-')
revision = db.execute('SELECT revision FROM research_revision').fetchone()[0]
db.execute("UPDATE users SET research=1 WHERE id='legacy'")
assert db.execute('SELECT revision FROM research_revision').fetchone()[0] > revision
assert db.execute("SELECT participant FROM research_identities WHERE owner='legacy'").fetchone()[0] == alias
print('PASS migration preserves legacy session, invents no history, backfills stable identity and invalidates changed exports.')
