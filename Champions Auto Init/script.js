var characters = [];
var discarded = [];
var deck = [];

var handNodes = [];

const names = ["Hero", "Villain", "Bystander", "Fighter", "Monster", "Civilian", "Vigilante", "Mastermind", "Mutant", "Champion", "Icon"];

function loadHand() {
    const handDiv = document.getElementById("cards");
    for (let i = 0; i < 5; i++) {
        handNodes[i] = handDiv.children[i];
    }
}

function addCharacter() {
    characters.push({
        name: names[getRandomInt(0, names.length)],
        speed: 2
    })

    addCharacterEditDiv(characters.length - 1);
    
    addCard(characters.length - 1);
    addCard(characters.length - 1);
}

function addCharacterEditDiv(index) {
    // On utilise le template comme base pour créer une nouvelle ligne sur l'éditeur de perso
    const template = document.getElementById("edit").lastElementChild;
    let newChar = template.cloneNode(true);
    let list = document.getElementById("edit");
    list.insertBefore(newChar, document.getElementById("edit").children[list.children.length - 2]);
    newChar.removeAttribute("hidden"); // On le rend visible

    // On lit l'édition du nom
    const txtInput = newChar.getElementsByClassName("name")[0];
    const txtHandler = function(e) {
        characters[index].name = e.target.value;
        redrawCards();
    }
    txtInput.addEventListener('input', txtHandler);
    // Et on édite la valeur par défaut vite fait
    txtInput.value = characters[index].name;

    // Lire pression de -
    const minus = newChar.getElementsByClassName("minus")[0];
    minus.characterIndex = index;
    const minusHandler = function(e) {
        if (characters[index].speed <= 0) {
            return;
        }

        characters[index].speed--;
        newChar.getElementsByClassName("spd")[0].innerHTML = characters[index].speed;
        console.debug(index);
        removeCard(index);

        if (characters[index].speed <= 0) {
            minus.disabled = true;
        }
    }
    minus.addEventListener('click', minusHandler);
    
    // Lire pression de +
    const plus = newChar.getElementsByClassName("plus")[0];
    plus.characterIndex = index;
    const plusHandler = function(e) {
        characters[index].speed++;
        newChar.getElementsByClassName("spd")[0].innerHTML = characters[index].speed;
        console.debug(index);
        addCard(index);

        minus.disabled = false;
    }
    plus.addEventListener('click', plusHandler);
}

function addCard(charIndex) {
    let index = getRandomInt(0, deck.length);
    deck.splice(index, 0, charIndex);

    if (index < 5) {
        redrawCards();
    }
}

function removeCard(charIndex) {
    let indexes = findOccurencesInArray(deck, charIndex);

    if (indexes.length <= 0) {
        return;
    }

    let index = indexes[getRandomInt(0, indexes.length)];
    deck.splice(index, 1);

    redrawCards();
}

function findOccurencesInArray(array, value) {
    let indexes = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] == value) {
            indexes.push(i);
        }
    }
    return indexes;
}

function redrawCards() {
    for (let i = 0; i < handNodes.length; i++) {
        handNodes[i].hidden = i >= deck.length;
        if (handNodes[i].hidden) {
            continue;
        }

        handNodes[i].getElementsByClassName("name")[0].innerHTML = characters[deck[i]].name;
        handNodes[i].getElementsByClassName("speed")[0].innerHTML = characters[deck[i]].speed + " spd";
    }
}

function nextCard() {
    if (deck.length <= 1) {
        resetDeck();
        return;
    }

    discarded.push(deck.shift());

    redrawCards();
}

function resetDeck() {
    discarded = [];
    deck = [];

    for (let i = 0; i < characters.length; i++) {
        for (let j = 0; j < characters[i].speed; j++) {
            addCard(i);
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
