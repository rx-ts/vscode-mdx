#!/bin/sh

set -e

PKG_VERSION=$(jq -r '.version' package.json)

git fetch origin v"$PKG_VERSION" || {
  yarn standard-version -a --release-as "$PKG_VERSION"
  git push --follow-tags origin master
  vsce publish
}
