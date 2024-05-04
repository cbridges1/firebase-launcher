#!/bin/bash
set -eo pipefail

# Function to print error messages and exit
error_exit() {
    echo "$1" 1>&2
    exit 1
}

echo "Starting services..."
# Start Firebase emulators
emulator_cmd="firebase emulators:start --import ./data --export-on-exit ./data"
$emulator_cmd &
firebase_pid=$!

echo "$firebase_pid" > pid.txt

cleanup() {
    echo "Stopping services..."
    # Gracefully stop background processes
    echo "Terminating background services..."
    if [[ -n "$firebase_pid" ]]; then
        kill -SIGTERM "$firebase_pid" || echo "Failed to terminate Firebase process"
        wait "$firebase_pid" 2>/dev/null
    fi
}

trap cleanup INT TERM SIGTERM SIGINT

wait