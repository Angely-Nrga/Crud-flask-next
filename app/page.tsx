"use client";
import "./page.css";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
};

export default function Page() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  const [editIndex, setEditIndex] = useState<number | null>(null);

  // 🔵 CARGAR USUARIOS DESDE FLASK
  const cargarUsuarios = async () => {
    const newLocal = await (await fetch("http://localhost:5000/usuarios")).json();
    const data = newLocal;
    setUsuarios(data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 🟢 AGREGAR O ACTUALIZAR
  const agregarUsuario = async () => {
    if (!nombre || !correo || !telefono) return;

    if (editIndex !== null) {
      // ✏️ ACTUALIZAR EN FLASK
      await fetch(`http://localhost:5000/usuarios/${editIndex}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      correo,
      telefono,
    }),
  });

  Swal.fire({
    icon: "success",
    title: "¡Usuario actualizado!",
    text: "Los datos fueron actualizados correctamente.",
    confirmButtonText: "Aceptar",
  });

  setEditIndex(null);

    } else {
  // ➕ GUARDAR EN FLASK
  await fetch("http://localhost:5000/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      correo,
      telefono,
    }),
  });

  Swal.fire({
    icon: "success",
    title: "¡Usuario creado!",
    text: "El usuario fue registrado correctamente.",
    confirmButtonText: "Aceptar",
  });
}

    setNombre("");
    setCorreo("");
    setTelefono("");

    cargarUsuarios();
  };

  // 🔴 ELIMINAR DESDE FLASK
  const eliminarUsuario = async (id: number) => {
  const resultado = await Swal.fire({
    title: "¿Eliminar usuario?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (resultado.isConfirmed) {
    await fetch(`http://localhost:5000/usuarios/${id}`, {
      method: "DELETE",
    });

    Swal.fire({
      icon: "success",
      title: "¡Usuario eliminado!",
      text: "El usuario fue eliminado correctamente.",
      confirmButtonText: "Aceptar",
    });

    cargarUsuarios();
  }
};
  // ✏️ CARGAR DATOS EN FORMULARIO
  const editarUsuario = (id: number) => {
    const usuario = usuarios.find((u) => u.id === id);

    if (!usuario) return;

    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setTelefono(usuario.telefono);

    setEditIndex(id);
    Swal.fire({
      icon: "info",
      title: "modo edición",
      text: "Ahora puedes modificar los datos del usuario.",
      confirmButtonText: "aceptar",
    })
  };

  return (
    <div className="container">
      <h1 className="titulo">👥 Gestión de Usuarios</h1>

      {/* FORMULARIO */}
      <div className="formulario">
        <input
          className="input"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="input"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          className="input"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        
        <button
          className="boton boton-agregar"
          onClick={agregarUsuario}
        >
          {editIndex ? "Actualizar" : "Agregar"}
        </button>
      </div>

      {/* TABLA */}
      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.telefono}</td>

              <td>
                <button
                  className="boton boton-editar"
                  onClick={() => editarUsuario(u.id)}
                >
                  Editar
                </button>

                <button
                  className="boton boton-eliminar"
                  onClick={() => eliminarUsuario(u.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


