"""
This module takes care of handling API endpoints, including authentication and private routes.
"""
import os
from flask import request, jsonify, Blueprint
from api.models import db, User
from api.utils import APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

serializer = URLSafeTimedSerializer(os.getenv("FLASK_APP_KEY", "secret-key"))
TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24


def generate_token(user):
    return serializer.dumps({
        "id": user.id,
        "email": user.email
    })


def verify_token(token):
    try:
        payload = serializer.loads(token, max_age=TOKEN_EXPIRATION_SECONDS)
        return payload
    except SignatureExpired:
        raise APIException("El token ha expirado", status_code=401)
    except BadSignature:
        raise APIException("Token inválido", status_code=401)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json() or {}
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')

    if not email or not password:
        raise APIException(
            "Debe enviar correo electrónico y contraseña", status_code=400)

    if User.query.filter_by(email=email).first():
        raise APIException("El usuario ya existe", status_code=400)

    hashed_password = generate_password_hash(password)
    user = User(email=email, password=hashed_password, is_active=True)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Usuario creado correctamente",
        "user": user.serialize()
    }), 201


@api.route('/login', methods=['POST'])
@api.route('/token', methods=['POST'])
def login():
    body = request.get_json() or {}
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')

    if not email or not password:
        raise APIException(
            "Correo electrónico y contraseña son requeridos", status_code=400)

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        raise APIException("Correo o contraseña incorrectos", status_code=401)

    return jsonify({
        "token": generate_token(user),
        "user": user.serialize()
    }), 200


@api.route('/profile', methods=['GET'])
def profile():
    authorization = request.headers.get('Authorization', '')
    if not authorization.startswith('Bearer '):
        raise APIException("Falta el token de autorización", status_code=401)

    token = authorization.replace('Bearer ', '')
    payload = verify_token(token)
    user = User.query.filter_by(id=payload.get('id')).first()
    if not user:
        raise APIException("Usuario no encontrado", status_code=404)

    return jsonify({
        "user": user.serialize(),
        "message": "Usuario autenticado"
    }), 200
