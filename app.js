const API_URL = 'https://4pzuxk2jrh.execute-api.us-east-1.amazonaws.com/usuarios';

// DOM Elements
const userForm = document.getElementById('userForm');
const saveBtn = document.getElementById('saveBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const usersBody = document.getElementById('usersBody');

// Load all users when page loads
document.addEventListener('DOMContentLoaded', loadUsers);

// Event Listeners
userForm.addEventListener('submit', handleSubmit);
updateBtn.addEventListener('click', handleUpdate);
cancelBtn.addEventListener('click', handleCancel);
searchBtn.addEventListener('click', handleSearch);
clearSearchBtn.addEventListener('click', loadUsers);

// Load all users
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        const result = await response.json();
        if (result.data) {
            displayUsers(Array.isArray(result.data) ? result.data : [result.data]);
        } else {
            displayUsers([]);
        }
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Error al cargar los usuarios');
    }
}

// Display users in table
function displayUsers(users) {
    usersBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${user.telefono}</td>
            <td>${user.direccion}</td>
            <td>${new Date(user.fechaNacimiento).toLocaleDateString()}</td>
            <td>
                <button onclick="editUser('${user.id}')" class="edit-btn">Editar</button>
                <button onclick="deleteUser('${user.id}')" class="delete-btn">Eliminar</button>
            </td>
        `;
        usersBody.appendChild(row);
    });
}

// Handle form submit (Create new user)
async function handleSubmit(e) {
    e.preventDefault();
    const userData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value
    };

    try {
        console.log('Enviando datos:', userData);
        
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        };
        
        console.log('Request options:', requestOptions);
        console.log('URL:', API_URL);
        
        const response = await fetch(API_URL, requestOptions);
        console.log('Response status:', response.status);
        
        const result = await response.text();
        console.log('Response text:', result);
        
        let jsonResult;
        try {
            jsonResult = JSON.parse(result);
        } catch (e) {
            console.error('Error parsing response:', e);
            alert('Error al procesar la respuesta del servidor');
            return;
        }
        
        if (response.ok) {
            alert('Usuario creado exitosamente');
            userForm.reset();
            loadUsers();
        } else {
            console.error('Error response:', jsonResult);
            alert(jsonResult.message || 'Error al crear el usuario');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Error de red al crear el usuario. Ver consola para más detalles.');
    }
}

// Handle user update
// Reset form to create mode
function resetForm() {
    document.getElementById('userId').value = '';
    userForm.reset();
    saveBtn.style.display = 'block';
    updateBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

// Handle cancel button
function handleCancel() {
    resetForm();
}

async function handleUpdate() {
    const userId = document.getElementById('userId').value;
    if (!userId) {
        alert('No se ha seleccionado ningún usuario para actualizar');
        return;
    }

    const userData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value
    };

    try {
        const response = await fetch(`${API_URL}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Usuario actualizado exitosamente');
            userForm.reset();
            loadUsers();
        } else {
            alert(result.message || 'Error al actualizar el usuario');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error al actualizar el usuario');
    }
}

// Handle user search
async function handleSearch() {
    const searchId = document.getElementById('searchId').value;
    if (!searchId) {
        loadUsers();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${searchId}`);
        const result = await response.json();
        
        if (response.ok && result.data) {
            displayUsers([result.data]);
        } else {
            alert(result.message || 'Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error searching user:', error);
        alert('Error al buscar el usuario');
    }
}

// Delete user
async function deleteUser(id) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok) {
                alert('Usuario eliminado exitosamente');
                loadUsers();
            } else {
                alert(result.message || 'Error al eliminar el usuario');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error al eliminar el usuario');
        }
    }
}
