import os.path
from flask import Flask, render_template
from jinja2 import *
from .routes.about_me import about_me_blueprint
from .routes.users.users import users_blueprint

app = Flask(__name__, root_path=os.path.abspath(os.path.dirname(__file__)))
app.template_folder = os.path.join(os.path.dirname(__file__), 'templates')
app.static_folder = os.path.join(os.path.dirname(__file__), 'static')
app.register_blueprint(about_me_blueprint)
app.register_blueprint(users_blueprint)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
