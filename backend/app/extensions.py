from flask_socketio import SocketIO
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

socketio = SocketIO(cors_allowed_origins="*")
bcrypt = Bcrypt()
db = SQLAlchemy()
migrate = Migrate()
