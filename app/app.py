import os.path
from flask import Flask
from flask import render_template
from flask import session
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from app.models.blog_models import db
from app.models.blog_models import login_manager
from config import config
from .routes.about_me import about_me_blueprint
from .routes.users.users import users_blueprint


app = Flask(__name__, root_path=os.path.abspath(os.path.dirname(__file__)))
app.config.from_object(config)
app.secret_key = 'my_secret_key'
app.template_folder = os.path.join(os.path.dirname(__file__), 'templates')
app.static_folder = os.path.join(os.path.dirname(__file__), 'static')


# 注册蓝图

app.register_blueprint(about_me_blueprint)
app.register_blueprint(users_blueprint)
db.init_app(app)
login_manager.init_app(app)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    db.create_all()
    app.run()
