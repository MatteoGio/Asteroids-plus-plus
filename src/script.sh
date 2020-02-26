#!/usr/bin/env bash

# Script Bash usefull to avoid security problems in the firfox
# You can run this script directly from the shell
python -m SimpleHTTPServer 8000 &
firefox localhost:8000
