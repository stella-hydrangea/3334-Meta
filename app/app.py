from flask import Flask, render_template, make_response, request, redirect
from flask_login import current_user, login_required, logout_user

from auth import register, login_manager, login, get_user
from db import db


app = Flask(__name__)
app.secret_key = "4634f47e69b2316d41d97323f08233bc0f5cf6a4702434bea64ba19b65b72d0ca1118a48207d04d2d6e2535a7d3145bd462e0ab7d883d17e60cb0571333aa8fc"
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db" #Now for test only

db.init_app(app)
login_manager.init_app(app)


with app.app_context():
    db.create_all()


@app.route("/")
@login_required
def index():
    return make_response(redirect("/index"))


@app.route("/index")
@login_required
def index_page():
    return make_response(render_template("index.html"))


@app.route("/register", methods=["GET", "POST"])
def request_register():
    if current_user.is_authenticated:
        return make_response(redirect("/"))
    if request.method == "POST":
        resp = register(request.form, db)
    else:
        resp = render_template("register.html")
    return make_response(resp)


@app.route("/login", methods=["GET", "POST"])
def request_login():
    if request.method == "GET":
        return make_response(render_template("login.html"))
    if login():
        resp = redirect("/")
    else:
        resp = render_template('login.html', errors=[
                               "Wrong password or Login Id not exists"])
    return make_response(resp)


@app.route("/logout")
@login_required
def request_logout():
    logout_user()
    return make_response(redirect("/login"))


if __name__ == "__main__":
    app.run(debug=True, port=5555)
