# Sticky_Note_app_docker
# setup
you will need to provide your own mongo.txt with your own mongodb connection string.
# What to change:
you will need to change a few values to variables in app.py.
on line 11: db = client['ENTER_YOUR_DATABASE_NAME']
on line 12: collection = db['ENTER_YOUR_COLLECTION_NAME']
other than that, no code modification *should* be needed. :)

# How to run, how to stop:
to start app, in the terminal type: docker compose up --build
to stop app, in the terminal type: docker compose down

# if there are errors:
You may need to install python 3.11.7 on your computer, and the docker desktop application if not already installed.

python3 link for install: https://www.python.org/downloads/windows/
Docker for desktop link for install: https://www.docker.com/products/docker-desktop/
