// circlan_v2/js/calendar.js

document.addEventListener('DOMContentLoaded', () => {
    const days = document.querySelectorAll('.calendar-day:not(.text-gray-200)');
    const panelTitle = document.getElementById('panel-title');
    const eventBadge = document.getElementById('event-badge');
    const cardEvent = document.getElementById('card-event');
    const cardEmpty = document.getElementById('card-empty');
    const emptyText = document.getElementById('empty-text');
    const btnCreateEmpty = document.getElementById('btn-create-empty');
    
    const tabSaved = document.getElementById('tab-saved');
    const tabMine = document.getElementById('tab-mine');

    let currentTab = 'saved';
    let selectedDate = '24';

    const updateView = () => {
        if (!panelTitle) return;
        panelTitle.innerText = `${currentTab === 'saved' ? 'Saved' : 'My Events'} for ${selectedDate} Mei`;
        
        const btnEdit = document.getElementById('btn-edit');
        const btnSaveToggle = document.getElementById('btn-save-toggle');
        
        let hasEvent = false;
        if (currentTab === 'saved' && (selectedDate === '24' || selectedDate === '12')) {
            hasEvent = true;
            document.getElementById('card-footer').classList.remove('hidden');
            if (btnSaveToggle) btnSaveToggle.innerHTML = '<i class="fa-solid fa-bookmark text-lg"></i>';
            if (btnEdit) btnEdit.classList.add('hidden'); // Hide edit on saved tab
            
            if(selectedDate === '12') {
                document.getElementById('card-title').innerText = "Photography Workshop";
                document.getElementById('card-loc').innerHTML = '<i class="fa-solid fa-location-dot mr-1.5 text-[10px]"></i> Kota Tua, Jakarta';
                document.getElementById('card-icon').className = "fa-solid fa-camera text-lg";
            } else {
                document.getElementById('card-title').innerText = "Family Reunion 2026";
                document.getElementById('card-loc').innerHTML = '<i class="fa-solid fa-location-dot mr-1.5 text-[10px]"></i> Grand Ballroom, Jakarta';
                document.getElementById('card-icon').className = "fa-solid fa-users text-lg";
            }
        } else if (currentTab === 'mine' && selectedDate === '5') {
            hasEvent = true;
            document.getElementById('card-title').innerText = "Monthly Family Dinner";
            document.getElementById('card-loc').innerHTML = '<i class="fa-solid fa-location-dot mr-1.5 text-[10px]"></i> Home';
            document.getElementById('card-icon').className = "fa-solid fa-utensils text-lg";
            document.getElementById('card-footer').classList.add('hidden');
            
            if (btnSaveToggle) btnSaveToggle.innerHTML = '<i class="fa-solid fa-trash-can text-lg text-red-400"></i>';
            if (btnEdit) btnEdit.classList.remove('hidden'); // Show edit on my events tab
        }

        if (hasEvent) {
            cardEvent.classList.remove('hidden');
            cardEmpty.classList.add('hidden');
            eventBadge.innerText = '1 Event';
            eventBadge.style.display = 'inline-block';
        } else {
            cardEvent.classList.add('hidden');
            cardEmpty.classList.remove('hidden');
            eventBadge.style.display = 'none';

            if (currentTab === 'saved') {
                emptyText.innerText = "You haven't saved any events for this date.";
                btnCreateEmpty.classList.add('hidden');
            } else {
                emptyText.innerText = "You haven't created any events for this date.";
                btnCreateEmpty.classList.remove('hidden');
            }
        }
    };

    days.forEach(day => {
        day.addEventListener('click', () => {
            days.forEach(d => d.classList.remove('active'));
            day.classList.add('active');
            selectedDate = day.innerText;
            updateView();
        });
    });

    if (tabSaved) {
        tabSaved.addEventListener('click', () => {
            currentTab = 'saved';
            tabSaved.className = "flex-1 py-2 text-[11px] font-bold rounded-xl transition-all bg-primary text-white shadow-md";
            tabMine.className = "flex-1 py-2 text-[11px] font-bold rounded-xl transition-all text-muted hover:text-dark";
            updateView();
        });
    }

    if (tabMine) {
        tabMine.addEventListener('click', () => {
            currentTab = 'mine';
            tabMine.className = "flex-1 py-2 text-[11px] font-bold rounded-xl transition-all bg-primary text-white shadow-md";
            tabSaved.className = "flex-1 py-2 text-[11px] font-bold rounded-xl transition-all text-muted hover:text-dark";
            updateView();
        });
    }

    updateView();
});
