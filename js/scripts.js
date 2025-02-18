/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project





//Töltőképernyő script
document.addEventListener("window.onload", function() {
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("content").style.display = "block";
    }, 700); 
});
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        // Töltőképernyő elhalványítása
        document.getElementById("loading-screen").classList.add("hidden");
        
        // Tartalom beúsztatása
        document.getElementById("content").classList.add("show");
    },700); // 2 másodperces várakozás után
});

document.addEventListener("DOMContentLoaded", async function () {
    const API_URL = "http://localhost:5005/cars"; // API végpont 
    let cars = []; // Az összes autó tárolása

    // HTML elemek lekérése
    const brandSelect = document.getElementById("brandSelect");
    const modelSelect = document.getElementById("modelSelect");
    const yearFrom = document.getElementById("yearFrom");
    const yearTo = document.getElementById("yearTo");
    const fuelTypeFilter = document.getElementById("fuelTypeFilter");
    const searchForm = document.getElementById("searchForm");
    const resultsContainer = document.getElementById("resultsContainer");

    // 🔹 ADATOK LEKÉRÉSE AZ API-BÓL
    async function fetchCars() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Nem sikerült az adatok lekérése.");

            cars = await response.json(); // JSON konvertálás
            populateBrands(); // Márkák feltöltése a legördülő listába
        } catch (error) {
            console.error("Hiba:", error);
            resultsContainer.innerHTML = "<p class='text-danger text-center'>Hiba történt az adatok betöltése közben.</p>";
        }
    }

    // 🔹 MÁRKÁK LISTÁJÁNAK FELTÖLTÉSE
    function populateBrands() {
        const brands = [...new Set(cars.map(car => car.brand))]; // Egyedi márkák
        brandSelect.innerHTML = '<option value="">Válassz márkát</option>';

        brands.forEach(brand => {
            const option = document.createElement("option");
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    }

    // 🔹 MODELL LISTA DINAMIKUS BETÖLTÉSE MÁRKA ALAPJÁN
    brandSelect.addEventListener("change", function () {
        modelSelect.innerHTML = '<option value="">Előbb válassz egy márkát</option>';
        const selectedBrand = brandSelect.value;
        const models = [...new Set(cars.filter(car => car.brand === selectedBrand).map(car => car.model))];

        models.forEach(model => {
            const option = document.createElement("option");
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });
        modelSelect.disabled = models.length === 0;
    });

    // 🔹 AUTÓK SZŰRÉSE A MEGADOTT FELTÉTELEK ALAPJÁN
    function filterCars() {
        const brand = brandSelect.value;
        const model = modelSelect.value;
        const fromYear = parseInt(yearFrom.value) || 0;
        const toYear = parseInt(yearTo.value) || 9999;
        const fuel = fuelTypeFilter.value;

        return cars.filter(car =>
            (!brand || car.brand === brand) &&
            (!model || car.model === model) &&
            (car.year >= fromYear && car.year <= toYear) &&
            (!fuel || car.fuel === fuel)
        );
    }

    // 🔹 KERESÉS INDÍTÁSA ÉS EREDMÉNYEK MEGJELENÍTÉSE
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        resultsContainer.innerHTML = "";
        const results = filterCars();

        if (results.length === 0) {
            resultsContainer.innerHTML = "<p class='text-center text-danger'>Nincs találat</p>";
        } else {
            results.forEach((car, index) => {
                const uniqueId = `carousel-${index}`;

                const card = document.createElement("div");
                card.classList.add("col-md-4", "mb-3");
                card.innerHTML = `
                    <div class="clickable-box bg-white p-4 text-center rounded border d-block car-card">
                        <div id="${uniqueId}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                            <div class="carousel-inner">
                                ${car.images.map((img, imgIndex) => `
                                    <div class="carousel-item ${imgIndex === 0 ? 'active' : ''}">
                                        <img src="${img}" class="d-block w-100 rounded" alt="Car image">
                                    </div>
                                `).join('')}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#${uniqueId}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#${uniqueId}" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            </button>
                        </div>

                        <div class="card-body">
                            <h5 class="card-title">${car.brand} ${car.model}</h5>
                            <p class="card-text">Évjárat: ${car.year}</p>
                            <p class="card-text">Üzemanyag: ${car.fuel}</p>
                        </div>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        }
    });

    // 🔹 API LEKÉRÉSE AZ OLDAL BETÖLTÉSEKOR
    fetchCars();

    // 🔹 ÉVJÁRATOK LISTÁJÁNAK GENERÁLÁSA (2000 - aktuális év)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2000; year--) {
        const optionFrom = document.createElement("option");
        optionFrom.value = year;
        optionFrom.textContent = year;
        yearFrom.appendChild(optionFrom);

        const optionTo = document.createElement("option");
        optionTo.value = year;
        optionTo.textContent = year;
        yearTo.appendChild(optionTo);
    }
});
