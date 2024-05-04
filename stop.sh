#!/bin/bash
set -eo pipefail

pid=`cat pid.txt`
echo "Running stop $pid"
kill -SIGTERM "$pid" || echo "Failed to terminate Firebase process"
wait "$pid" 2>/dev/null