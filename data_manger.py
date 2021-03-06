import database_common
import bcrypt
import datetime


def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


@database_common.connection_handler
def check_user(cursor, username):
    cursor.execute("""
                    SELECT username FROM users
                    WHERE username = %(username)s;
                    """,
                   {'username': username})
    user_dict = cursor.fetchone()
    if user_dict is None:
        return True
    return False


@database_common.connection_handler
def add_new_user(cursor, username, hashed_password):
    cursor.execute("""
                    INSERT INTO users(username, password)
                    VALUES (%(username)s, %(hashed_password)s);
                    """,
                   {'username': username,
                    'hashed_password': hashed_password})


@database_common.connection_handler
def get_all_user_data_by_username(cursor, username):
    cursor.execute("""
                        SELECT * FROM users
                        WHERE username = %(username)s;
                        """,
                   {'username': username})
    user_dict = cursor.fetchone()
    return user_dict


@database_common.connection_handler
def add_planet_vote(cursor, planet_id, planet_name, user_id):
    submission_time = datetime.datetime.now().strftime('%Y-%b-%d %H:%M:%S')
    cursor.execute("""
                    INSERT INTO "planet-votes" (planet_id, planet_name, user_id, submission_time)
                    VALUES (%(planet_id)s, %(planet_name)s, %(user_id)s, %(submission_time)s);
                    """,
                   {'planet_id': planet_id,
                    'planet_name': planet_name,
                    'user_id': user_id,
                    'submission_time': submission_time})


@database_common.connection_handler
def get_votes(cursor):
    cursor.execute("""
                    SELECT planet_id, user_id FROM "planet-votes";
                    """)
    list_of_dict = cursor.fetchall()
    return list_of_dict


@database_common.connection_handler
def obtain_statistics(cursor):
    cursor.execute("""
                    SELECT * FROM "planet-votes";
                    """)
    list_of_dict = cursor.fetchall()
    return list_of_dict
