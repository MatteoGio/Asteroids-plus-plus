#!/usr/bin/env bash

# Script Bash usefull to avoid security problems in the firfox
# You can run this script directly from the shell
python3 -m http.server 8000 &
#python3 -m SimpleHTTPServer 8000 &
firefox localhost:8000
