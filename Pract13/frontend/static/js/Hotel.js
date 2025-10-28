class Hotel {
	static Hotels = [];

	constructor(data) {
		if (!data) throw new Error('Нет данных для создания');
		this.id = data.id || '';
		this.name = data.name || '';
		this.description = data.description || '';
		this.roomsCount = data.roomsCount || data.rooms_count || '';
	}

	toString() {
		return `${this.name}\n${this.description}\nКомнат: ${this.roomsCount}`;
	}

	static async loadHotels() {
		try {
			const response = await fetch('/api/hotels');
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const data = await response.json();
			
			if (data.error) throw data.error;
			
			this.Hotels = data.hotels.map(h => new Hotel(h));
			this.renderHotels();
			return this.Hotels;
		} catch (error) {
			console.error('Ошибка загрузки отелей:', error);
			// Загрузка демо-данных при ошибке
			this.Hotels = this.getDemoHotels();
			this.renderHotels();
			return this.Hotels;
		}
	}

	static renderHotels(hotels = this.Hotels) {
		const container = document.getElementById('hotelsContainer');
		
		if (!container) {
			console.error('Контейнер отелей не найден');
			return;
		}

		if (hotels.length === 0) {
			container.innerHTML = '<div class="hotel-card">Отели не найдены</div>';
			return;
		}

		container.innerHTML = hotels.map(hotel => `
			<div class="hotel-card">
				<div class="hotel-name">${this.escapeHtml(hotel.name)}</div>
				<div class="hotel-description">${this.escapeHtml(hotel.description)}</div>
				<div class="hotel-rooms">Комнат: ${hotel.roomsCount}</div>
			</div>
		`).join('');
	}

	static async setHotelSelect(){
		const select = document.getElementById('hotelSelect');
		if (!select) return;
		
		try {
			const hotels = await this.loadHotels();
			
			hotels.forEach(element => {
				let option = document.createElement('option');
				option.setAttribute('value', element.id);
				option.textContent = element.name;
				select.appendChild(option);
			});
		} catch(error){
			console.error('Ошибка при установке select:', error);
		}
	}

	static escapeHtml(unsafe) {
		if (!unsafe) return '';
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	static searchHotels(query) {
		const searchTerm = query.toLowerCase().trim();
		if (!searchTerm) return this.Hotels;
		
		const roomsCount = parseInt(searchTerm);
		const isNumber = !isNaN(roomsCount);

		return this.Hotels.filter(hotel =>
			hotel.name.toLowerCase().includes(searchTerm) ||
			hotel.description.toLowerCase().includes(searchTerm) ||
			(isNumber && hotel.roomsCount.toString().includes(roomsCount.toString()))
		);
	}

	static sortHotels(hotels, criterion) {
		const sorted = [...hotels];
		
		switch (criterion) {
			case 'name':
				return sorted.sort((a, b) => a.name.localeCompare(b.name));
			case 'name_desc':
				return sorted.sort((a, b) => b.name.localeCompare(a.name));
			case 'rooms':
				return sorted.sort((a, b) => a.roomsCount - b.roomsCount);
			case 'rooms_desc':
				return sorted.sort((a, b) => b.roomsCount - a.roomsCount);
			default:
				return sorted;
		}
	}

	static getDemoHotels() {
		return [
			new Hotel({
				id: 1,
				name: "Grand Hotel",
				description: "Роскошный отель в центре города с прекрасным видом",
				roomsCount: 45
			}),
			new Hotel({
				id: 2,
				name: "Cosmos",
				description: "Уютный бюджетный вариант для семейного отдыха",
				roomsCount: 23
			}),
			new Hotel({
				id: 3,
				name: "Sea View Resort",
				description: "Курортный отель с прямым выходом к пляжу",
				roomsCount: 78
			}),
			new Hotel({
				id: 4,
				name: "Business Inn",
				description: "Идеально для деловых поездок с конференц-залами",
				roomsCount: 34
			})
		];
	}
}