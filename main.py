#!/usr/bin/env python
"""
iSchool Initiative Live Map
Schedule a DLR Tour stop.
Copyright 2013 Brandon Thomas <bt@brand.io>
"""

import os
import sys
import getpass
from flask import Flask, render_template, url_for, request
from flask import send_from_directory, send_file, redirect
from flask import json, jsonify

import database
from model import *

# -------------
# CONFIGURATION
# -------------

app = Flask(__name__)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1
app.config['ENVIRONMENT_DEV'] = False
app.config['ENVIRONMENT_PRODUCTION'] = False

FLASK_PATH = os.path.dirname(os.path.abspath(__file__))

uname = getpass.getuser()

if uname in ['brandon']:
	app.config['ENVIRONMENT_DEV'] = True
elif uname in ['isimobile', 'root']:
	app.config['ENVIRONMENT_PRODUCTION'] = True

def requested(name, default=''):
	if name in request.form:
		return name
	else:
		return default

# -------------
# WEBSITE PAGES
# -------------

@app.route('/')
def page_index():
	return render_template('map.html')

@app.route('/locations', methods=['GET', 'POST'])
def page_location_add():
	location = None
	if request.form and len(request.form):

		location = Location(
			position_x = request.form['position_x'],
			position_y = request.form['position_y'],
			name = request.form['name'],
			email = request.form['email'],
			phone = request.form['phone'],
			school = request.form['school'],
		)

		database.session.add(location)
		database.session.commit()

		return redirect('/locations')

	locations = database.session.query(Location).all()
	return render_template('location_overview.html',
			locations=locations)

# ----------------
# AJAX API GATEWAY
# ----------------

@app.route('/api/locations', methods=['GET', 'POST'])
def page_location_list():
	if request.method == 'POST':
		location = Location(
			position_x = request.json['position_x'],
			position_y = request.json['position_y'],
			name = request.json['name'],
			email = request.json['email'],
			phone = request.json['phone'],
			school = request.json['school'],
		)

		database.session.add(location)
		database.session.commit()

		return 'OK' # TODO: status msg.

	else:
		locations = None
		try:
			locations = database.session.query(Location).all()
		except:
			pass

		return json.dumps([x.serialize() for x in locations])

# -------------
# MISSING FILES
# -------------

@app.errorhandler(404)
@app.route('/404')
def page_404(e=None):
	if e:
		return render_template('404.html'), 404
	return render_template('404.html')

# -----------------
# DEVELOPMENT TOOLS
# -----------------

def cache_buster():
	import random
	if not app.config['ENVIRONMENT_DEV']:
		return ''
	return '?%s' % str(random.randint(500, 9000000))

app.jinja_env.globals.update(cache_buster=cache_buster)

def main(port=5000):
	app.run(
		port = port,
		host = '0.0.0.0',
		use_reloader = True,
		debug = app.config['ENVIRONMENT_DEV'],
	)

if __name__ == '__main__':
	port = 5000 if len(sys.argv) < 2 else int(sys.argv[1])
	main(port=port)

