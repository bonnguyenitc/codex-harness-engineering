#!/usr/bin/env bash

# scripts/publish.sh
#
# Bump version, verify package contents, publish to npm, then commit/tag/push.
#
# Usage:
# ./scripts/publish.sh                    # patch bump
# ./scripts/publish.sh minor              # minor bump
# ./scripts/publish.sh major              # major bump
# ./scripts/publish.sh 0.2.0              # exact version
# ./scripts/publish.sh patch --otp 123456 # npm 2FA

set -euo pipefail

cd "$(dirname "$0")/.."

BUMP="patch"
OTP="${NPM_CONFIG_OTP:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --otp)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for --otp"
        exit 1
      fi
      OTP="$2"
      shift 2
      ;;
    --otp=*)
      OTP="${1#--otp=}"
      shift
      ;;
    patch|minor|major|prepatch|preminor|premajor|prerelease)
      BUMP="$1"
      shift
      ;;
    [0-9]*)
      BUMP="$1"
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: ./scripts/publish.sh [patch|minor|major|x.y.z] [--otp 123456]"
      exit 1
      ;;
  esac
done

PACKAGE_NAME="$(node -p "require('./package.json').name")"
CURRENT_VERSION="$(node -p "require('./package.json').version")"
BRANCH="$(git branch --show-current)"
NEW_VERSION=""
PUBLISHED=0

rollback_version() {
  if [[ "$PUBLISHED" -eq 0 && -n "$NEW_VERSION" ]]; then
    echo ""
    echo "Publish did not complete. Rolling package.json back to $CURRENT_VERSION..."
    npm version "$CURRENT_VERSION" --no-git-tag-version >/dev/null 2>&1 || true
  fi
}

on_error() {
  rollback_version
  exit 1
}

trap on_error ERR

if [[ -z "$BRANCH" ]]; then
  echo "Cannot determine current git branch."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit or stash changes before publishing."
  git status --short
  exit 1
fi

if ! npm whoami >/dev/null 2>&1; then
  echo "Not logged in to npm. Run: npm login"
  exit 1
fi

echo "Package: $PACKAGE_NAME"
echo "Current version: $CURRENT_VERSION"
echo "Bump: $BUMP"
echo "Branch: $BRANCH"
echo ""

if [[ "$BUMP" == "$CURRENT_VERSION" ]]; then
  NEW_VERSION="$CURRENT_VERSION"
  echo "Version is already $NEW_VERSION; skipping npm version."
else
  NEW_VERSION="$(npm version "$BUMP" --no-git-tag-version)"
  NEW_VERSION="${NEW_VERSION#v}"
fi

echo "New version: $NEW_VERSION"
echo ""

echo "Running tests..."
npm test

echo ""
echo "Checking package contents..."
npm pack --dry-run

echo ""
echo "Publishing $PACKAGE_NAME@$NEW_VERSION to npm..."
PUBLISH_ARGS=(publish --access public)
if [[ -n "$OTP" ]]; then
  PUBLISH_ARGS+=(--otp "$OTP")
fi
npm "${PUBLISH_ARGS[@]}"
PUBLISHED=1

echo ""
echo "Committing and tagging release..."
git add package.json
if [[ -f package-lock.json ]]; then
  git add package-lock.json
fi
if ! git diff --cached --quiet; then
  git commit -m "chore: publish $PACKAGE_NAME@$NEW_VERSION"
else
  echo "No version file changes to commit."
fi
if git rev-parse "v$NEW_VERSION" >/dev/null 2>&1; then
  echo "Tag v$NEW_VERSION already exists; skipping tag creation."
else
  git tag "v$NEW_VERSION"
fi

echo ""
echo "Pushing $BRANCH and tags..."
git push origin "$BRANCH" --tags

echo ""
echo "Done: $PACKAGE_NAME@$NEW_VERSION"
echo "https://www.npmjs.com/package/$PACKAGE_NAME"
