#!/bin/bash 
# Sync to the staging and testing environment
shopt -s expand_aliases
alias rsync="rsync -zrpvu -e ssh --exclude-from=exclude.txt --progress"

function print_status() {
	status=$1
	length=${#1}
	echo ''
	echo $status
	for i in $(seq $length); do echo -n '-'; done
	echo ''
}

#print_status 'Running build script'
#python build.py

print_status 'Compiling LESS'
lessc --yui-compress static/less/main.less > output/design.out.css

#
# DREAMHOST DYNAMIC/PASSENGER
#

print_status 'Flask Code: Running rsync to map.isimobile.com'
rsync . isiglobal@isimobile.com:/home/isiglobal/map.isimobile.com/flaskapp

print_status 'Static Assets: Running rsync to map.isimobile.com'
rsync ./static/ isiglobal@isimobile.com:/home/isiglobal/map.isimobile.com/public/static

print_status 'LessCSS: Running rsync to map.isimobile.com'
rsync ./output/ isiglobal@isimobile.com:/home/isiglobal/map.isimobile.com/public/static

print_status 'Restarting Python on map.isimobile.com'
ssh -n -f isiglobal@isimobile.com "sh -c 'touch map.isimobile.com/tmp/restart.txt'"


