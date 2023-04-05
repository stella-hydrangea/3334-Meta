from flask import render_template, redirect, request
from flask_login import LoginManager, login_user, UserMixin
from flask_sqlalchemy import SQLAlchemy

from db import User, db
from password import password_to_hash, verify_password_hash

login_manager = LoginManager()
login_manager.session_protection = "strong"
login_manager.login_view = '/login'


def get_user(username, id=False):
    if id:
        return db.session.execute(db.select(User).filter_by(id=username)).scalar_one_or_none()
    return db.session.execute(db.select(User).filter_by(username=username)).scalar_one_or_none()


class LoginUser(UserMixin):
    def __init__(self, username: str, user: User = None):
        if user is not None:
            self.user = user
        else:
            self.user = get_user(username)
        self.id = self.user.id
        self.username = self.user.username
        self.email = self.user.email
        self.password = self.user.password


@login_manager.user_loader
def user_loader(user_id):
    user = get_user(user_id, True)
    if user is None:
        return
    user = LoginUser(user_id, user)
    return user


def login():
    username = request.form["username"]
    password = request.form["password"]
    user = LoginUser(username)
    if verify_password_hash(password, user.password):
        login_user(user)
        return True
    return False


def register(data, db: SQLAlchemy):
    errors = []
    if data["password"] != data["password2"]:
        errors.append("Password not same")
    if len(data["username"]) < 3:
        errors.append("User name too short")
    if get_user(data["username"]) is not None:
        errors.append("User name existed")
    if len(errors) > 0:
        return render_template("register.html", errors=errors)
    hashed = password_to_hash(data["password"])
    new_user = User(password=hashed, username=data["username"], email=data["email"])
    db.session.add(new_user)
    db.session.commit()
    login_user(LoginUser(data["username"]))
    resp = redirect("/")
    return resp
