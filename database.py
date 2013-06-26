import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQLITE_DB_FILE = '_database.sqlite'

Base = declarative_base()
database = None
session = None

class Database(object):
	def __init__(self, dbStr, autoconnect=True):
		self.dbStr = dbStr
		self.engine = None
		self.session = None
		self.needsConnect = True
		if autoconnect:
			self.needsConnect = False
			self.connect()

	def connect(self):
		# TODO: Disconnect if connected!
		self.engine = create_engine(self.dbStr, convert_unicode=True)
		self.session = scoped_session(
				sessionmaker(
					autocommit=False,
					autoflush=False,
					bind=self.engine
				)
			)
		return self

	def install(self):
		if self.needsConnect or not self.engine or not self.session:
			self.connect()
		t = [str(t) for t in Base.metadata.sorted_tables]
		print 'Creating %d tables: %s' % (len(t), str(t))
		Base.metadata.create_all(bind=self.engine)
		return self

	def drop(self):
		if self.needsConnect or not self.engine or not self.session:
			self.connect()
		Base.metadata.drop_all(bind=self.engine)
		self.needsConnect = True
		return self

	def reinstall(self):
		self.drop()
		self.install()

class Postgres(Database):
	def __init__(self, autoconnect=True):
		#dbStr = app.config['SQLALCHEMY_DATABASE_URI']
		dbStr = 'TODO'
		super(Postgres, self).__init__(dbStr, autoconnect)

class Sqlite(Database):

	class DbFile(object):
		def __init__(self, fname):
			self.fname = fname

		def create(self):
			if not self.fname:
				return
			print 'creating file %s' % self.fname
			if not os.path.exists(self.fname):
				with file(self.fname, 'a'):
					os.utime(self.fname, None)

		def exists(self):
			if not self.fname:
				return False
			return os.path.exists(self.fname)

		def delete(self):
			if not self.fname:
				return
			print 'removing file %s' % self.fname
			os.remove(self.fname) # XXX: Careful!

	def __init__(self, fname, autoconnect=True):
		self.dbfile = self.DbFile(fname)
		if not self.dbfile.exists():
			self.dbfile.create()
		dbStr = 'sqlite:///%s' % fname
		super(Sqlite, self).__init__(dbStr, autoconnect)

	def connect(self):
		if not self.dbfile.exists():
			self.dbfile.create()
		return super(Sqlite, self).connect()

	def install(self):
		if not self.dbfile.exists():
			self.dbfile.create()
		return super(Sqlite, self).install()

	def drop(self):
		ret = super(Sqlite, self).drop()
		self.dbfile.delete()
		return ret


# TODO: Creation factory instead of if/else ?  Maybe? But why?
database = Sqlite(SQLITE_DB_FILE)
Base.query = database.session.query_property()
session = database.session

