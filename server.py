from functools import wraps
from flask import Flask, render_template, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'Dromihete'


# check if user is logged in
def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if session['logged_in']:
            return f(*args, **kwargs)
        else:
            return redirect(url_for('route_login'))

    return wrap


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/registration', methods=['GET', 'POST'])
def add_new_user():
    return render_template('add_new_user.html')


if __name__ == '__main__':
    app.run(debug=True)
