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

//Autó keresés
document.addEventListener("DOMContentLoaded", function () {
    const cars = [
        { brand: "Toyota", model: "Corolla", year: 2020, fuel: "benzin", images: ["https://placehold.co/600x400", "https://placehold.co/600x400"] },
        { brand: "Toyota", model: "Yaris", year: 2021, fuel: "hibrid", images: ["https://placehold.co/600x400", "https://placehold.co/600x400"] },
        { brand: "BMW", model: "3 Series", year: 2019, fuel: "dízel", images: ["https://placehold.co/600x400", "https://placehold.co/600x400"] },
        { brand: "Mercedes", model: "C Class", year: 2022, fuel: "benzin", images: ["https://placehold.co/600x400", "https://placehold.co/600x400"] }
    ];

    const brandSelect = document.getElementById("brandSelect");
    const modelSelect = document.getElementById("modelSelect");
    const yearFrom = document.getElementById("yearFrom");
    const yearTo = document.getElementById("yearTo");
    const fuelTypeFilter = document.getElementById("fuelTypeFilter");
    const searchForm = document.getElementById("searchForm");
    const resultsContainer = document.getElementById("resultsContainer");
    const modal = new bootstrap.Modal(document.getElementById("carModal"));
    const modalContent = document.getElementById("modalContent");

    brandSelect.addEventListener("change", function () {
        modelSelect.innerHTML = '<option value="" selected>Előbb válassz egy márkát</option>';
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

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        resultsContainer.innerHTML = "";
        const results = filterCars();
    
        if (results.length === 0) {
            resultsContainer.innerHTML = "<p class='text-center text-danger'>Nincs találat</p>";
        } else {
            results.forEach((car, index) => {
                const uniqueId = `carousel-${index}`; // Egyedi azonosító generálása minden autóhoz
    
                const card = document.createElement("div");
                card.classList.add("col-md-4", "mb-3");
                card.innerHTML = `
                    <div class="clickable-box bg-white p-4 text-center rounded border d-block car-card" 
                        data-brand="${car.brand}" 
                        data-model="${car.model}" 
                        data-year="${car.year}" 
                        data-fuel="${car.fuel}" 
                        data-images='${JSON.stringify(car.images)}'>
    
                        <!-- Egyedi carousel minden autóhoz -->
                        <div id="${uniqueId}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                            <div class="carousel-inner">
                                ${car.images.map((img, imgIndex) => `
                                    <div class="carousel-item ${imgIndex === 0 ? 'active' : ''}">
                                        <img src="${img}" class="d-block w-100 rounded" alt="Car image">
                                    </div>
                                `).join('')}
                            </div>
                            <button class="carousel-control-prev carousel-btn" type="button" data-bs-target="#${uniqueId}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Előző</span>
                            </button>
                            <button class="carousel-control-next carousel-btn" type="button" data-bs-target="#${uniqueId}" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Következő</span>
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

    document.addEventListener("click", function (event) {
        
        if (event.target.closest(".carousel-btn")) {
            event.stopPropagation();
            return;
        }
    
        // Ha egy autókártyára kattintottunk, akkor jelenjen meg a nagy nézet
        if (event.target.closest(".car-card")) {
            const card = event.target.closest(".car-card");
            const images = JSON.parse(card.dataset.images);
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h5 class="modal-title">${card.dataset.brand} ${card.dataset.model}</h5>
                </div>
                <div class="modal-body">
                    <div id="carouselModal" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${images.map((img, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img class="d-block w-100" src="${img}" alt="Car image">
                                </div>
                            `).join('')}
                        </div>
                        <a class="carousel-control-prev" href="#carouselModal" role="button" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselModal" role="button" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </a>
                    </div>
                    <p><strong>Évjárat:</strong> ${card.dataset.year}</p>
                    <p><strong>Üzemanyag:</strong> ${card.dataset.fuel}</p>
                </div>
            `;
            modal.show();
        }
    });
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
