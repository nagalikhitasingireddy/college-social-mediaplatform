let events = JSON.parse(localStorage.getItem("events")) || [];
        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();

        // Sort events by date
        function sortEvents() {
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        // Update countdown for the next event
        function updateCountdown() {
            let countdownElement = document.getElementById("countdown");
            let now = new Date();
            let upcomingEvents = events
                .map(event => ({ name: event.name, date: new Date(event.date) }))
                .filter(event => event.date > now);

            if (upcomingEvents.length === 0) {
                countdownElement.innerText = "No upcoming events.";
                return;
            }

            let nextEvent = upcomingEvents[0];
            let timeDiff = nextEvent.date - now;

            function updateTime() {
                timeDiff -= 1000;
                if (timeDiff <= 0) {
                    countdownElement.innerText = "Event is happening now!";
                    setTimeout(updateCountdown, 1000); // Check for the next event
                    return;
                }
                let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                countdownElement.innerHTML = `Next Event: <strong>${nextEvent.name}</strong> in <strong>${days}d ${hours}h ${minutes}m ${seconds}s</strong>`;
            }

            updateTime();
            setInterval(updateTime, 1000);
        }

        // Load calendar
        function loadCalendar() {
            let calendar = document.getElementById("calendar");
            let currentMonthYear = document.getElementById("currentMonthYear");
            let firstDay = new Date(currentYear, currentMonth, 1).getDay();
            let totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            currentMonthYear.innerText = `${monthNames[currentMonth]} ${currentYear}`;
            calendar.innerHTML = "";

            // Add empty days for the first week
            for (let i = 0; i < firstDay; i++) {
                let emptyDiv = document.createElement("div");
                emptyDiv.classList.add("day");
                emptyDiv.style.background = "transparent";
                calendar.appendChild(emptyDiv);
            }

            // Add days of the month
            for (let i = 1; i <= totalDays; i++) {
                let dayDiv = document.createElement("div");
                dayDiv.classList.add("day");
                dayDiv.innerText = i;
                let dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                let eventExists = events.some(event => event.date === dateString);
                if (eventExists) {
                    dayDiv.classList.add("event-day");
                }
                calendar.appendChild(dayDiv);
            }
        }

        // Change month
        function changeMonth(direction) {
            currentMonth += direction;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            } else if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            loadCalendar();
        }

        // Toggle event form
        function toggleEventForm() {
            let form = document.getElementById("eventForm");
            form.style.display = form.style.display === "none" ? "block" : "none";
        }

        // Add event
        function addEvent() {
            let name = document.getElementById("eventName").value;
            let date = document.getElementById("eventDate").value;
            if (name.trim() === "" || date === "") {
                alert("Please enter valid event details!");
                return;
            }
            events.push({ name, date, reminder: false });
            sortEvents();
            localStorage.setItem("events", JSON.stringify(events));
            loadCalendar();
            updateCountdown();
            updateReminderIcon();
            document.getElementById("eventName").value = "";
            document.getElementById("eventDate").value = "";
            toggleEventForm();
        }

        // Update reminder icon visibility
        function updateReminderIcon() {
            let reminderIcon = document.getElementById("reminderIcon");
            let hasReminders = events.some(event => event.reminder);
            reminderIcon.style.display = hasReminders ? "block" : "none";
        }

        // Toggle reminder box
        function toggleReminderBox() {
            let reminderBox = document.getElementById("reminderBox");
            let reminderList = document.getElementById("reminderList");
            let reminders = events.filter(event => event.reminder);

            if (reminders.length === 0) {
                reminderList.innerHTML = "<p>No reminders set.</p>";
            } else {
                reminderList.innerHTML = reminders.map(event => `
                    <div class="reminder-item">
                        <strong>${event.name}</strong> - ${event.date}
                    </div>
                `).join("");
            }

            reminderBox.style.display = reminderBox.style.display === "none" ? "block" : "none";
        }

        // Social Sharing Functions
        function shareOnWhatsApp() {
            const eventName = document.getElementById("eventName").value || "Upcoming Event";
            const eventDate = document.getElementById("eventDate").value || new Date().toISOString().split('T')[0];
            const now = new Date();
            const eventTime = new Date(eventDate);
            const timeDiff = eventTime - now;

            // Calculate time left
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            // Mesmerizing invitation message
            const invitationMessage = 
                `*You're heartfully Invited!* 🎉\n\n` +
        `Join us for *${eventName}* at *Rajiv Gandhi University of Knowledge and Technology (Nuzvid)*!\n\n` +
        `⏰ *Time Left:* ${days}d ${hours}h ${minutes}m ${seconds}s\n\n` +
        `*Highlights of the Event💫️:*\n` +
        `- Exciting sessions💥️\n` +
        `- Fun activities😁️ and more!\n\n` +
        `📍 *Location:* RGUKT Nuzvid Campus🤩️\n` +
        `📅 *Date:* 😎️${eventDate}\n\n` +
        `Don't miss out on this incredible🤠️ event! 🚀\n\n`;

            // Encode the message for URL
            const encodedMessage = encodeURIComponent(invitationMessage);
            const whatsappURL = `https://web.whatsapp.com/send?text=${encodedMessage}`;

            // Open WhatsApp Web with the pre-filled message
            window.open(whatsappURL, '_blank');
        }

        function shareOnFacebook() {
            const eventName = document.getElementById("eventName").value || "Upcoming Event";
            const eventDate = document.getElementById("eventDate").value || new Date().toISOString().split('T')[0];
            const now = new Date();
            const eventTime = new Date(eventDate);
            const timeDiff = eventTime - now;

            // Calculate time left
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            // Mesmerizing invitation message
            const invitationMessage = 
                ` *You're heartfully Invited!* 🎉\n\n` +
        `Join us for *${eventName}* at *Rajiv Gandhi University of Knowledge and Technology 💫️(Nuzvid)*!\n\n` +
        `⏰ *Time Left:* ${days}d ${hours}h ${minutes}m ${seconds}s\n\n` +
        `🌟 *Highlights:*\n` +
        `- Exciting sessions🤠️\n` +
        `- Networking opportunities\n` +
        `- Fun activities🙃️ and more!\n\n` +
        `📍 *Location:* RGUKT Nuzvid Campus😃️\n` +
        `📅 *Date:*🤩️ ${eventDate}\n\n` +
        `Don't miss out on this incredible😃️ event! 🚀\n\n`;

            // Encode the message for URL
            const encodedMessage = encodeURIComponent(invitationMessage);
            const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedMessage}`;

            // Open Facebook sharing dialog
            window.open(facebookURL, '_blank');
        }

        
        // Initialize
        document.addEventListener("DOMContentLoaded", () => {
            sortEvents();
            loadCalendar();
            updateCountdown();
            updateReminderIcon();
        });