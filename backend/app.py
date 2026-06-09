from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# 🗄️ BASE DE DATOS SQLITE
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usuarios.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# =========================
# 📦 MODELO
# =========================
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)

# =========================
# 🔵 CREAR TABLAS
# =========================
with app.app_context():
    db.create_all()

# =========================
# 🏠 HOME
# =========================
@app.route('/')
def home():
    return "API funcionando 🚀"

# =========================
# 📄 GET - obtener usuarios
# =========================
@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    usuarios = Usuario.query.all()

    return jsonify([
        {
            "id": u.id,
            "nombre": u.nombre,
            "correo": u.correo,
            "telefono": u.telefono
        } for u in usuarios
    ])

# =========================
# ➕ POST - crear usuario
# =========================
@app.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.json

    nuevo = Usuario(
        nombre=data['nombre'],
        correo=data['correo'],
        telefono=data['telefono']
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify({"message": "Usuario creado correctamente ✅"}), 201

# =========================
# ✏️ PUT - actualizar usuario
# =========================
@app.route('/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    data = request.json

    usuario.nombre = data['nombre']
    usuario.correo = data['correo']
    usuario.telefono = data['telefono']

    db.session.commit()

    return jsonify({"message": "Usuario actualizado correctamente ✅"})

# =========================
# ❌ DELETE - eliminar usuario
# =========================
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    usuario = Usuario.query.get_or_404(id)

    db.session.delete(usuario)
    db.session.commit()

    return jsonify({"message": "Usuario eliminado correctamente ✅"})

# =========================
# ▶️ RUN SERVER
# =========================
if __name__ == '__main__':
    app.run(debug=True)