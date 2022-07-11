from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
ma = Marshmallow()


class Breed(db.Model):
    breed_name = db.Column(db.String(80), primary_key=True)
    thumbnail_url = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f"<Breed '{self.breed_name}'>"


class BreedSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Breed
