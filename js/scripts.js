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
    const yearSelect = document.getElementById("year-filter");
    const fuelTypeSelect = document.getElementById("fuelTypeFilter");
    const carList = document.getElementById("car-list");
    const filterButton = document.getElementById("filterButton");

    let cars = [];
    let manufacturers = [];
    let models = [];
    let fuelTypes = [];

    async function fetchData() {
        try {
            // 🔹 Adatok lekérése külön API végpontokból
            const [carsRes, manufacturersRes, modelsRes, fuelTypeRes] = await Promise.all([
                fetch("http://localhost:5005/cars"),
                fetch("http://localhost:5005/manufacturers"),
                fetch("http://localhost:5005/models"),
                fetch("http://localhost:5005/fueltypes"),
            ]);

            cars = await carsRes.json();
            manufacturers = await manufacturersRes.json();
            models = await modelsRes.json();
            fuelTypes = await fuelTypeRes.json();

            // 🔹 Összepárosítás ID alapján
            cars.forEach(car => {
                car.ManufacturerName = manufacturers.find(m => m.id === car.manufacturerId)?.name || "Ismeretlen";
                car.ModelName = models.find(m => m.id === car.modelId)?.name || "Ismeretlen";
                car.FuelTypeName = fuelTypes.find(f => f.id === car.fuelTypeId)?.name || "Ismeretlen";
            });

            // 🔹 Select elemek feltöltése
            populateSelect(manufacturerSelect, manufacturers);
            populateSelect(fuelTypeSelect, fuelTypes);

        } catch (error) {
            console.error("Hiba a fetch közben: ", error);
        }
    }

    // 🔹 Select menük feltöltése
    function populateSelect(selectElement, items) {
        selectElement.innerHTML = "<option value=''>Összes</option>";
        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            selectElement.appendChild(option);
        });
    }

    // 🔹 Márka választás → modellek szűrése
    manufacturerSelect.addEventListener("change", () => {
        const selectedManufacturer = manufacturerSelect.value;
        const filteredModels = models.filter(model => !selectedManufacturer || model.manufacturerId == selectedManufacturer);
        populateSelect(modelSelect, filteredModels);
    });

    // 🔹 Keresés gomb eseménykezelő
    filterButton.addEventListener("click", () => {
        const selectedManufacturer = manufacturerSelect.value;
        const selectedModel = modelSelect.value;
        const selectedYear = yearSelect.value;
        const selectedFuelType = fuelTypeSelect.value;

        const filteredCars = cars.filter(car =>
            (!selectedManufacturer || car.manufacturerId == selectedManufacturer) &&
            (!selectedModel || car.modelId == selectedModel) &&
            (!selectedYear || car.year == selectedYear) &&
            (!selectedFuelType || car.fuelTypeId == selectedFuelType)
        );

        displayCars(filteredCars);
    });

    // 🔹 Találatok megjelenítése
    function displayCars(filteredCars) {
        carList.innerHTML = "";
        filteredCars.forEach(car => {
            const carItem = document.createElement("li");
            carItem.textContent = `${car.ManufacturerName} ${car.ModelName} (${car.year}) - ${car.FuelTypeName}`;
            carList.appendChild(carItem);
        });
    }

    

    // 🔹 Adatok lekérése és UI feltöltése
    await fetchData();
});


