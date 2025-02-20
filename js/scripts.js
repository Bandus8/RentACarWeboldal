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

    let cars = [];
    let manufacturers = [];
    let models = [];
    let fuelTypes = [];

    async function fetchData() {
        try {
            const [carsRes, manufacturersRes, modelsRes, fuelTypeRes] = await Promise.all([
                fetch("http://localhost:5005/cars"),
                fetch("http://localhost:5005/manufacturers"),
                fetch("http://localhost:5005/models"),
                fetch("http://localhost:5005/fuel_types"), 
            ]);

            cars = await carsRes.json();
            manufacturers = await manufacturersRes.json();
            models = await modelsRes.json();
            fuelTypes = await fuelTypeRes.json();

            console.log("Autók:", cars);
            console.log("Márkák:", manufacturers);
            console.log("Modellek:", models);
            console.log("Üzemanyag típusok:", fuelTypes);

            cars.forEach(car => {
                const model = models.find(m => m.id === car.modelId);
                car.ModelName = model ? model.name : "Ismeretlen";

                const manufacturer = model ? manufacturers.find(m => m.id === model.manufacturerId) : null;
                car.ManufacturerName = manufacturer ? manufacturer.name : "Ismeretlen";

                const fuelType = fuelTypes.find(f => f.id === car.fuelTypeId);
                car.FuelTypeName = fuelType ? fuelType.name : "Ismeretlen";
            });

            populateSelect(manufacturerSelect, manufacturers);
            populateSelect(fuelTypeSelect, fuelTypes);
            updateModelSelect();

        } catch (error) {
            console.error("Hiba a fetch közben: ", error);
        }
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

        console.log("Kiválasztott márka:", selectedManufacturer);
        console.log("Kiválasztott modell:", selectedModel);

        const filteredCars = cars.filter(car =>
            (!selectedManufacturer || models.find(m => m.id === car.modelId)?.manufacturerId == selectedManufacturer) &&
            (!selectedModel || car.modelId == selectedModel) &&
            (!selectedFuelType || car.fuelTypeId == selectedFuelType)
        );

        console.log("Szűrt autók:", filteredCars);

        if (filteredCars.length < 1) {
            carList.innerHTML = "<p class='text-center text-danger'>Nincs találat</p>";
        } else {
            filteredCars.forEach((car, index) => {
                const card = document.createElement("div");
                card.classList.add("col-md-4", "mb-3");
                card.innerHTML = `
                    <div class="clickable-box bg-white p-4 text-center rounded border d-block car-card" 
                        data-brand="${car.ManufacturerName}" 
                        data-model="${car.ModelName}" 
                        data-year="${car.year}" 
                        data-fuel="${car.fuelTypeId}">
                        
                        <div class="card-body">
                            <h5 class="card-title">${car.ManufacturerName} ${car.ModelName}</h5>
                            <p class="card-text">Évjárat: ${car.year}</p>
                            <p class="card-text">Üzemanyag: ${car.FuelTypeName}</p>
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
    // Előző modal törlése, ha van
    const existingModal = document.getElementById("carModal");
    if (existingModal) existingModal.remove(); 

    // Új modal létrehozása
    const modalHTML = `
    <div class="modal fade show" id="carModal" tabindex="-1" aria-labelledby="carModalLabel" aria-modal="true" role="dialog" style="display:block;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-dark">
                    <h5 class="modal-title text-white" id="carModalLabel bg-white">${car.ManufacturerName} ${car.ModelName}</h5>
                    <button type="button" class="btn-close bg-white" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body bg-primary text-white">
                    <p><strong>Évjárat:</strong> ${car.year}</p>
                    <p><strong>Üzemanyag:</strong> ${car.FuelTypeName}</p>
                </div>
            </div>
        </div>
    </div>`;

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


    
    

    



