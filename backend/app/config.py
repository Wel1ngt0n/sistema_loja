import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev_secret_key_change_me'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://user:password@localhost:5432/loja_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configurações de Impressora
    PRINTER_IP = os.environ.get('PRINTER_IP') or '192.168.1.200'

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
