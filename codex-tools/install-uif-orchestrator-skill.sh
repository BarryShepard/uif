#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$repo_root/codex-skills/uif-orchestrator"
target_root="${CODEX_HOME:-$HOME/.codex}/skills"
target_dir="$target_root/uif-orchestrator"

if [[ ! -d "$source_dir" ]]; then
  echo "Skill source not found: $source_dir" >&2
  exit 1
fi

mkdir -p "$target_root"

if [[ -e "$target_dir" ]]; then
  backup_dir="${target_dir}.bak.$(date +%Y%m%d%H%M%S)"
  mv "$target_dir" "$backup_dir"
  echo "Backed up existing skill to: $backup_dir"
fi

cp -R "$source_dir" "$target_dir"
echo "Installed UIF skill to: $target_dir"
