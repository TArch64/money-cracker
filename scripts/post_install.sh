#!/usr/bin/env bash

git config --local core.hooksPath .git-hooks
bun expo install --fix
