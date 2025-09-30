let mapImg;
let pokeData; // holds JSON data
let regions = []; // holds region buttons
//stores the matching colors of each associate type
const colours = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

// Define where each button should be and its associated type
let regionButtons = [
    { name: "Attica", x: 342, y: 307, type: "normal" },
    { name: "Peloponnese", x: 270, y: 359, type: "poison" },
    { name: "Sterea Ellas", x: 242, y: 274, types: ["bug", "electric"] },
    { name: "Thessaly", x: 246, y: 213, types: ["grass", "psychic"] },
    { name: "Epirus", x: 162, y: 225, types: ["ice", "fighting"] },
    { name: "Macedonia", x: 232, y: 138, type: "dark" },
    { name: "Thrace", x: 366, y: 77, type: "fairy" },
    { name: "North Aegean", x: 417, y: 179, types: ["dragon", "flying"] },
    { name: "South Aegean", x: 444, y: 262, type: "ghost" },
    { name: "Dodecanese", x: 560, y: 360, types: ["ground", "fire"] },
    { name: "Cyclades", x: 420, y: 346, type: "rock" },
    { name: "Crete", x: 423, y: 480, type: "steel" },
    { name: "Ionian Islands", x: 143, y: 285, type: "water" }
];

function preload() {
    // Load your map image (use PNG or SVG path)
    mapImg = loadImage('media/hellas-poke-map.png');
}

function setup() {
    console.log("Setup started");

    // Fetch the Pokemon data
    fetch('pokedata.json')
        .then(response => {
            console.log("Fetch response received:", response);
            return response.json();
        })
        .then(data => {
            console.log("Pokemon data loaded:", data);
            pokeData = data;
        })
        .catch(error => {
            console.error("Error loading Pokemon data:", error);
        });

    // Create canvas that fits in the map-container div
    let canvas = createCanvas(750, 550);
    canvas.parent('map-container');
    // Display the map to fit the canvas
    image(mapImg, 0, 0, width, height);
}

function draw() {
    image(mapImg, 0, 0, width, height); //redraw map each frame

    //loop through each region button (13 total)
    for (let i = 0; i < regionButtons.length; i++) {
        let btn = regionButtons[i];

        //calculate distance from mouse to button center
        let d = dist(mouseX, mouseY, btn.x, btn.y);
        let isHovering = d < 40; // Check if mouse is over button

        stroke(0);
        strokeWeight(1);

        // Check if button has one type or two types
        if (btn.types && btn.types.length === 2) {
            // Dual type - draw split gradient
            let color1 = colours[btn.types[0]];
            let color2 = colours[btn.types[1]];

            if (!isHovering) {
                color1 += '80';
                color2 += '80';
            }

            // Create gradient
            let grad = drawingContext.createLinearGradient(
                btn.x - 40, btn.y - 17.5,
                btn.x + 40, btn.y + 17.5
            );
            grad.addColorStop(0, color1);
            grad.addColorStop(0.5, color1);
            grad.addColorStop(0.5, color2);
            grad.addColorStop(1, color2);

            drawingContext.fillStyle = grad;
            rectMode(CENTER);
            rect(btn.x, btn.y, 80, 35, 8);
        } else {
            // Single type - solid color
            let typeColor = btn.type || btn.types[0];

            if (isHovering) {
                fill(colours[typeColor]);
            } else {
                fill(colours[typeColor] + '80');
            }

            rectMode(CENTER);
            rect(btn.x, btn.y, 80, 35, 8);
        }

        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(10);
        text(btn.name, btn.x, btn.y);
    }

}
function mousePressed() {
    // Loop through each button to check if it was clicked
    for (let i = 0; i < regionButtons.length; i++) {
        let btn = regionButtons[i];
        let d = dist(mouseX, mouseY, btn.x, btn.y);

        if (d < 40) {
            // Button was clicked!
            console.log("Clicked on: " + btn.name);
            displayPokemonData(btn.name);
            return;
        }
    }
}
function displayPokemonData(regionName) {
    // step 1: search for the Pokemon
    let pokemon = null;

    for (let i = 0; i < pokeData.pokeData.length; i++) {
        if (pokeData.pokeData[i].region === regionName) {
            pokemon = pokeData.pokeData[i];
            break;
        }
    }

    // step 2: if found display it
    if (pokemon) {
        console.log("Found Pokemon:", pokemon);

        let regionDisplay = document.getElementById('region-display');

        // Build the HTML content
        let htmlContent = '<h3>' + pokemon.name + '</h3>';
        htmlContent += '<h4>Region:' + regionName + '</h4>';
        htmlContent += '<img src="' + pokemon.img + '" alt="' + pokemon.name + '">';
        htmlContent += '<p>Type: ' + pokemon.types + '</p>';

        regionDisplay.innerHTML = htmlContent;

    } else {
        console.log("No Pokemon found for", regionName);
    }
}