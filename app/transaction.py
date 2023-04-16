from flask import make_response, redirect, request
from flask_login import current_user

from auth import get_user
from db import db, User, Item, TransactionRequest


def get_transaction(sender_id, receiver_id, accepted=True, rejected=False):
    return db.session.execute(db.select(TransactionRequest).filter_by(sender=sender_id, receiver=receiver_id, accepted=accepted, rejected=rejected)).scalar_one_or_none()


def check_transaction(item_id, sender_id, receiver_id):
    if db.session.execute(db.select(TransactionRequest).filter_by(item=item_id, sender=sender_id, receiver=receiver_id, accepted=False, rejected=False)).scalar_one_or_none() is None:
        return True
    return False


def check_money_confirm(sender_id, price):
    sender = db.session.execute(db.select(User).filter_by(
        id=sender_id)).scalar_one_or_none()
    if sender is None or price > sender.balance:
        return False
    sender.balance -= price
    db.session.commit()
    return True


def get_transactions(item_id, all=False, accepted=False, rejected=False):
    if all:
        return db.session.execute(db.select(TransactionRequest).filter_by(item=item_id)).scalar_one_or_none()
    return db.session.execute(db.select(TransactionRequest).filter_by(item=item_id, accepted=accepted, rejected=rejected)).scalar()


def send_transaction(item_id, receiver_id, price):
    user = current_user
    if not check_transaction(item_id, user.id, receiver_id, price):
        return False
    request = TransactionRequest(
        item=item_id, sender=user.id, receiver=receiver_id, price=price)
    db.session.add(request)
    db.session.commit()
    return True


def accept_transaction(transaction_id):
    transaction = db.session.execute(db.select(TransactionRequest).filter_by(
        id=transaction_id)).scalar_one_or_none()
    check_money_confirm(transaction.sender, transaction.price)
    transaction.accept = True
    db.session.commit()
    transactions = get_transactions(item_id=transaction.item)
    for transaction in transactions:
        transaction.reject = True
    db.session.commit()


def reject_transaction(transaction_id):
    transaction = db.session.execute(db.select(TransactionRequest).filter_by(
        id=transaction_id)).scalar_one_or_none()
    transaction.reject = True
    db.session.commit()
