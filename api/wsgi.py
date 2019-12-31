"""WSGI production flask app"""

from api import app 


if __name__ == "__main__":
    app.run(host="0.0.0.0", load_dotenv=".env")
