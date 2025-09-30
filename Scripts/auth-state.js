import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Estado global del usuario
let currentUser = null;
let userProfile = null;

// Función para obtener los datos del perfil del usuario
async function getUserProfile(uid) {
    try {
        const userDoc = await getDoc(doc(db, 'usuarios', uid));
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo perfil del usuario:', error);
        return null;
    }
}

// Función para actualizar la UI del header
function updateHeaderUI(user, profile) {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    const authButton = headerContainer.querySelector('.btn-light');
    if (!authButton) return;

    if (user && profile) {
        // Usuario logueado - mostrar botón de perfil
        authButton.innerHTML = `
            <i class="bi bi-person-circle"></i> ${profile.nombreUsuario || profile.nombre}
        `;
        authButton.onclick = () => showProfileModal();
        authButton.href = '#';
    } else {
        // Usuario no logueado - mostrar botón de registro
        authButton.innerHTML = `
            <i class="bi bi-person-circle"></i> Únete a Nexus
        `;
        authButton.onclick = null;
        authButton.href = '/account/registro.html';
    }
}

// Función para mostrar el modal del perfil
function showProfileModal() {
    if (!currentUser || !userProfile) return;

    // Crear el modal si no existe
    let modal = document.getElementById('profile-modal');
    if (!modal) {
        createProfileModal();
        modal = document.getElementById('profile-modal');
    }

    // Actualizar la información del modal
    updateProfileModalContent();

    // Mostrar el modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Función para crear el modal del perfil
function createProfileModal() {
    const modalHTML = `
        <div id="profile-modal" class="profile-modal-overlay">
            <div class="profile-modal-content">
                <button class="profile-modal-close" aria-label="Cerrar perfil">&times;</button>
                <div class="profile-modal-header">
                    <div class="profile-avatar">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <h2 id="profile-name">Nombre del Usuario</h2>
                    <p id="profile-username">@nombreusuario</p>
                </div>
                <div class="profile-modal-body">
                    <div class="profile-info-section">
                        <h3><i class="bi bi-info-circle"></i> Información Personal</h3>
                        <div class="profile-info-item">
                            <label>Nombre Completo:</label>
                            <span id="profile-fullname">-</span>
                        </div>
                        <div class="profile-info-item">
                            <label>Correo Electrónico:</label>
                            <span id="profile-email">-</span>
                        </div>
                        <div class="profile-info-item">
                            <label>Fecha de Registro:</label>
                            <span id="profile-register-date">-</span>
                        </div>
                    </div>
                    <div class="profile-stats-section">
                        <h3><i class="bi bi-graph-up"></i> Estadísticas</h3>
                        <div class="profile-stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="bi bi-book"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number">0</span>
                                    <span class="stat-label">Libros en carrito</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="bi bi-heart"></i>
                                </div>
                                <div class="stat-info">
                                    <span class="stat-number">0</span>
                                    <span class="stat-label">Favoritos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-modal-footer">
                    <button class="btn secondary-btn" onclick="closeProfileModal()">
                        <i class="bi bi-arrow-left"></i> Cerrar
                    </button>
                    <button class="btn danger-btn" onclick="handleLogout()">
                        <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupProfileModalEvents();
}

// Función para actualizar el contenido del modal del perfil
function updateProfileModalContent() {
    if (!userProfile) return;

    document.getElementById('profile-name').textContent = `${userProfile.nombre} ${userProfile.apellidos}`;
    document.getElementById('profile-username').textContent = `@${userProfile.nombreUsuario}`;
    document.getElementById('profile-fullname').textContent = `${userProfile.nombre} ${userProfile.apellidos}`;
    document.getElementById('profile-email').textContent = userProfile.correoElectronico;
    
    // Formatear fecha de registro
    if (userProfile.fechaRegistro) {
        const date = new Date(userProfile.fechaRegistro);
        document.getElementById('profile-register-date').textContent = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Actualizar estadísticas
    const cartCount = window.cart ? window.cart.getItemCount() : 0;
    document.querySelector('.stat-card .stat-number').textContent = cartCount;
}

// Función para cerrar el modal del perfil
function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Función para manejar el cierre de sesión
async function handleLogout() {
    try {
        await signOut(auth);
        closeProfileModal();
        
        // Mostrar notificación de cierre de sesión
        const alertBox = document.createElement('div');
        alertBox.textContent = '¡Sesión cerrada exitosamente!';
        alertBox.style.position = 'fixed';
        alertBox.style.top = '10px';
        alertBox.style.right = '10px';
        alertBox.style.backgroundColor = 'green';
        alertBox.style.color = 'white';
        alertBox.style.padding = '10px';
        alertBox.style.borderRadius = '5px';
        alertBox.style.zIndex = '10000';
        document.body.appendChild(alertBox);

        setTimeout(() => {
            if (document.body.contains(alertBox)) {
                document.body.removeChild(alertBox);
            }
        }, 2000);

    } catch (error) {
        console.error('Error cerrando sesión:', error);
        alert('Error al cerrar sesión');
    }
}

// Configurar eventos del modal del perfil
function setupProfileModalEvents() {
    const modal = document.getElementById('profile-modal');
    const closeBtn = modal.querySelector('.profile-modal-close');
    
    // Cerrar con botón X
    closeBtn.addEventListener('click', closeProfileModal);
    
    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProfileModal();
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeProfileModal();
        }
    });
}

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    
    if (user) {
        // Usuario logueado - obtener perfil
        userProfile = await getUserProfile(user.uid);
        console.log('Usuario logueado:', userProfile);
    } else {
        // Usuario no logueado
        userProfile = null;
        console.log('Usuario no logueado');
    }
    
    // Actualizar UI del header
    updateHeaderUI(user, userProfile);
});

// Hacer las funciones globales para que puedan ser llamadas desde HTML
window.showProfileModal = showProfileModal;
window.closeProfileModal = closeProfileModal;
window.handleLogout = handleLogout;

// Exportar funciones para uso en otros módulos
export { currentUser, userProfile, showProfileModal, closeProfileModal };
