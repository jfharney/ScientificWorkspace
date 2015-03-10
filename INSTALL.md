# INSTALL INSTRUCTIONS

Using [homebrew](#homebrew), [virtualenv](#virtualenv), and [pip](#pip)

 - Create a virtual environment to work in and activate it

     $ virtualenv $HOME/venv/constellation
     $ . $HOME/venv/constellation/bin/activate
 
 - Install Google Protobuf and the python binding

     $ brew install protobuf
     $ pip install protobuf

 - Install zeroMQ and the python binding

     $ brew install zeromq
     $ pip install pyzmq

 - Install django and the pieces it uses

     $ pip install django
     $ pip install celery
     $ pip install pyjade

 - Fetch the ScientifcWorkspace software

     $ git clone git@github.com:jfharney/ScientificWorkspace.git
     $ export SW=./ScientificWorkspace

 - Edit $SW/django-fe/constellation/constellation/settings.py and add the line

     TEST_RUNNER = 'django.test.runner.DiscoverRunner'

   This suppresses a warning about some project unittests not executing as
   expected after upgrades beyond Django 1.5.

 - In $SW/django-fe/constellation/constellation/settings.py, make sure your
   database name is correct in the DATABASES dictionary

        'NAME': '/Users/8xo/sciworkspace/2-26/ScientificWorkspace/django-fe/constellation.db',

 - You may get a message like

       You have unapplied migrations; your app may not work properly until
       they are applied.
       Run 'python manage.py migrate' to apply them.

   If so, in $SW/django-fe/constellation run the command

       $ python manage.py migrate

 - If you get tracebacks about not being able to import from msgschema,
   add $SW/django-fe/constellation/constellationfe to PYTHONPATH.

       $ PYTHONPATH=${PYTHONPATH}:$SW/django-fe/constellation/constellationfe

 - Run the django server with the command

       $ python manage.py runserver

 - In your browser, visit URL

       http://localhost:8080/constellation/workspace/USERNAME

<a name="homebrew">
### homebrew

Visit (http://brew.sh) and follow the instructions.

<a name="virtualenv">
### virtualenv

Follow the instructions at (https://virtualenv.pypa.io/en/latest/installation.html).

<a name="pip">
### pip

Platform- and situation-specific Instructions for installing pip are
available at (https://pip.pypa.io/en/latest/installing.html).
