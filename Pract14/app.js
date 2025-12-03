const SEASONS = [
    new Season('Зима', 1),
    new Season('Весна', 2),
    new Season('Лето', 3),
    new Season('Осень', 4),
]

const MONTHS = [
    new Month('Январь', 'img/1.jpg', 1, 1),
    new Month('Февраль', 'img/2.jpg', 2, 1),
    new Month('Март', 'img/3.jpg', 3, 2),
    new Month('Апрель', 'img/4.jpg', 4, 2),
    new Month('Май', 'img/5.jpg', 5, 2),    
    new Month('Июнь', 'img/6.jpg', 6, 3),
    new Month('Июль', 'img/7.jpg', 7, 3),
    new Month('Август', 'img/8.jpg', 8, 3),
    new Month('Сентябрь', 'img/9.jpg', 9, 4),
    new Month('Октябрь', 'img/10.jpg', 10, 4),
    new Month('Ноябрь', 'img/11.jpg', 11, 4),
    new Month('Декабрь', 'img/12.jpeg', 12, 1),    
];

let sortMode = 'none'; // 'none', 'asc', 'desc'
let selectedSeason = null;

function renderCard(month){
    const el = document.getElementsByName('images')[0];
    let newMonth = document.createElement('div');
    newMonth.className = 'month-card';
    
    // Получаем название сезона
    const seasonName = SEASONS.find(s => s.number === month.seasonNumber).name;
    
    newMonth.innerHTML=`
    <div>
        <h2>${month.name}</h2>
        <img src="${month.imageSource}" alt="${month.name}" onerror="this.src='https://via.placeholder.com/200x150?text=Нет+изображения'">
        <div class="month-info">
            <span class="month-number">Месяц: ${month.number}</span>
            <span class="season-badge" data-season="${month.seasonNumber}">${seasonName}</span>
        </div>
    </div>
    `;
    el.appendChild(newMonth);
}

function clearImages(){
    const el = document.getElementsByName('images')[0];
    el.innerHTML = '';
}

function renderFilteredMonths() {
    clearImages();
    
    let monthsToShow = [...MONTHS];
    const query = document.getElementById('search').value.toLowerCase();
    
    // Применяем текстовый фильтр
    if (query) {
        monthsToShow = monthsToShow.filter(month => 
            month.name.toLowerCase().includes(query) ||
            month.seasonNumber.toString().includes(query) ||
            month.number.toString().includes(query)
        );
    }
    
    // Применяем фильтр по сезону
    if (selectedSeason) {
        monthsToShow = monthsToShow.filter(month => month.seasonNumber === selectedSeason);
    }
    
    // Применяем сортировку если включена
    if (sortMode === 'asc') {
        monthsToShow.sort((a, b) => {
            // Сначала по сезону, затем по имени месяца
            if (a.seasonNumber !== b.seasonNumber) {
                return a.seasonNumber - b.seasonNumber;
            }
            return a.name.localeCompare(b.name);
        });
    } else if (sortMode === 'desc') {
        monthsToShow.sort((a, b) => {
            // Обратная сортировка: сначала по сезону (обратно), затем по имени (обратно)
            if (a.seasonNumber !== b.seasonNumber) {
                return b.seasonNumber - a.seasonNumber;
            }
            return b.name.localeCompare(a.name);
        });
    }
    // Если sortMode === 'none' - оставляем исходный порядок
    
    // Отображаем результат
    monthsToShow.forEach(month => renderCard(month));
}

function renderByTextQuery(query){
    renderFilteredMonths();
}

function toggleSort() {
    const sortButton = document.getElementById('toggle-sort');
    const reverseButton = document.getElementById('reverse-sort');
    
    if (sortMode === 'none') {
        sortMode = 'asc';
        sortButton.textContent = 'Сортировка: по возрастанию';
        sortButton.classList.add('active');
        reverseButton.disabled = false;
    } else if (sortMode === 'asc') {
        sortMode = 'desc';
        sortButton.textContent = 'Сортировка: по убыванию';
        reverseButton.disabled = false;
    } else {
        sortMode = 'none';
        sortButton.textContent = 'Сортировка: выкл';
        sortButton.classList.remove('active');
        reverseButton.disabled = true;
    }
    
    renderFilteredMonths();
}

function toggleReverseSort() {
    if (sortMode === 'asc') {
        sortMode = 'desc';
        document.getElementById('toggle-sort').textContent = 'Сортировка: по убыванию';
    } else if (sortMode === 'desc') {
        sortMode = 'asc';
        document.getElementById('toggle-sort').textContent = 'Сортировка: по возрастанию';
    }
    
    renderFilteredMonths();
}

function filterBySeason(seasonNumber) {
    // Если нажали на уже выбранный сезон - снимаем фильтр
    selectedSeason = selectedSeason === seasonNumber ? null : seasonNumber;
    
    // Обновляем кнопки
    document.querySelectorAll('.season-btn').forEach(btn => {
        const btnSeason = parseInt(btn.dataset.season);
        btn.classList.toggle('active', btnSeason === selectedSeason);
    });
    
    renderFilteredMonths();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function(){
    // Инициализация кнопки сортировки
    document.getElementById('toggle-sort').addEventListener('click', toggleSort);
    
    // Инициализация кнопки обратной сортировки
    document.getElementById('reverse-sort').addEventListener('click', toggleReverseSort);
    
    // Инициализация кнопок сезонов
    document.querySelectorAll('.season-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const seasonNum = parseInt(this.dataset.season);
            filterBySeason(seasonNum);
        });
    });
    
    // Первоначальная отрисовка (месяцы по порядку как в массиве)
    renderFilteredMonths();
});