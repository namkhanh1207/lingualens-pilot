CREATE TRIGGER research_rev_extended_records_insert AFTER INSERT ON records WHEN NEW.kind IN ('skill_path','vocab_review') BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;
--> statement-breakpoint
CREATE TRIGGER research_rev_extended_records_update AFTER UPDATE ON records WHEN NEW.kind IN ('skill_path','vocab_review') BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;
--> statement-breakpoint
CREATE TRIGGER research_rev_extended_records_delete AFTER DELETE ON records WHEN OLD.kind IN ('skill_path','vocab_review') BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;
