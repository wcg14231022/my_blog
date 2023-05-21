import bcrypt
from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

db = SQLAlchemy()
login_manager = LoginManager()

# 定义Blog表
class Blog(db.Model):
    __tablename__ = 'blogs'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    title = db.Column(String(100), nullable=False)
    content = db.Column(String(1000), nullable=False)
    user_id = db.Column(Integer, ForeignKey('users.id'))

    user = db.relationship("User", back_populates="blogs")  # 一个用户对应多个博客

    def save(self):
        db.session.add(self)
        db.session.commit()


# 定义User表
class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    username = db.Column(String(100), nullable=False)
    email = db.Column(String(100), nullable=False, unique=True)
    password = db.Column(String(100), nullable=False)
    avatar = db.Column(db.LargeBinary)  # 添加头像列

    blogs = db.relationship("Blog", back_populates="user")

    def save(self):
        db.session.add(self)
        db.session.commit()

    def get_id(self):
        return self.id

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def __repr__(self):
        return '<User %r>' % self.username

    @staticmethod
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))