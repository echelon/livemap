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
from flask import send_from_directory, send_file

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

"""
# XXX: Not working --
with app.test_request_context():
	app.add_url_rule('/favicon.ico',
        redirect_to=url_for('static', filename='img/favicon.ico'))
"""

# -------------
# WEBSITE PAGES
# -------------

@app.route('/')
def page_index():
	return render_template('map.html')

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
	)

if __name__ == '__main__':
	port = 5000 if len(sys.argv) < 2 else int(sys.argv[1])
	main(port=port)

