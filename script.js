/* =========================================
   SUPABASE CONNECTION
========================================= */

const SUPABASE_URL = "YOUR_PROJECT_URL";

const SUPABASE_PUBLISHABLE_KEY = "YOUR_PUBLISHABLE_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

/* =========================================
   STAYSYNC
   HOTEL ROOM BOOKING SYSTEM
   JAVASCRIPT
========================================= */


/* =========================================
   GLOBAL VARIABLES
========================================= */

let selectedRoom = null;

let selectedRoomPrice = 0;

let bookingDetails = {
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guests: 2
};


/* =========================================
   DOM ELEMENTS
========================================= */

const roomType =
    document.getElementById("room-type");

const priceFilter =
    document.getElementById("price-filter");

const roomCards =
    document.querySelectorAll(".room-card");

const availableCount =
    document.getElementById("available-count");

const noResults =
    document.getElementById("no-results");

const bookingModal =
    document.getElementById("booking-modal");

const selectedRoomElement =
    document.getElementById("selected-room");

const checkIn =
    document.getElementById("check-in");

const checkOut =
    document.getElementById("check-out");

const guests =
    document.getElementById("guests");

const guestName =
    document.getElementById("guest-name");

const guestEmail =
    document.getElementById("guest-email");


/* =========================================
   SET MINIMUM DATE
========================================= */

function setMinimumDates() {

    const today =
        new Date().toISOString().split("T")[0];

    checkIn.min = today;

    checkOut.min = today;
}

setMinimumDates();


/* =========================================
   CHECK-IN DATE CHANGE
========================================= */

checkIn.addEventListener(
    "change",
    function() {

        checkOut.min =
            checkIn.value;

        if (
            checkOut.value &&
            checkOut.value <= checkIn.value
        ) {

            checkOut.value = "";

        }

    }
);


/* =========================================
   ROOM FILTERING
========================================= */

function filterRooms() {

    const selectedType =
        roomType.value;

    const selectedPrice =
        priceFilter.value;

    let visibleRooms = 0;


    roomCards.forEach(function(card) {

        const cardType =
            card.getAttribute("data-type");

        const cardPrice =
            Number(
                card.getAttribute("data-price")
            );


        const typeMatch =
            selectedType === "all" ||
            selectedType === cardType;


        const priceMatch =
            selectedPrice === "all" ||
            cardPrice <= Number(selectedPrice);


        if (typeMatch && priceMatch) {

            card.style.display = "block";

            visibleRooms++;

        } else {

            card.style.display = "none";

        }

    });


    availableCount.textContent =
        visibleRooms;


    if (visibleRooms === 0) {

        noResults.style.display =
            "block";

    } else {

        noResults.style.display =
            "none";

    }

}


/* =========================================
   FILTER EVENTS
========================================= */

roomType.addEventListener(
    "change",
    filterRooms
);

priceFilter.addEventListener(
    "change",
    filterRooms
);


/* =========================================
   SEARCH ROOMS
========================================= */

function searchRooms() {

    const start =
        checkIn.value;

    const end =
        checkOut.value;


    if (!start || !end) {

        alert(
            "Please select both check-in and check-out dates."
        );

        document
            .getElementById("rooms")
            .scrollIntoView({
                behavior: "smooth"
            });

        return;

    }


    if (end <= start) {

        alert(
            "Check-out date must be after the check-in date."
        );

        return;

    }


    const guestNumber =
        Number(guests.value);


    bookingDetails.checkIn =
        start;

    bookingDetails.checkOut =
        end;

    bookingDetails.guests =
        guestNumber;


    document
        .getElementById("rooms")
        .scrollIntoView({
            behavior: "smooth"
        });


    showSearchMessage();

}


/* =========================================
   SEARCH MESSAGE
========================================= */

function showSearchMessage() {

    const oldMessage =
        document.querySelector(
            ".search-success"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    const message =
        document.createElement("div");


    message.className =
        "search-success";


    message.textContent =
        "Showing rooms for your selected dates.";


    const roomsSection =
        document.querySelector(
            ".rooms-section"
        );


    roomsSection.prepend(message);


    setTimeout(function() {

        message.remove();

    }, 3500);

}


/* =========================================
   RESERVE ROOM
========================================= */

function reserveRoom(
    roomName,
    roomPrice
) {

    if (!checkIn.value || !checkOut.value) {

        alert(
            "Please select your check-in and check-out dates first."
        );

        document
            .querySelector(".search-card")
            .scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        return;

    }


    if (
        checkOut.value <=
        checkIn.value
    ) {

        alert(
            "Please choose a valid check-out date."
        );

        return;

    }


    selectedRoom =
        roomName;

    selectedRoomPrice =
        Number(roomPrice);


    selectedRoomElement.innerHTML = `

        <strong>
            ${roomName}
        </strong>

        <br><br>

        <span>
            Rs. ${roomPrice.toLocaleString()}
            / night
        </span>

        <br>

        <span>
            ${formatDate(checkIn.value)}
            → 
            ${formatDate(checkOut.value)}
        </span>

    `;


    bookingModal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-PK",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   OPEN BOOKING PANEL
========================================= */

function openBookingPanel() {

    if (!selectedRoom) {

        alert(
            "You haven't selected a room yet. Explore our rooms and choose one first."
        );

        document
            .getElementById("rooms")
            .scrollIntoView({
                behavior: "smooth"
            });

        return;

    }


    bookingModal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE BOOKING PANEL
========================================= */

function closeBookingPanel() {

    bookingModal.classList.remove("show");

    document.body.style.overflow =
        "";

}


/* =========================================
   CLOSE MODAL OUTSIDE PANEL
========================================= */

bookingModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === bookingModal
        ) {

            closeBookingPanel();

        }

    }
);


/* =========================================
   CONFIRM BOOKING
========================================= */

function confirmBooking() {

    const name =
        guestName.value.trim();

    const email =
        guestEmail.value.trim();


    if (!selectedRoom) {

        alert(
            "Please select a room first."
        );

        return;

    }


    if (!name) {

        alert(
            "Please enter your full name."
        );

        guestName.focus();

        return;

    }


    if (!email) {

        alert(
            "Please enter your email address."
        );

        guestEmail.focus();

        return;

    }


    if (!isValidEmail(email)) {

        alert(
            "Please enter a valid email address."
        );

        guestEmail.focus();

        return;

    }


    bookingDetails.name =
        name;

    bookingDetails.email =
        email;


    showConfirmation();


    saveLocalBooking();


}


/* =========================================
   EMAIL VALIDATION
========================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================
   SHOW CONFIRMATION
========================================= */

function showConfirmation() {

    const number =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    selectedRoomElement.innerHTML = `

        <div class="booking-success">

            <div class="success-icon">
                ✓
            </div>

            <h3>
                Reservation Confirmed
            </h3>

            <p>
                Thank you, ${bookingDetails.name}.
            </p>

            <p>
                Your room at StaySync has been
                reserved successfully.
            </p>

            <div class="confirmation-details">

                <strong>
                    Booking #SS${number}
                </strong>

                <span>
                    ${selectedRoom}
                </span>

                <span>
                    ${formatDate(
                        bookingDetails.checkIn
                    )}
                    →
                    ${formatDate(
                        bookingDetails.checkOut
                    )}
                </span>

            </div>

        </div>

    `;


    guestName.value = "";

    guestEmail.value = "";


    setTimeout(function() {

        closeBookingPanel();

    }, 5000);

}


/* =========================================
   SAVE BOOKING LOCALLY
========================================= */

function saveLocalBooking() {

    const booking = {

        room: selectedRoom,

        price: selectedRoomPrice,

        name: bookingDetails.name,

        email: bookingDetails.email,

        checkIn: bookingDetails.checkIn,

        checkOut: bookingDetails.checkOut,

        guests: bookingDetails.guests,

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "staySyncBooking",
        JSON.stringify(booking)
    );

}


/* =========================================
   LOAD PREVIOUS BOOKING
========================================= */

function loadPreviousBooking() {

    const savedBooking =
        localStorage.getItem(
            "staySyncBooking"
        );


    if (!savedBooking) {

        return;

    }


    try {

        const booking =
            JSON.parse(savedBooking);


        selectedRoom =
            booking.room;

        selectedRoomPrice =
            booking.price;

        bookingDetails =
            booking;


    } catch (error) {

        localStorage.removeItem(
            "staySyncBooking"
        );

    }

}

loadPreviousBooking();


/* =========================================
   ESC KEY CLOSE
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            bookingModal.classList.contains(
                "show"
            )
        ) {

            closeBookingPanel();

        }

    }
);


/* =========================================
   SCROLL ANIMATION
========================================= */

const animatedElements =
    document.querySelectorAll(
        ".room-card, .feature-card, .intro-section, .section-heading"
    );


const observer =
    new IntersectionObserver(
        function(entries) {

            entries.forEach(
                function(entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


animatedElements.forEach(
    function(element) {

        observer.observe(element);

    }
);


/* =========================================
   INITIAL FILTER
========================================= */

filterRooms();


/* =========================================
   CONSOLE MESSAGE
========================================= */

console.log(
    "StaySync initialized successfully."
);
