from flask_sqlalchemy import SQLAlchemy

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey

db = SQLAlchemy()


class User(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False)
    balance = Column(Float, default=100)


class ChatRoom(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    direct_chat = Column(Boolean, nullable=False)
    create_time = Column(DateTime, default=datetime.now())


class Message(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    message = Column(String, nullable=False)
    room = Column("room", ForeignKey(ChatRoom.id), nullable=False)
    user = Column("user", ForeignKey(User.id), nullable=False)
    create_time = Column(DateTime, default=datetime.now())


class Participant(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    room = Column("room", ForeignKey(ChatRoom.id), nullable=False)
    user = Column("user", ForeignKey(User.id), nullable=False)


class Image(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    path = Column(String(255), nullable=False)


class Item(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    owner = Column("owner", ForeignKey(User.id), nullable=False)
    image = Column("image", ForeignKey(Image.id), nullable=False)


class TransactionRequest(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    item = Column("item", ForeignKey(Item.id), nullable=False)
    sender = Column("sender", ForeignKey(User.id), nullable=False)
    receiver = Column("receiver", ForeignKey(User.id), nullable=False)
    price = Column(Float, nullable=False)
    accepted = Column(Boolean, default=False)
    rejected = Column(Boolean, default=False)
