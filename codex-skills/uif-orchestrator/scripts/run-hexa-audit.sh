#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
script_path="$repo_root/packages/kaspersky-hexa-ui/scripts/audit-component-contracts.mjs"

if [[ ! -f "$script_path" ]]; then
  echo "Could not find packages/kaspersky-hexa-ui/scripts/audit-component-contracts.mjs from: $repo_root" >&2
  exit 1
fi

node "$script_path" "$@"
