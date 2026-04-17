#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_root="$repo_root/codex-skills"
target_root="${CODEX_HOME:-$HOME/.codex}/skills"

if [[ ! -d "$source_root" ]]; then
  echo "Skill source root not found: $source_root" >&2
  exit 1
fi

mkdir -p "$target_root"

installed_count=0

for source_dir in "$source_root"/*; do
  [[ -d "$source_dir" ]] || continue
  [[ -f "$source_dir/SKILL.md" ]] || continue

  skill_name="$(basename "$source_dir")"
  target_dir="$target_root/$skill_name"

  if [[ -e "$target_dir" ]]; then
    backup_dir="${target_dir}.bak.$(date +%Y%m%d%H%M%S)"
    mv "$target_dir" "$backup_dir"
    echo "Backed up existing skill to: $backup_dir"
  fi

  cp -R "$source_dir" "$target_dir"
  echo "Installed UIF skill: $skill_name"
  installed_count=$((installed_count + 1))
done

echo "Installed $installed_count UIF skill(s) to: $target_root"
