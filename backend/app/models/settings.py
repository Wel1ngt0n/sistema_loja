from app.extensions import db
from datetime import datetime

class SystemSetting(db.Model):
    __tablename__ = 'system_settings'

    key = db.Column(db.String(50), primary_key=True)
    value = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(200), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @staticmethod
    def get_value(key, default=None):
        setting = SystemSetting.query.get(key)
        return setting.value if setting else default

    @staticmethod
    def set_value(key, value, description=None):
        setting = SystemSetting.query.get(key)
        if not setting:
            setting = SystemSetting(key=key)
            db.session.add(setting)
        
        setting.value = str(value)
        if description:
            setting.description = description
        db.session.commit()
