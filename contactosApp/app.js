
function mostrarContactos() {
    fetch("http://localhost:3000/contactos")
        .then((response) => response.json())
        .then((data) => {

            const tbody = document.getElementById("tablaContactos");
            tbody.innerHTML = "";

            data.data.forEach((contacto) => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${contacto.id}</td>
                    <td>${contacto.nombre}</td>
                    <td>${contacto.telefono}</td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-btn">
                            Eliminar
                        </button>
                    </td>
                `;

                tr.querySelector(".delete-btn").addEventListener("click", () => {
                    eliminarContacto(contacto.id);
                });

                tbody.appendChild(tr);
            });
        });
}

mostrarContactos();

const form = document.getElementById("contactForm");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;

    fetch("http://localhost:3000/contactos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            telefono: telefono
        })
    })
    .then((response) => response.json())
    .then((data) => {

        alert(data.message);

        mostrarContactos();

        form.reset();
    });
});

function eliminarContacto(id) {

    fetch(`http://localhost:3000/contactos/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((data) => {

        alert(data.message);

        mostrarContactos();
    });
}