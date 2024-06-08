#!/bin/bash

bun install
bun run build

git checkout -b renderSource

# All files except /dist/
archivos_a_borrar=$(find . -type f ! -path "./dist/*")

git rm  $archivos_a_borrar
