from flask import Blueprint, render_template

about_me_blueprint = Blueprint('about-me', __name__)


@about_me_blueprint.route('/about_me')
def about_me():
    return render_template('about.html')
