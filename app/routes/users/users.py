from flask import Blueprint, render_template

users_blueprint = Blueprint('users', __name__,
                            static_folder='static',
                            template_folder='templates',
                            static_url_path='/app/routes/users/static')


@users_blueprint.route('/users')
def users():
    return render_template('sign_in.html')


@users_blueprint.route('/users/sign_in')
def sign_in():
    return render_template('sign_in.html')


@users_blueprint.route('/users/sign_up')
def sign_up():
    return render_template('sign_up.html')