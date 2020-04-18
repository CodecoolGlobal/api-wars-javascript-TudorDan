from functools import wraps
from flask import Flask, render_template, redirect, url_for, request, session, jsonify

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


@app.route('/user-login', methods=['GET', 'POST'])
def login():
    user_ok = True
    if request.method == 'POST':
        username = request.form['form-username']
        password = request.form['form-password']

        user_dict = data_manger.get_all_user_data_by_username(username)
        if user_dict is None or data_manger.verify_password(password, user_dict['password']) is False:
            user_ok = False
        else:
            session['logged_in'] = True
            session['username'] = username
            session['user_id'] = user_dict['id']
            return redirect(url_for('index'))
    return render_template('login.html', user_ok=user_ok)


@app.route('/user-logout')
def logout():
    session.clear()
    session['logged_in'] = False
    return redirect(url_for('index'))


@app.route('/vote/<planet_name>/<planet_id>')
def vote_planet(planet_name, planet_id):
    user_id = data_manger.get_user_id_by_username(session['username'])
    data_manger.add_planet_vote(int(planet_id), planet_name, user_id)
    return render_template('index.html')


@app.route('/api/insert-vote', methods=["POST"])
@is_logged_in
def insert_vote():
    request_content = request.json
    user_id = data_manger.get_user_id_by_username(session['username'])
    data_manger.add_planet_vote(int(request_content['planet_id']), request_content['planet_name'], user_id)
    return jsonify({'success': True})


@app.route('/api/get-votes')
def get_votes():
    votes_list = data_manger.get_votes()
    return jsonify(votes_list)


if __name__ == '__main__':
    app.run(debug=True)
