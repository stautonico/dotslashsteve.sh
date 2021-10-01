import datetime
import os
from pathlib import Path

import sentry_sdk
from dotenv import load_dotenv
from sentry_sdk.integrations.django import DjangoIntegration

# Determine the current environment (PRODUCTION, QA, TESTING, DEVELOPMENT)
SYSTEM_ENV = os.environ.get("SYSTEM_ENV", None)

if not SYSTEM_ENV:
    raise Exception("Missing SYSTEM_ENV variable, unable to continue!")

# We're making this upper here so we don't have to re-write SYSTEM_ENV.upper() 1000 times down below
SYSTEM_ENV = SYSTEM_ENV.upper()

# Make sure that the current environment is valid
if SYSTEM_ENV not in ["PRODUCTION", "QA", "TESTING", "DEVELOPMENT"]:
    raise Exception(f"'{SYSTEM_ENV}' is not a valid system environment!")

# Some global settings required
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Settings unique for development
if SYSTEM_ENV.upper() == "DEVELOPMENT":
    load_dotenv()
    DEBUG = True
    sentry_sdk.init(
        dsn=os.environ["SENTRY_DSN"],
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0,
        send_default_pii=True,
        environment="dev"
    )

    SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
    ALLOWED_HOSTS = ["localhost"]

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        "filters": {
            # Add an unbound RequestFilter.
            'request': {
                '()': 'django_requestlogging.logging_filters.RequestFilter',
            },
        },
        "formatters": {
            'request_format': {
                'format': '%(remote_addr)s %(username)s "%(request_method)s '
                          '%(path_info)s %(server_protocol)s" %(http_user_agent)s '
                          '%(message)s %(asctime)s',
            },
        },
        'handlers': {
            # 'request-file': {
            #     'level': 'INFO',
            #     'class': 'logging.FileHandler',
            #     'filename': os.environ.get("REQUEST_LOG") or "./logs/requests.log",
            #     'filters': ['request'],
            #     'formatter': 'request_format',
            # },
            "debug-file": {
                "level": "DEBUG",
                "class": "logging.FileHandler",
                "filename": os.environ.get("DEBUG_LOG") or "./logs/debug.log",
            },
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
                'filters': ['request'],
                'formatter': 'request_format',
            },
        },
        'loggers': {
            'app-logger': {
                'handlers': ['console'],
                'level': 'CRITICAL',
                'propagate': True,
            },
            'django.request': {
                'handlers': ['console'],
                'propagate': False,
                'level': 'DEBUG',
            },
            "root": {
                "handlers": ["console"],
                "level": "WARNING"
            },
            "debuglog": {
                "handlers": ["debug-file"],
                "level": "DEBUG",
            }
        },
    }

# Settings unique to testing environments (usually github actions)
elif SYSTEM_ENV == "TESTING":
    DEBUG = True
    SECRET_KEY = "TESTING_SECRET_KEY"
    ALLOWED_HOSTS = ["localhost"]

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Settings unique to the production environment
elif SYSTEM_ENV == "QA":
    load_dotenv()
    DEBUG = False
    sentry_sdk.init(
        dsn=os.environ["SENTRY_DSN"],
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0,
        send_default_pii=True,
        environment="QA"
    )

    SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
    ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ") or ["localhost"]

    # TODO: Maybe replace this with mongo
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        "filters": {
            # Add an unbound RequestFilter.
            'request': {
                '()': 'django_requestlogging.logging_filters.RequestFilter',
            },
        },
        "formatters": {
            'request_format': {
                'format': '%(remote_addr)s %(username)s "%(request_method)s '
                          '%(path_info)s %(server_protocol)s" %(http_user_agent)s '
                          '%(message)s %(asctime)s',
            },
        },
        'handlers': {
            'request-file': {
                'level': 'INFO',
                'class': 'logging.FileHandler',
                'filename': os.environ.get("REQUEST_LOG") or "./logs/requests.log",
                'filters': ['request'],
                'formatter': 'request_format',
            },
            "debug-file": {
                "level": "DEBUG",
                "class": "logging.FileHandler",
                "filename": os.environ.get("DEBUG_LOG") or "./logs/debug.log",
            },
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
                'filters': ['request'],
                'formatter': 'request_format',
            },
        },
        'loggers': {
            'django': {
                'handlers': ['request-file'],
                'level': 'INFO',
                'propagate': True,
            },
            'app-logger': {
                'handlers': ['request-file', 'console'],
                'level': 'CRITICAL',
                'propagate': True,
            },
            'django.request': {
                'handlers': ['console', "request-file"],
                'propagate': False,
                'level': 'DEBUG',
            },
            "root": {
                "handlers": ["console"],
                "level": "WARNING"
            },
            "debuglog": {
                "handlers": ["debug-file"],
                "level": "DEBUG",
            }
        },
    }

# Settings unique to the QA environment (similar to production, but slightly more debuggy)
elif SYSTEM_ENV == "PRODUCTION":
    load_dotenv()
    DEBUG = True
    sentry_sdk.init(
        dsn=os.environ["SENTRY_DSN"],
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0,
        send_default_pii=True,
        environment="prod"
    )

    SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
    ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ") or ["localhost"]

    # TODO: Replace this with mongo
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        "filters": {
            # Add an unbound RequestFilter.
            'request': {
                '()': 'django_requestlogging.logging_filters.RequestFilter',
            },
        },
        "formatters": {
            'request_format': {
                'format': '%(remote_addr)s %(username)s "%(request_method)s '
                          '%(path_info)s %(server_protocol)s" %(http_user_agent)s '
                          '%(message)s %(asctime)s',
            },
        },
        'handlers': {
            'request-file': {
                'level': 'INFO',
                'class': 'logging.FileHandler',
                'filename': os.environ.get("REQUEST_LOG") or "./logs/requests.log",
                'filters': ['request'],
                'formatter': 'request_format',
            },
            "debug-file": {
                "level": "DEBUG",
                "class": "logging.FileHandler",
                "filename": os.environ.get("DEBUG_LOG") or "./logs/debug.log",
            },
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
                'filters': ['request'],
                'formatter': 'request_format',
            },
        },
        'loggers': {
            'django': {
                'handlers': ['request-file'],
                'level': 'INFO',
                'propagate': True,
            },
            'app-logger': {
                'handlers': ['request-file', 'console'],
                'level': 'CRITICAL',
                'propagate': True,
            },
            'django.request': {
                'handlers': ['console', "request-file"],
                'propagate': False,
                'level': 'DEBUG',
            },
            "root": {
                "handlers": ["console"],
                "level": "WARNING"
            },
            "debuglog": {
                "handlers": ["debug-file"],
                "level": "DEBUG",
            }
        },
    }

# Global settings (same no matter if we're in DEV or QA OR TESTING or whatever
# Use the custom user model rather than the default one
# AUTH_USER_MODEL = "users.CustomUser"

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Custom apps
    "api",
    # Vendor apps
    "django_requestlogging",
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

MIDDLEWARE_CLASSES = [
    "django_requestlogging.middleware.LogSetupMiddleware"
]

ROOT_URLCONF = 'server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'server.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.environ.get("STATIC_ROOT") or os.path.join(BASE_DIR, "static")
STATICFILES_DIRS = (
)

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'TEST_REQUEST_DEFAULT_FORMAT': 'json'
}

# JWT_AUTH = {
#     'JWT_ALLOW_REFRESH': True,
#     'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=3600),
#     "JWT_VERIFY": True,
#     "JWT_SECRET_KEY": SECRET_KEY,
# }

# Allowed CORS hosts
# CORS_ORIGIN_ALLOW_ALL = True

# APPEND_SLASH = False
