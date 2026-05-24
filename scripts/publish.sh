#!/usr/bin/env bash

# scripts/publish.sh
#
# Bump version, verify package contents, publish to npm, then commit/tag/push.
#
# Usage:
# ./scripts/publish.sh        # patch bump
# ./scripts/publish.sh minor  # minor bump
# ./scripts/publish.sh major  # major bump
# ./scripts/publish.sh 0.2.0  # exact version

set -euo pipefail

cd "$(dirname "$0")/.."

BUMP="${1:-patch}"
PACKAGE_NAME="$(node -p "require('./package.json').name")"
CURRENT_VERSION="$(node -p "require('./package.json').version")"
BRANCH="$(git branch --show-current)"

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

NEW_VERSION="$(npm version "$BUMP" --no-git-tag-version)"
NEW_VERSION="${NEW_VERSION#v}"

echo "New version: $NEW_VERSION"
echo ""

echo "Running tests..."
npm test

echo ""
echo "Checking package contents..."
npm pack --dry-run

echo ""
echo "Publishing $PACKAGE_NAME@$NEW_VERSION to npm..."
npm publish --access public

echo ""
echo "Committing and tagging release..."
git add package.json
if [[ -f package-lock.json ]]; then
  git add package-lock.json
fi
git commit -m "chore: publish $PACKAGE_NAME@$NEW_VERSION"
git tag "v$NEW_VERSION"

echo ""
echo "Pushing $BRANCH and tags..."
git push origin "$BRANCH" --tags

echo ""
echo "Done: $PACKAGE_NAME@$NEW_VERSION"
echo "https://www.npmjs.com/package/$PACKAGE_NAME"
