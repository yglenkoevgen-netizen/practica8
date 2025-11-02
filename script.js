document.addEventListener('DOMContentLoaded', () => {

    const activityGrid = document.querySelector('.activity-grid');
    const toggleButtons = document.querySelectorAll('.timeframe-button');

    let currentTimeframe = 'weekly'; 

    async function fetchData() {
        try {
            const response = await fetch('data.json'); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            renderCards(data, currentTimeframe);
            setupToggleButtons(data);

        } catch (error) {
            console.error('Не вдалося завантажити дані активності:', error);
            activityGrid.innerHTML = `<p class="error-message">Не вдалося завантажити дані. Будь ласка, спробуйте оновити сторінку.</p>`;
        }
    }

    function renderCards(data, timeframe) {
        activityGrid.innerHTML = '';

        const previousTextMap = {
            daily: 'Yesterday',
            weekly: 'Last Week',
        };

        data.forEach(activity => {
            const { title, timeframes } = activity;
            
            const timeframeData = timeframes[timeframe];
            const currentHours = timeframeData.current;
            const previousHours = timeframeData.previous;
            
            const cardClass = title.toLowerCase().replace(' ', '-');

            const cardElement = document.createElement('div');
            cardElement.classList.add('activity-card', cardClass);
            
            cardElement.setAttribute('aria-label', `${title} activity tracking`);

            cardElement.innerHTML = `
                <div class="card-content" tabindex="0"> <div class="card-header">
                        <h2>${title}</h2>
                        <button class="menu-dots" aria-label="Меню для ${title}">...</button>
                    </div>
                    <div class="card-details">
                        <p class="current-time">${currentHours}hr${currentHours !== 1 ? 's' : ''}</p>
                        <p class="previous-time">${previousTextMap[timeframe]} - ${previousHours}hr${previousHours !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            `;
            
            activityGrid.appendChild(cardElement);
        });
    }

    function setupToggleButtons(data) {
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const newTimeframe = button.dataset.timeframe;

                if (newTimeframe === currentTimeframe) {
                    return;
                }

                currentTimeframe = newTimeframe;

                toggleButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                renderCards(data, currentTimeframe);
            });
        });
    }

    fetchData();

});