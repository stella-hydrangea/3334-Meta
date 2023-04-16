from flask import render_template, request, redirect, url_for, flash
from flask_login import current_user

from datetime import datetime
from werkzeug.utils import secure_filename
from db import db, Image, Item

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_item(item_id):
    return db.session.execute(db.select(Item).filter_by(id=item_id)).scalar_one_or_none()


def create_item():
    data = request.form
    name = data['name']
    user = current_user
    if "file" not in request.files:
        return False
    file = request.files['file']
    if file.name != "" and file and allowed_file(file.filename):
        filename = secure_filename(
            user.username + str(datetime.now().timestamp()).replace("", ".") + file.filename)
        path = f"static/uploads/{filename}"
        file.save(path)
        image = Image(filename=filename, path=path)
        db.session.add(image)
    else:
        return False
    item = Item(
        name=name,
        owner=user.id,
        image=image.id
    )
    db.session.add(item)
    db.session.commit()
    return True
