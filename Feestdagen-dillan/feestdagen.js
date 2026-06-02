/**
 * Ophalen van Nederlandse feestdagen via Nager.Date API
 * Ontwikkeld voor het Urenregistratie Dashboard
 */

document.addEventListener("DOMContentLoaded", () => {
    getUpcomingHolidays();
});

function getUpcomingHolidays() {
    const currentYear = new Date().getFullYear();
    const countryCode = "NL";
    const apiUrl = `https://date.nager.at/api/v3/PublicHolidays/${currentYear}/${countryCode}`;
    const lijstElement = document.getElementById("feestdagen-lijst");

    // Haal de data op met de Fetch API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netwerkrespons was niet ok');
            }
            return response.json();
        })
        .then(holidays => {
            // Maak de placeholder tekst leeg
            lijstElement.innerHTML = "";

            const today = new Date();
            // Zet de tijd van vandaag op 00:00:00 voor een zuivere datumvergelijking
            today.setHours(0, 0, 0, 0);

            // Filter feestdagen die vandaag of in de toekomst plaatsvinden
            const upcomingHolidays = holidays.filter(holiday => {
                const holidayDate = new Date(holiday.date);
                return holidayDate >= today;
            });

            // Toon de eerste 3 eerstvolgende feestdagen op het dashboard
            const nextHolidays = upcomingHolidays.slice(0, 3);

            if (nextHolidays.length === 0) {
                lijstElement.innerHTML = "<li>Geen feestdagen meer gepland voor dit jaar.</li>";
                return;
            }

            // Genereer de HTML-items
            nextHolidays.forEach(holiday => {
                // Formatteer de datum naar Nederlands leesbaar formaat (bijv. 25-12-2026)
                const dateObj = new Date(holiday.date);
                const formattedDate = dateObj.toLocaleDateString('nl-NL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                const li = document.createElement("li");
                li.className = "holiday-item";
                li.innerHTML = `
                    <span class="holiday-name">${holiday.localName}</span>
                    <span class="holiday-date">${formattedDate}</span>
                `;
                lijstElement.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Fout bij het ophalen van de feestdagen:', error);
            lijstElement.innerHTML = `<li class="error-msg">Kon feestdagen niet laden.</li>`;
        });
}