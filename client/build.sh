#!/usr/bin/env sh

# If the dist directory does not exist, create it.
if [ ! -d "dist" ]; then
  mkdir dist
else
  # If the dist directory exists, delete all files in it.
  rm -rf dist/*
fi

# Run tsc to compile the TypeScript code.
tsc -b --verbose

# Copy the contents of the public directory to the dist directory.
cp -rT public dist

# Copy the src directory to the dist directory
cp -r src/ dist

# Remove the typescript files from the dist directory (recursively).
find dist -name "*.ts" -type f -delete

# Since typescript doesn't append the .js extension to the imports, we have to do it manually.
# The browser requires the .js extension for all imports.
find dist -name "*.js" -type f -exec sed -i 's/^\(import { .* } from "\)\(.*\)\(";\)$/\1\2.js\3/' {} \;