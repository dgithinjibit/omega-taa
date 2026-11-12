#!/bin/sh
set -eu

project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
temporary_directory=$(mktemp -d)
trap 'rm -f "$temporary_directory/co_tutor.metta"; rmdir "$temporary_directory"' EXIT

cd "$project_root"
awk -v skills_file="$project_root/backend/metta/skills.metta" '
  $0 == "; @@INSERT_CO_TUTOR_SKILLS@@" {
    while ((getline line < skills_file) > 0) {
      print line
    }
    close(skills_file)
    next
  }
  { print }
' tests/metta_co_tutor.metta > "$temporary_directory/co_tutor.metta"

output=$(metta "$temporary_directory/co_tutor.metta")
printf '%s\n' "$output"

case "$output" in
 *TEST-FAIL*)
   echo "MeTTa co-tutor tests failed." >&2
   exit 1
   ;;
 *TEST-PASS*)
   ;;
 *)
   echo "MeTTa co-tutor tests did not execute." >&2
   exit 1
   ;;
esac
