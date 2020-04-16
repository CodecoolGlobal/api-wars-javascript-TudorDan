from functools import wraps
from flask import Flask, render_template, redirect, url_for, request, session

import data_manger

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
    user_ok = True
    if request.method == 'POST':
        username = request.form['form-username']
        password = request.form['form-password']

        user_ok = data_manger.check_user(username)

        if user_ok:
            hashed_password = data_manger.hash_password(password)
            data_manger.add_new_user(username, hashed_password)
            return redirect(url_for('index'))
    return render_template('add_new_user.html', user_ok=user_ok)




if __name__ == '__main__':
    app.run(debug=True)
