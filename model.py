import datetime
import hashlib
import random
import string
import json

from sqlalchemy import Column, Integer, String, DateTime,\
						Boolean, Table, Text, ForeignKey

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

#from flask.ext.wtf import Form, BooleanField, TextField, \
#		PasswordField, validators

from database import Base

class Location(Base):
	__tablename__ = 'locations'
	id = Column(Integer, primary_key=True)

	"""
	datetime_added = Column(DateTime, nullable=True,
					default=datetime.datetime.now)
	"""

	position_x = Column(Integer(255))
	position_y = Column(Integer(255))

	name = Column(String(512))
	email = Column(String(512))
	phone = Column(String(512))
	school = Column(String(512)) # school/district

	def get_name(self):
		#title = 'Untitled' if not self.title else self.title
		#return 'Chat %d: %s' % (self.id, title)
		pass

	def get_url(self):
		#return '/chat/view/%d' % self.id
		pass

	def to_json(self):
		"""return json.dumps({
			'title': self.title,
			'issue': self.issue,
			'users': None
		})
		"""
		pass

	def serialize(self, users=True):
		if not users:
			return {
				'id': self.id,
				'title': self.title,
				'issue': self.issue,
			}

		users = []
		for p in self.participants:
			users.append({
				'id': p.user.id,
				'username': p.user.username,
			})

		return {
			'id': self.id,
			'title': self.title,
			'issue': self.issue,
			'users': users
		}

"""
class LocationForm(Form):
    position_x = TextField('x',
			[validators.Length(min=0, max=7)])

    position_y = TextField('y',
			[validators.Length(min=0, max=7)])

    name = TextField('Name',
			[validators.Length(min=2, max=255)])

    email = TextField('Email Address',
			[validators.Length(min=4, max=95)])

    phone = TextField('Phone',
			[validators.Length(min=4, max=20)])

    school = TextField('School/Institution',
			[validators.Length(min=4, max=255)])

"""
