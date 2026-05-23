#!/bin/bash

function cleanup() {
    echo "Cleaning up..."
    pkill -f "python3 -m http.server 8080" || true
}

trap cleanup EXIT

(cd dist/; python3 -m http.server 8080)

