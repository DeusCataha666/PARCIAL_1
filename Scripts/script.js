async function Cargacomponentes(id, url) {
  const path = url;
  const resp = await fetch(path);
  const codig = await resp.text();
  document.getElementById(id).innerHTML = codig;
}

// Cargar componentes y luego inicializar autenticación
async function initializeApp() {
  await Cargacomponentes("header-container", "pages/header.html");
  await Cargacomponentes("footer-container", "pages/footer.html");
  
  // Importar y inicializar el módulo de autenticación después de cargar el header
  try {
    await import('./auth-state.js');
  } catch (error) {
    console.error('Error cargando módulo de autenticación:', error);
  }
}

// Inicializar la aplicación
initializeApp();

// Sistema de carrito de compras
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.updateCartCount();
  }

  addItem(book) {
    const existingItem = this.items.find(item => item.id === book.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: book.id,
        title: book.title,
        author: book.author,
        image: book.image,
        price: book.price || 19.99,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.updateCartCount();
    this.showAddedToCartNotification(book.title);
  }

  removeItem(bookId) {
    this.items = this.items.filter(item => item.id !== bookId);
    this.saveCart();
    this.updateCartCount();
  }

  updateQuantity(bookId, quantity) {
    const item = this.items.find(item => item.id === bookId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeItem(bookId);
      } else {
        this.saveCart();
        this.updateCartCount();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
      const count = this.getItemCount();
      countElement.textContent = count;
      
      if (count > 0) {
        countElement.classList.remove('hidden');
      } else {
        countElement.classList.add('hidden');
      }
    }
  }

  showAddedToCartNotification(bookTitle) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="cart-notification-content">
        <i class="bi bi-check-circle-fill"></i>
        <span>"${bookTitle}" agregado al carrito</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar notificación
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }
}

// Instancia global del carrito
const cart = new ShoppingCart();

// Función global para mostrar el modal del carrito
function showCartModal() {
  const modal = document.getElementById('cart-modal');
  renderCartItems();
  updateCartTotal();
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal del carrito
function closeCartModal() {
  const modal = document.getElementById('cart-modal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Función para renderizar los productos del carrito
function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty');
  
  if (cart.items.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }
  
  container.style.display = 'block';
  emptyState.style.display = 'none';
  
  container.innerHTML = cart.items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image">
        <img src="${item.image || 'https://via.placeholder.com/80x100?text=No+image'}" alt="${item.title}">
      </div>
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.title}</h4>
        <p class="cart-item-author">${item.author}</p>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <button class="remove-item-btn" onclick="removeItemFromCart(${item.id})" title="Eliminar producto">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Función para actualizar la cantidad de un producto
function updateItemQuantity(itemId, newQuantity) {
  cart.updateQuantity(itemId, newQuantity);
  renderCartItems();
  updateCartTotal();
}

// Función para eliminar un producto del carrito
function removeItemFromCart(itemId) {
  cart.removeItem(itemId);
  renderCartItems();
  updateCartTotal();
}

// Función para actualizar el total del carrito
function updateCartTotal() {
  const totalElement = document.getElementById('cart-total-amount');
  if (totalElement) {
    totalElement.textContent = `$${cart.getTotal().toFixed(2)}`;
  }
}

// ============== FUNCIONES PARA LOS MODALES ADICIONALES ==============

// Modal de Eventos
function showEventsModal() {
  const modal = document.getElementById('events-modal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeEventsModal() {
  const modal = document.getElementById('events-modal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Modal de Colección
function showCollectionModal() {
  const modal = document.getElementById('collection-modal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCollectionModal() {
  const modal = document.getElementById('collection-modal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Modal de Membresía
function showMembershipModal() {
  const modal = document.getElementById('membership-modal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMembershipModal() {
  const modal = document.getElementById('membership-modal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Modal de Discord
function showDiscordModal() {
  const modal = document.getElementById('discord-modal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeDiscordModal() {
  const modal = document.getElementById('discord-modal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Función para filtrar por categoría (desde el modal de colección)
function filterByCategory(category) {
  closeCollectionModal();
  // Aquí se implementaría la lógica de filtrado
  console.log(`Filtrando por categoría: ${category}`);
  // Por ahora, redirigimos al catálogo
  window.location.href = `/pages/catalogo.html?category=${encodeURIComponent(category)}`;
}

// ============== FUNCIONES PARA LA ALERTA DEL FORMULARIO ==============

// Función para mostrar la alerta del formulario
function showFormAlert() {
  const overlay = document.getElementById('form-alert-overlay');
  const alert = document.getElementById('form-alert');
  
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Pequeño delay para la animación de la alerta
  setTimeout(() => {
    alert.classList.add('show');
  }, 100);
}

// Función para cerrar la alerta del formulario
function closeFormAlert() {
  const overlay = document.getElementById('form-alert-overlay');
  const alert = document.getElementById('form-alert');
  
  alert.classList.remove('show');
  
  setTimeout(() => {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }, 300);
}

// Función para manejar el envío del formulario
function handleFormSubmit(event) {
  event.preventDefault(); // Prevenir el envío normal del formulario
  
  const form = event.target;
  const formData = new FormData(form);
  
  // Validar que todos los campos estén llenos
  const nombre = formData.get('nombre');
  const email = formData.get('email');
  const telefono = formData.get('telefono');
  const mensaje = formData.get('mensaje');
  
  if (!nombre || !email || !telefono || !mensaje) {
    // Si hay campos vacíos, usar la validación de Bootstrap
    form.classList.add('was-validated');
    return;
  }
  
  // Simular envío exitoso
  console.log('Formulario enviado:', {
    nombre,
    email,
    telefono,
    mensaje
  });
  
  // Limpiar el formulario
  form.reset();
  form.classList.remove('was-validated');
  
  // Mostrar la alerta de éxito
  showFormAlert();
}


document.addEventListener("DOMContentLoaded", async function () {
  // Cargar libros desde /DATA/books.json
  let booksData = [];
  try {
    const response = await fetch("/DATA/books.json");
    if (!response.ok) throw new Error("No se pudo cargar books.json");
    booksData = await response.json();
    booksData = booksData.books; // <-- ACCESO CORRECTO AL ARRAY
  } catch (error) {
    alert("Error cargando los libros: " + error.message);
    return;
  }

  // Navegación suave
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("data-section");
      if (sectionId) {
        document.querySelector(`.${sectionId}-section`).scrollIntoView({
          behavior: "smooth",
        });
      }

      document.querySelectorAll(".nav-link").forEach((navLink) => {
        navLink.classList.remove("active");
      });
      this.classList.add("active");
    });
  });

  // Sistema de recomendaciones
  function getRecommendations() {
    return booksData.sort((a, b) => b.rating - a.rating).slice(0, 12);
  }

  function displayRecommendations() {
    const recommendations = getRecommendations();
    const container = document.querySelector(".recommendations-container");
    const template = document.getElementById("cards-template");

    container.innerHTML = "";

    recommendations.forEach((book) => {
      // Clonar el template
      const cardElement = template.content.cloneNode(true);
      const card = cardElement.querySelector(".recommendation-card");
      
      // Configurar atributos de accesibilidad
      card.tabIndex = 0;
      card.setAttribute(
        "aria-label",
        `Recomendación: ${book.title} por ${book.author}`
      );

      // Rellenar los datos del template
      const bookCover = cardElement.querySelector(".book-cover");
      const bookTitle = cardElement.querySelector(".book-title");
      const bookAuthor = cardElement.querySelector(".book-author");
      const bookCategory = cardElement.querySelector(".book-category");
      const bookRating = cardElement.querySelector(".book-rating");

      bookCover.src = book.image || "https://via.placeholder.com/150x200?text=No+image";
      bookCover.alt = `Portada de ${book.title}`;
      bookTitle.textContent = book.title;
      bookAuthor.textContent = book.author;
      bookCategory.textContent = book.category;
      bookRating.textContent = "★".repeat(Math.floor(book.rating)) + "☆".repeat(5 - Math.floor(book.rating));

      // Agregar botón de ver detalles
      const bookMeta = cardElement.querySelector(".book-meta");
      const detailsButton = document.createElement("button");
      detailsButton.className = "btn btn-sm book-details-btn";
      detailsButton.style.cssText = `
        background: linear-gradient(135deg, var(--accent-color), var(--hover-btn)); 
        color: var(--primary-bg); 
        width: 100%; 
        border: none; 
        padding: 0.6rem 1rem; 
        border-radius: 8px; 
        font-weight: 500; 
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(76, 201, 240, 0.3);
      `;
      detailsButton.innerHTML = `<i class="bi bi-eye"></i> Ver detalles`;
      bookMeta.appendChild(detailsButton);

      // Agregar event listeners
      card.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON" && !e.target.closest("button")) {
          showBookDetailModal(book);
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          showBookDetailModal(book);
        }
      });

      // Event listener específico para el botón de detalles
      detailsButton.addEventListener("click", (e) => {
        e.stopPropagation();
        showBookDetailModal(book);
      });

      container.appendChild(cardElement);
    });
  }

  // Configuración del formulario de contacto
  function setupContactForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
      // Remover el atributo novalidate si existe
      form.removeAttribute('novalidate');
      
      // Agregar event listener para el envío del formulario
      form.addEventListener('submit', handleFormSubmit);
      
      // Configurar validación en tiempo real
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', function() {
          if (this.checkValidity()) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
          } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
          }
        });
        
        input.addEventListener('input', function() {
          if (this.classList.contains('is-invalid') && this.checkValidity()) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
          }
        });
      });
    }
  }

  // Event listener para cerrar alerta con tecla Escape
  function setupFormAlertEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('form-alert-overlay');
        if (overlay && overlay.classList.contains('show')) {
          closeFormAlert();
        }
      }
    });

    // Cerrar al hacer clic en el overlay
    const overlay = document.getElementById('form-alert-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeFormAlert();
        }
      });
    }
  }

  // Función para mostrar el modal de detalles del libro
  function showBookDetailModal(book) {
    const modal = document.getElementById('book-detail-modal');
    currentModalBook = book; // Guardar referencia al libro actual
    
    // Rellenar datos del modal
    document.getElementById('modal-book-cover').src = book.image || "https://via.placeholder.com/300x450?text=No+image";
    document.getElementById('modal-book-cover').alt = `Portada de ${book.title}`;
    document.getElementById('modal-book-title').textContent = book.title;
    document.getElementById('modal-book-author').textContent = book.author;
    document.getElementById('modal-book-category').textContent = book.category;
    document.getElementById('modal-book-year').textContent = book.year || 'Año no disponible';
    document.getElementById('modal-book-rating').textContent = "★".repeat(Math.floor(book.rating)) + "☆".repeat(5 - Math.floor(book.rating));
    document.getElementById('modal-book-description').textContent = book.description || 'Descripción no disponible';
    
    // Configurar botón de agregar al carrito
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.onclick = () => {
      cart.addItem(currentModalBook);
    };
    
    // Mostrar modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // Función para cerrar el modal
  function closeBookDetailModal() {
    const modal = document.getElementById('book-detail-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Event listeners para el modal de detalles
  function setupModalEvents() {
    const modal = document.getElementById('book-detail-modal');
    const closeBtn = document.querySelector('.book-modal-close');
    
    // Cerrar con botón X
    closeBtn.addEventListener('click', closeBookDetailModal);
    
    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeBookDetailModal();
      }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeBookDetailModal();
      }
    });
  }

  // Event listeners para el modal del carrito
  function setupCartModalEvents() {
    const cartModal = document.getElementById('cart-modal');
    const cartCloseBtn = cartModal.querySelector('.book-modal-close');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Cerrar con botón X
    cartCloseBtn.addEventListener('click', closeCartModal);
    
    // Cerrar al hacer clic fuera del modal
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        closeCartModal();
      }
    });
    
    // Botón de checkout
    checkoutBtn.addEventListener('click', () => {
      if (cart.items.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos libros antes de proceder al pago.');
        return;
      }
      
      // Aquí se implementaría la lógica de checkout
      alert(`Procesando pago por $${cart.getTotal().toFixed(2)}. Esta funcionalidad se implementará próximamente.`);
    });
  }

  // Event listeners para todos los modales adicionales
  function setupAdditionalModalsEvents() {
    const modals = [
      { id: 'events-modal', closeFn: closeEventsModal },
      { id: 'collection-modal', closeFn: closeCollectionModal },
      { id: 'membership-modal', closeFn: closeMembershipModal },
      { id: 'discord-modal', closeFn: closeDiscordModal }
    ];

    modals.forEach(({ id, closeFn }) => {
      const modal = document.getElementById(id);
      const closeBtn = modal.querySelector('.book-modal-close');
      
      // Cerrar con botón X
      closeBtn.addEventListener('click', closeFn);
      
      // Cerrar al hacer clic fuera del modal
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeFn();
        }
      });
    });

    // Los event listeners específicos ya no son necesarios
    
    // Cerrar con tecla Escape (para todos los modales)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Verificar qué modal está abierto y cerrarlo
        if (document.getElementById('book-detail-modal').classList.contains('show')) {
          closeBookDetailModal();
        } else if (document.getElementById('cart-modal').classList.contains('show')) {
          closeCartModal();
        } else if (document.getElementById('events-modal').classList.contains('show')) {
          closeEventsModal();
        } else if (document.getElementById('collection-modal').classList.contains('show')) {
          closeCollectionModal();
        } else if (document.getElementById('membership-modal').classList.contains('show')) {
          closeMembershipModal();
        } else if (document.getElementById('discord-modal').classList.contains('show')) {
          closeDiscordModal();
        }
      }
    });
  }

  // Los event listeners específicos para membresía y Discord ya no son necesarios
  // porque ahora redirigen directamente a la página 404

  // Variable global para el libro actual del modal
  let currentModalBook = null;

  // Quick View (mantener para compatibilidad)
  function setupQuickView() {
    document
      .querySelectorAll(".carousel-book, .recommendation-card ")
      .forEach((book) => {
        book.addEventListener("click", function (e) {
          if (e.target.tagName === "BUTTON") return;

          const title =
            this.querySelector("h3")?.textContent ||
            this.querySelector(".book-title")?.textContent;
          const bookData = booksData.find((b) => b.title === title);

          if (bookData) {
            showBookDetailModal(bookData);
          }
        });
      });
  }

  function showQuickView(book) {
    const quickView = document.createElement("div");
    quickView.className = "books-reco quick-view-overlay";
    quickView.innerHTML = `
      <div class="quick-view-content">
        <button class="close-btn" aria-label="Cerrar vista rápida">&times;</button>
        <div class="quick-view-body">
          <div class="quick-view-image">
            <img src="${book.image || "https://via.placeholder.com/300x450?text=No+image"
      }" alt="Portada de ${book.title}" loading="lazy">
          </div>
          <div class="quick-view-info">
            <h2>${book.title}</h2>
            <p class="author">${book.author}</p>
            <p class="category">${book.category}</p>
            <div class="rating">${"★".repeat(
        Math.floor(book.rating)
      )}${"☆".repeat(5 - Math.floor(book.rating))}</div>
            <p class="description">${book.description}</p>
            <div class="quick-view-actions">
              <a href="/pages/404.html" style="text-decoration: none;">
                <button class="btn secondary-btn">Ver detalles</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(quickView);
    document.body.style.overflow = "hidden";

    quickView.querySelector(".close-btn").addEventListener("click", () => {
      document.body.removeChild(quickView);
      document.body.style.overflow = "";
    });

    // Funcionalidad de agregar al carrito removida temporalmente
    // quickView.querySelector(".add-to-cart").addEventListener("click", () => {
    //   addToCart(book);
    //   document.body.removeChild(quickView);
    //   document.body.style.overflow = "";
    // });
  }

  // Animaciones al scroll
  function setupScrollAnimations() {
    const elements = document.querySelectorAll(".scroll-animation");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    elements.forEach((el) => {
      observer.observe(el);
    });
  }

  // Inicialización
  displayRecommendations();
  setupScrollAnimations();
  setupModalEvents();
  setupCartModalEvents();
  setupAdditionalModalsEvents();
  setupContactForm();
  setupFormAlertEvents();

  // Actualizar contador del carrito después de cargar el header
  setTimeout(() => {
    cart.updateCartCount();
  }, 500);

  // Carga inicial del carrusel
  setTimeout(updateCarousel, 300);
});
