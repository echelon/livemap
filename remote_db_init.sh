#!/bin/bash 
# Initialize the database on dreamhost
# This script is run **on** the remote server, not locally

shopt -s expand_aliases
alias rsync="rsync -zrpvu -e ssh --progress"

function print_status() {
	status=$1
	length=${#1}
	echo ''
	echo $status
	for i in $(seq $length); do echo -n '-'; done
	echo ''
}

#
# DREAMHOST DYNAMIC/PASSENGER
#


print_status 'Setup Python Environment'
killall python
virtualenv --no-site-packages --distribute ..
source ../bin/activate


print_status 'Generate SQLite File'
python ./installdb.py

print_status 'Move SQLite file below /flaskapp'
mv _database.sqlite ..

print_status 'Restarting Python and exiting'
touch ../tmp/restart.txt && exit && exit

exit

