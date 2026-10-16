#!/bin/sh
# Rebuild every Vio pose PNG from the raw art (run from the repo root).
set -e
python3 tools-py/vio_key.py assets/vio/raw studio/public/vio
T=$(mktemp -d); cp assets/vio/raw-wide-*.webp "$T"/; python3 tools-py/vio_key.py "$T" "$T/k"
python3 tools-py/vio_fit.py "$T/k/raw-wide-present.png" studio/public/vio/present.png 1.294 -236 56 1600
python3 tools-py/vio_fit.py "$T/k/raw-wide-pointright.png" studio/public/vio/pointright.png 1.3 -290 96 1840
python3 tools-py/vio_fit.py studio/public/vio/lookright.png studio/public/vio/lookright.png 1.07 46 21 1024
