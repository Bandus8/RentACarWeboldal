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


document.addEventListener("DOMContentLoaded", async () => {
    const manufacturerSelect = document.getElementById("brandSelect");
    const modelSelect = document.getElementById("modelSelect");
    const fuelTypeSelect = document.getElementById("fuelTypeFilter");
    const carList = document.getElementById("resultsContainer");
    const searchForm = document.getElementById("searchForm");
    const modalContent = document.getElementById("modalContent");
    const modalElement = document.getElementById("carModal");
    modalElement.removeAttribute("aria-hidden"); 
    modalElement.setAttribute("inert", "false"); 
    const page = window.location.pathname.split("/").pop(); 
    const filterButton = document.getElementById("filterButton");
    const yearFromSelect = document.getElementById("yearFrom");
    const yearToSelect = document.getElementById("yearTo");

    let cars = [];
    let manufacturers = [];
    let models = [];
    let fuelTypes = [];
    let categories = [];
    let images = [];
    let minYear = 0;
    let maxYear = 0;
    

    async function fetchData() {
        try {
            const [carsRes, manufacturersRes, modelsRes, fuelTypeRes, categoryRes, imagesRes] = await Promise.all([
                fetch("http://localhost:5005/cars"),
                fetch("http://localhost:5005/manufacturers"),
                fetch("http://localhost:5005/models"),
                fetch("http://localhost:5005/fuel_types"), 
                fetch("http://localhost:5005/categories"),
                fetch("http://localhost:5005/images")
            ]);

            cars = await carsRes.json();
            manufacturers = await manufacturersRes.json();
            models = await modelsRes.json();
            fuelTypes = await fuelTypeRes.json();
            categories = await categoryRes.json();
            images = await imagesRes.json();

            console.log("Autók:", cars);
            console.log("Márkák:", manufacturers);
            console.log("Modellek:", models);
            console.log("Üzemanyag típusok:", fuelTypes);
            console.log("Kategóriák:", categories );

            cars.forEach(car => {
                const model = models.find(m => m.id === car.modelId);
                car.ModelName = model ? model.name : "Ismeretlen";

                const manufacturer = model ? manufacturers.find(m => m.id === model.manufacturerId) : null;
                car.ManufacturerName = manufacturer ? manufacturer.name : "Ismeretlen";

                const fuelType = fuelTypes.find(f => f.id === car.fuelTypeId);
                car.FuelTypeName = fuelType ? fuelType.name : "Ismeretlen";
                
                const category = categories.find(c => c.id === car.categoryId);
                car.categoryName = category ? category.name : "Ismeretlen";

                const description = cars.find(d => d.description === car.description);
                const horsePower = cars.find(h => h.horsePower === car.horsePower);
                const pricePerKm = cars.find(p => p.pricePerKm === car.pricePerKm);
                
                const years = cars.map(car => car.year);
                minYear = Math.min(...years);
                maxYear = Math.max(...years);
                

            });
            
            
            populateSelect(manufacturerSelect, manufacturers);
            populateSelect(fuelTypeSelect, fuelTypes);
            updateModelSelect();
            if (page === "hetkoznapi.html") selectedCategory = 1;
            else if (page === "luxus.html") selectedCategory = 2;
            else if (page === "sport.html") selectedCategory = 3;
            

            console.log("Kategória", selectedCategory);
            
        } catch (error) {
            console.error("Hiba a fetch közben: ", error);
        }
        updateFilterButton(cars);
        function updateFilterButton(cars) {
            const filterButton = document.getElementById("filterButton");
            hossz = 0;
            
            for (let index = 0; index < cars.length; index++) {
                const element = cars[index];
                if (cars[index].categoryId == selectedCategory) {
                    hossz++;
                }
            }
            
            filterButton.innerText = `Szűrés ${hossz} autó közül`;
            
        }
        populateYearSelect(minYear, maxYear);
    }
    manufacturerSelect.addEventListener("change", (event) => {
        const selectedManufacturer = event.target.value;
        
        console.log("Kiválasztott márka ID:", selectedManufacturer);
        
        const filteredModels = models.filter(model => 
            !selectedManufacturer || model.manufacturerId == selectedManufacturer
        );
    
        console.log("Frissített modellek:", filteredModels);
    
        populateSelect(modelSelect, filteredModels);
    });
    
    
    function populateYearSelect(minYear, maxYear) {
        yearFromSelect.innerHTML = `<option value="">Összes</option>`;
        yearToSelect.innerHTML = `<option value="">Összes</option>`;

        const feltoltes = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

        const allyears = feltoltes(minYear,maxYear);
      
        console.log('évek', allyears.length);
        
        yearFromSelect.innerHTML += allyears.map(item =>  `<option value="${item}">${item}</option>`).join('');
        yearToSelect.innerHTML += allyears.map(item =>  `<option value="${item}">${item}</option>`).join('');
        
        
    };

    function populateSelect(selectElement, items) {
        selectElement.innerHTML = "<option value=''>Összes</option>";
        
        items.forEach(item => {
            console.log("Hozzáadott márka:", item); // Ellenőrzés konzolban
            const option = document.createElement("option");
            option.value = item.id; // Fontos: ID beállítása
            option.textContent = item.name;
            selectElement.appendChild(option);
        });
    }
    
    

    function updateModelSelect() {
        const selectedManufacturer = manufacturerSelect.value;
        modelSelect.innerHTML = "<option value=''>Összes</option>";

        const filteredModels = models.filter(model => 
            model.manufacturerId == selectedManufacturer
        );

        filteredModels.forEach(model => {
            const option = document.createElement("option");
            option.value = model.id;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });

        console.log("Frissített modellek:", filteredModels);
    }

    manufacturerSelect.addEventListener("change", updateModelSelect);

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        carList.innerHTML = "";

        const selectedManufacturer = manufacturerSelect.value;
        const selectedModel = modelSelect.value;
        const selectedFuelType = fuelTypeSelect.value;
        const minSelectedYear = yearFromSelect.value;
        const maxSelectedYear = yearToSelect.value;

        console.log("Kiválasztott márka:", selectedManufacturer);
        console.log("Kiválasztott modell:", selectedModel);
        

        const filteredCars = cars.filter(car =>
            (!selectedManufacturer || models.find(m => m.id === car.modelId)?.manufacturerId == selectedManufacturer) &&
            (!selectedModel || car.modelId == selectedModel) &&
            (!selectedFuelType || car.fuelTypeId == selectedFuelType)&&
            (!selectedCategory || car.categoryId == selectedCategory)&&
            (!minSelectedYear || car.year >= minSelectedYear) &&
            (!maxSelectedYear || car.year <= maxSelectedYear)

        );

        console.log("Szűrt autók:", filteredCars);
        

        if (filteredCars.length < 1) {
            carList.innerHTML = "<p class='text-center text-danger'>Nincs találat</p>";
        } else {
            carList.innerHTML = ""; // Ürítsd ki a listát új szűrésnél
        
            filteredCars.forEach((car, index) => {
                const carouselId = `carousel-card-${car.id}`; // Egyedi azonosító
            
                let carouselItems = '';
let imgIndex = 0;

for (let i = 0; i < images.length; i++) {
    if (images[i].carId == car.id) {
        carouselItems += `
        <div class="carousel-item ${imgIndex === 0 ? 'active' : ''}">
            <div class="image-wrapper">
                <img src="http://localhost:5005/uploads/images/${images[i].imagePath}" 
                     alt="Car Image ${imgIndex + 1}">
            </div>
        </div>`;
        imgIndex++;
    }
}
            
                const card = document.createElement("div");
                card.classList.add("col-md-4", "mb-3");
                card.innerHTML = `
                    <div class="clickable-box bg-white p-4 text-center rounded border d-block car-card">
                        <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                ${carouselItems || '<div class="text-center p-2">Nincs kép</div>'}
                            </div>
                            <button class="carousel-control-prev carousel-btn" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Előző</span>
                            </button>
                            <button class="carousel-control-next carousel-btn" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Következő</span>
                            </button>
                        </div>
            
                        <div class="card-body">
                            <h5 class="card-title">${car.ManufacturerName} ${car.ModelName}</h5>
                            <p class="card-text">Évjárat: ${car.year}</p>
                            <p class="card-text">Üzemanyag: ${car.FuelTypeName}</p>
                            <p class="card-text">Kilométerenkénti díj: ${car.pricePerKm} FT</p>
                        </div>
                    </div>
                `;
        
                carList.appendChild(card);
    card.addEventListener("click", () => showCarDetails(car));
            });
        }
        
       
    });
    // 🔹 Keresési eredmények megjelenítése

// 🔹 Részletes nézet megjelenítése
function showCarDetails(car) {
    // Előző modal törlése
    const existingModal = document.getElementById("carModal");
    if (existingModal) existingModal.remove();

    let carouselItems = '';
    let matchingImageCount = 0; // Csak a car.id-hez passzoló képek számlálása

    for (let i = 0; i < images.length; i++) {
        // Típus biztos összehasonlítás
        if (Number(images[i].carId) === Number(car.id)) {
            carouselItems += `
            <div class="carousel-item ${matchingImageCount === 0 ? 'active' : ''}">
                <img src="http://localhost:5005/uploads/images/${images[i].imagePath}" class="d-block w-100" alt="Car Image ${matchingImageCount + 1}">
            </div>`;
            matchingImageCount++;
        }
    }

    // Dinamikus ID a carouselhez (hogy gombok is hozzá legyenek kötve)
    const carouselId = `carousel-${car.id}`;

    // Modal HTML
    const modalHTML = `
<div class="modal fade show" id="carModal" tabindex="-1" aria-labelledby="carModalLabel" aria-modal="true" role="dialog" style="display:block;">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <!-- Fejléc -->
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="carModalLabel">${car.ManufacturerName} ${car.ModelName}</h5>
                <button type="button" class="btn-close bg-white" data-bs-dismiss="modal" aria-label="Bezárás"></button>
            </div>

            <!-- Carousel -->
            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${carouselItems || '<div class="text-center p-4">Nincs elérhető kép ehhez az autóhoz.</div>'}
                </div>
                ${matchingImageCount > 1 ? `
                <button class="carousel-control-prev carousel-btn" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Előző</span>
                </button>
                <button class="carousel-control-next carousel-btn" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Következő</span>
                </button>` : ''}
            </div>

            <!-- Részletek -->
            <div class="modal-body bg-primary text-white">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Évjárat:</strong> ${car.year}</p>
                        <p><strong>Üzemanyag:</strong> ${car.FuelTypeName}</p>
                        <p><strong>Lóerő:</strong> ${car.horsePower}</p>
                        <p><strong>Kilométerenkénti bérleti díj:</strong> ${car.pricePerKm} FT</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Leírás:</strong> ${car.description}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer d-flex justify-content-center bg-dark">
                <button type="button" id="kapcsolat" class="btn bg-primary text-white" style="width: 500px; font-weight: bold">Kapcsolatfelvétel</button>
            </div>

        </div>
    </div>
</div>`;



    
document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'kapcsolat') {
        window.location.href = 'rolunk.html';
    }
});


    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Bootstrap modal inicializálása
    const modalInstance = new bootstrap.Modal(document.getElementById("carModal"));
    modalInstance.show();
}



// 🔹 Részletes nézet bezárása
function closeCarDetails() {
    document.getElementById("carDetails").style.display = "none";
}

    await fetchData();
});


    
    

    



