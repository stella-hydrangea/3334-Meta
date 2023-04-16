from flask import make_response, redirect, request
from flask_login import current_user

from auth import get_user
from db import db, ChatRoom, Message, Participant


def get_chat_rooms(user_id):
    return db.session.execute(db.select(Participant).join(ChatRoom, ChatRoom.id == Participant.room).filter_by(user=user_id)).scalar()


def get_messages(chatroom_id):
    return db.session.execute(db.select(Message).filter_by(room=chatroom_id)).scalar()


def check_participant_in_room(user_id, room_id):
    if db.session.execute(db.select(Participant).join(ChatRoom, ChatRoom.id == Participant.room).filter_by(user=user_id, room=room_id, direct_chat=False)).scalar_one_or_none() is None:
        return False
    return True


def send_message(chatroom_id, message):
    user = current_user
    if not check_participant_in_room(user.id, chatroom_id):
        return False
    msg = Message(message=message, room=chatroom_id, user=user.id)
    db.session.add(msg)
    db.session.commit()
    return True


def new_chat(name, direct=False):
    user = current_user
    room = ChatRoom(name=name, direct_chat=direct)
    db.session.add(room)
    db.session.commit()
    participant = Participant(room=room.id, user=user.id)
    db.session.add(participant)
    db.session.commit()
    return room


def add_chat_user(room_id, user_id):
    participant = Participant(room=room_id, user=user_id)
    db.session.add(participant)
    db.session.commit()


def new_direct_message(target_user_id):
    target = get_user(target_user_id, True)
    room = new_chat(target.username, True)
    add_chat_user(room.id, target.id)
