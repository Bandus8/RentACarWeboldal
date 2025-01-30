/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
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

document.addEventListener("DOMContentLoaded", function () {
    // Márkák és modellek összerendelése
    const carModels = {
        Toyota: ["Camry", "Corolla", "Yaris", "RAV4"],
        BMW: ["3 Series", "5 Series", "X5", "Z4"],
        Mercedes: ["A-Class", "C-Class", "E-Class", "GLA"]
    };

    // HTML elemek lekérése
    const brandSelect = document.getElementById("brandSelect");
    const modelSelect = document.getElementById("modelSelect");
    const yearFromSelect = document.getElementById("yearFrom");
    const yearToSelect = document.getElementById("yearTo");

    // Ha valamelyik nem található, ne fusson tovább a script
    if (!brandSelect || !modelSelect || !yearFromSelect || !yearToSelect) {
        console.error("Nem található valamelyik elem. Ellenőrizd az ID-kat!");
        return;
    }

    // Évjárat generálása (2000-2024)
    const currentYear = new Date().getFullYear();
    for (let year = 2000; year <= currentYear; year++) {
        let option1 = document.createElement("option");
        let option2 = document.createElement("option");
        option1.value = year;
        option1.textContent = year;
        option2.value = year;
        option2.textContent = year;
        yearFromSelect.appendChild(option1);
        yearToSelect.appendChild(option2);
    }

    // Márka kiválasztás eseménykezelője
    brandSelect.addEventListener("change", function() {
        const selectedBrand = brandSelect.value;

        // Modell lista frissítése
        modelSelect.innerHTML = '<option value="" selected disabled>Válassz modellt</option>';

        if (selectedBrand) {
            modelSelect.disabled = false;
            carModels[selectedBrand].forEach(model => {
                const option = document.createElement("option");
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        } else {
            modelSelect.disabled = true;
        }
    });

    // Biztosítsuk, hogy a "Mettől" év nem lehet nagyobb, mint a "Meddig" év
    yearFromSelect.addEventListener("change", function() {
        const minYear = parseInt(yearFromSelect.value);
        yearToSelect.innerHTML = '<option value="" selected disabled>Válassz végső évet</option>';

        for (let year = minYear; year <= currentYear; year++) {
            let option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearToSelect.appendChild(option);
        }
    });
});