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
    const brandSelect = document.getElementById("manufacturer");
    const modelSelect = document.getElementById("model");
    const fuelTypeSelect = document.getElementById("fuelType");
    const filterButton = document.getElementById("filterButton");
    const carList = document.getElementById("carList");

    // Adatok betöltése az API-ból
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Hálózati hiba!");
            }
            return await response.json();
        } catch (error) {
            console.error("Hiba:", error);
        }
    }

    // Márkák betöltése
    async function loadManufacturers() {
        const manufacturers = await fetchData("http://localhost:5005/manufacturers");
        brandSelect.innerHTML = `<option value="">-- Válassz márkát --</option>`;
        manufacturers.forEach(m => {
            brandSelect.innerHTML += `<option value="${m.Id}">${m.Name}</option>`;
        });
    }

    // Modellek betöltése a kiválasztott márka alapján
    async function loadModels(manufacturerId) {
        const models = await fetchData(`http://localhost:5005/models?manufacturerId=${manufacturerId}`);
        modelSelect.innerHTML = `<option value="">-- Válassz modellt --</option>`;
        models.forEach(m => {
            modelSelect.innerHTML += `<option value="${m.Id}">${m.Name}</option>`;
        });
    }

    // Üzemanyagtípusok betöltése
    async function loadFuelTypes() {
        const fuelTypes = await fetchData("http://localhost:5005/fueltypes");
        fuelTypeSelect.innerHTML = `<option value="">-- Válassz üzemanyagot --</option>`;
        fuelTypes.forEach(f => {
            fuelTypeSelect.innerHTML += `<option value="${f.Id}">${f.Name}</option>`;
        });
    }

    // Autók szűrése a kiválasztott paraméterek alapján
    async function filterCars() {
        const manufacturerId = brandSelect.value;
        const modelId = modelSelect.value;
        const fuelTypeId = fuelTypeSelect.value;

        const url = `http://localhost:5005/cars?manufacturerId=${manufacturerId}&modelId=${modelId}&fuelTypeId=${fuelTypeId}`;
        const cars = await fetchData(url);

        carList.innerHTML = ""; // Előző lista törlése
        if (cars.length === 0) {
            carList.innerHTML = "<p>Nincs találat.</p>";
            return;
        }

        cars.forEach(car => {
            carList.innerHTML += `
                <div class="car-item">
                    <h3>${car.Manufacturer} ${car.ModelName}</h3>
                    <p>Üzemanyag: ${car.FuelType}</p>
                    <p>KM: ${car.Km} km</p>
                    <p>Ár: ${car.PricePerKm} Ft/km</p>
                </div>
            `;
        });
    }

    // Eseményfigyelők
    brandSelect.addEventListener("change", () => {
        if (brandSelect.value) {
            loadModels(brandSelect.value);
        } else {
            modelSelect.innerHTML = `<option value="">-- Válassz modellt --</option>`;
        }
    });

    filterButton.addEventListener("click", filterCars);

    // Kezdeti adatok betöltése
    await loadManufacturers();
    await loadFuelTypes();



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
