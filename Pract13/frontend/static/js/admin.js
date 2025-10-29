class AdminPanel {
	constructor() {
		this.hotels = [];
		this.reservations = [];
		this.isEditing = false;
		this.init();
	}

	init() {
		this.bindEvents();
		this.loadHotels();
		this.loadReservations();
	}

	bindEvents() {
		// Кнопки управления отелями
		document.getElementById('add-hotel-btn').addEventListener('click', () => this.openHotelModal());
		document.querySelector('.close').addEventListener('click', () => this.closeHotelModal());
		document.getElementById('cancel-btn').addEventListener('click', () => this.closeHotelModal());
		document.getElementById('hotel-form').addEventListener('submit', (e) => this.saveHotel(e));

		// Закрытие модального окна
		window.addEventListener('click', (e) => {
			if (e.target === document.getElementById('hotel-modal')) {
				this.closeHotelModal();
			}
		});

		// Переключение вкладок
		document.querySelectorAll('.tab-button').forEach(btn => {
			btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
		});
	}

	switchTab(tabName) {
		// Обновляем активные кнопки
		document.querySelectorAll('.tab-button').forEach(btn => {
			btn.classList.remove('active');
		});
		document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

		// Показываем активный контент
		document.querySelectorAll('.tab-content').forEach(content => {
			content.classList.remove('active');
		});
		document.getElementById(`${tabName}-tab`).classList.add('active');
	}

	async loadHotels() {
		try {
			const response = await fetch('/api/hotels');
			if (!response.ok) throw new Error('Ошибка загрузки отелей');
			
			const data = await response.json();
			this.hotels = data.hotels;
			this.renderHotels();
		} catch (error) {
			this.showAlert('Ошибка при загрузке отелей: ' + error.message, 'error');
		}
	}

	async loadReservations() {
		try {
			const response = await fetch('/api/reservations');
			if (!response.ok) throw new Error('Ошибка загрузки бронирований');
			
			const data = await response.json();
			this.reservations = data.reservations;
			this.renderReservations();
		} catch (error) {
			this.showAlert('Ошибка при загрузке бронирований: ' + error.message, 'error');
		}
	}

	renderHotels() {
		const tbody = document.getElementById('hotels-tbody');
		const emptyState = document.getElementById('empty-state');
		const table = document.getElementById('hotels-table');

		if (this.hotels.length === 0) {
			emptyState.style.display = 'block';
			table.style.display = 'none';
			return;
		}

		emptyState.style.display = 'none';
		table.style.display = 'table';

		tbody.innerHTML = this.hotels.map(hotel => `
			<tr>
				<td>${hotel.id}</td>
				<td>${this.escapeHtml(hotel.name)}</td>
				<td>${this.escapeHtml(hotel.description)}</td>
				<td>${hotel.roomsCount}</td>
				<td>
					<div class="action-buttons">
						<button class="btn btn-warning" onclick="adminPanel.editHotel(${hotel.id})">
							Редактировать
						</button>
						<button class="btn btn-danger" onclick="adminPanel.deleteHotel(${hotel.id})">
							Удалить
						</button>
					</div>
				</td>
			</tr>
		`).join('');
	}

	renderReservations() {
		const tbody = document.getElementById('reservations-tbody');
		
		tbody.innerHTML = this.reservations.map(reservation => `
			<tr>
				<td>${reservation.id}</td>
				<td>${this.escapeHtml(reservation.surname)}</td>
				<td>${this.escapeHtml(reservation.hotelName || 'Неизвестно')}</td>
				<td>${reservation.startDate}</td>
				<td>${reservation.endDate}</td>
				<td>${reservation.numberPeople}</td>
				<td>${this.escapeHtml(reservation.email)}</td>
			</tr>
		`).join('');
	}

	openHotelModal(hotel = null) {
		const modal = document.getElementById('hotel-modal');
		const title = document.getElementById('modal-title');
		
		if (hotel) {
			title.textContent = 'Редактировать отель';
			document.getElementById('hotel-id').value = hotel.id;
			document.getElementById('hotel-name').value = hotel.name;
			document.getElementById('hotel-description').value = hotel.description;
			document.getElementById('hotel-rooms').value = hotel.roomsCount;
			this.isEditing = true;
		} else {
			title.textContent = 'Добавить отель';
			document.getElementById('hotel-form').reset();
			this.isEditing = false;
		}
		
		modal.style.display = 'flex';
	}

	closeHotelModal() {
		document.getElementById('hotel-modal').style.display = 'none';
		document.getElementById('hotel-form').reset();
		this.isEditing = false;
	}

	async saveHotel(event) {
		event.preventDefault();
		
		const formData = {
			name: document.getElementById('hotel-name').value,
			description: document.getElementById('hotel-description').value,
			roomsCount: parseInt(document.getElementById('hotel-rooms').value)
		};

		const hotelId = document.getElementById('hotel-id').value;
		if (this.isEditing && hotelId) {
			formData.id = hotelId;
		}

		try {
			const url = '/api/hotels';
			const method = this.isEditing ? 'PUT' : 'POST';
			
			const response = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Ошибка сервера');
			}

			this.showAlert(data.message, 'success');
			this.closeHotelModal();
			this.loadHotels();
			
		} catch (error) {
			this.showAlert('Ошибка при сохранении отеля: ' + error.message, 'error');
		}
	}

	editHotel(id) {
		const hotel = this.hotels.find(h => h.id == id);
		if (hotel) {
			this.openHotelModal(hotel);
		}
	}

	async deleteHotel(id) {
		if (!confirm('Вы уверены, что хотите удалить этот отель?')) {
			return;
		}

		try {
			const response = await fetch('/api/hotels', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: id })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Ошибка сервера');
			}

			this.showAlert(data.message, 'success');
			this.loadHotels();
			
		} catch (error) {
			this.showAlert('Ошибка при удалении отеля: ' + error.message, 'error');
		}
	}

	showAlert(message, type) {
		const alertContainer = document.getElementById('alert-container');
		const alert = document.createElement('div');
		alert.className = `alert alert-${type}`;
		alert.textContent = message;
		
		alertContainer.appendChild(alert);
		
		setTimeout(() => {
			alert.remove();
		}, 5000);
	}

	escapeHtml(unsafe) {
		if (!unsafe) return '';
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
}

// Инициализация админ-панели при загрузке страницы
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
	adminPanel = new AdminPanel();
});