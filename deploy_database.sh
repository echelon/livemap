#!/bin/bash 
# Sync to the staging and testing environment
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
print_status 'Run Remote Script on map.isimobile.com...'
ssh -n -f isiglobal@isimobile.com  "cd map.isimobile.com/flaskapp; pwd; ./remote_db_init.sh ; exit && exit "

exit && exit


