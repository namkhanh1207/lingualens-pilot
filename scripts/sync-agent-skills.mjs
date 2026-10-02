// Copy shared skills from .agents/skills (read by Codex and Antigravity) to .claude/skills (read by Claude Code).
// Symlinks need admin rights on Windows, so a plain copy is used. Run after editing any shared skill.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';

const source = '.agents/skills';
const target = '.claude/skills';
if (!existsSync(source)) throw new Error(`Missing ${source}`);
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log(`Synced ${source} -> ${target}`);
