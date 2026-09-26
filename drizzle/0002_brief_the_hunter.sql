CREATE UNIQUE INDEX `history_owner_request` ON `learning_history` (`owner`,`request`);
--> statement-breakpoint
INSERT INTO research_revision (id,revision) VALUES (1,0);
--> statement-breakpoint
INSERT INTO research_identities (owner,participant) SELECT id, 'P-' || lower(hex(randomblob(16))) FROM users;

--> statement-breakpoint
CREATE TRIGGER research_rev_users_insert AFTER INSERT ON users BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_users_update AFTER UPDATE ON users BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_users_delete AFTER DELETE ON users BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_records_insert AFTER INSERT ON records WHEN NEW.kind IN ('session','feedback','experiment') BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_records_update AFTER UPDATE ON records WHEN NEW.kind IN ('session','feedback','experiment') BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_records_delete AFTER DELETE ON records WHEN OLD.kind IN ('session','feedback','experiment') BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_events_insert AFTER INSERT ON events BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_events_update AFTER UPDATE ON events BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_events_delete AFTER DELETE ON events BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_learning_history_insert AFTER INSERT ON learning_history BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_learning_history_update AFTER UPDATE ON learning_history BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_learning_history_delete AFTER DELETE ON learning_history BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_research_identities_insert AFTER INSERT ON research_identities BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_research_identities_update AFTER UPDATE ON research_identities BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_research_identities_delete AFTER DELETE ON research_identities BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;

--> statement-breakpoint
CREATE TRIGGER research_rev_content_insert AFTER INSERT ON content_versions BEGIN UPDATE research_revision SET revision=revision+1 WHERE id=1; END;
