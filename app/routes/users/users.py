# -*- coding: utf-8 -*-

import bcrypt
from flask import Blueprint
from flask import redirect
from flask import render_template
from flask import request
from flask import url_for
from flask import flash
from flask_login import login_user
from flask_login import logout_user
from app.models.blog_models import User


users_blueprint = Blueprint('users', __name__,
                            static_folder='static',
                            template_folder='templates',
                            static_url_path='/app/routes/users/static')


@users_blueprint.route('/users')
def users():
    """
    用户页面
    :return:
    """
    return render_template('sign_in.html')


@users_blueprint.route('/users/sign_in')
def sign_in():
    """
    登录页面
    :return:
    """
    return render_template('sign_in.html')


@users_blueprint.route('/users/sign_up')
def sign_up():
    """
    注册页面
    :return:
    """
    return render_template('sign_up.html')


@users_blueprint.route('/users/register', methods=['GET', 'POST'])
def user_register():
    """
    注册用户
    :return:
    """
    print(request.method)
    if request.method == 'POST':
        password = request.form.get('password')
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = User()
        user.username = request.form.get('username')
        user.email = request.form.get('mail')
        user.password = hashed_password
        user.save()
        return redirect(url_for('users.sign_in'))
    else:
        return redirect(url_for('index'))


@users_blueprint.route('/users/login', methods=['GET', 'POST'])
def user_login():
    """
    登录用户
    :return:
    """
    if request.method == 'POST':
        user = User.query.filter_by(email=request.form.get('email')).first()
        if user and bcrypt.checkpw(request.form.get('password').encode('utf-8'), user.password.encode('utf-8')):
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('用户名或密码错误')
            return redirect(url_for('users.sign_in'))
    else:
        return redirect(url_for('index'))


@users_blueprint.route('/users/logout')
def user_logout():
    """
    登出用户
    :return:
    """
    logout_user()
    return redirect(url_for('index'))