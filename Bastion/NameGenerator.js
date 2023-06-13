function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function upperFirst(string) {
    return string[0].toUpperCase() + string.substring(1);
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function removeDoubleFirst(word) {
    if (word[0] == word[1])
        return word.slice(1, word.length);
    return word;
}

function removeDoubleLast(word) {
    if (word[word.length - 2] == word[word.length - 1])
        return word.slice(0, word.length - 1);
    return word;
}

function removeDoubleExtremities(word) {
    return removeDoubleFirst(removeDoubleLast(word));
}

function validateRegex(word, regex) {
    return new RegExp(regex).test(word);
}

function quickValidate(regex) {
    return x => validateRegex(x, regex);
}

class Node {
    generate() {
        return "";
    }
}

class LetterNode extends Node {
    constructor(letter) {
        super();
        this.letter = letter;
    }

    generate() {
        return this.letter;
    }
}

class RandomLetterNode extends LetterNode {
    constructor(letters) {
        super();
        this.letters = letters;
    }

    generate() {
        return this.letters[rand(0, this.letters.length)];
    }
}

class LinearNode extends Node {
    constructor(children) {
        super();
        this.children = children;
    }

    generate() {
        var word = "";
        for (var i = 0; i < this.children.length; i++) {
            word += this.children[i].generate();
        }
        return word;
    }
}

class RepeatNode extends Node {
    constructor(child, minlength, maxlength) {
        super();
        this.child = child;
        this.minlength = minlength;
        this.maxlength = maxlength;
    }

    generate() {
        var word = "";
        var len = rand(this.minlength, this.maxlength + 1);
        for (var j = 0; j < len; j++) {
            word += this.child.generate();
        }
        return word;
    }
}

class ChanceNode extends Node {
    constructor(_child, _chance) {
        super();
        this.child = _child;
        this.chance = _chance;
    }

    generate() {
        if (Math.random() < this.chance)
            return this.child.generate();
        return "";
    }
}

class Mode {
    constructor(name, validationFunction, postprocess) {
        this.name = name;
        this.validate = validationFunction;
        this.process = postprocess;
    }

    fits(word) {
        return this.validate(word);
    }
}

class Language {
    constructor(category, id, name, nodes) {
        this.category = category;
        this.id = id;
        this.name = name;
        this.root = new LinearNode(nodes);
        this.modes = [new Mode("Default", quickValidate("^...+$"), x => removeDoubleExtremities(x))]
    }

    generateBaseWord() {
        return this.root.generate();
    }

    generateModed(mode) {
        var tests = 0;
        var word = "";
        do {
            word = this.generateBaseWord();
            tests++;
        } while (!this.modes[mode].fits(word) && tests < 100);

        if (tests >= 100)
            return "Error : no word fits mode";

        let nword = this.modes[mode].process(word);

        /*if (word != nword) {
            console.log("base : " + word + "\nnew : " + nword);
        }*/

        return nword;
    }
}

const ginio = new Language("main", "ginio", "Ginio",
[
    new ChanceNode(new RandomLetterNode(["i", "o", "a", "e"]), .5), // V

    new RepeatNode(new LinearNode([
        new RandomLetterNode(["b", "g", "z", "k", "m", "n", "l", "ll", "s", "ss", "tt", "t", "p",
                        "st", "sp", "sm", "ks", "kn", "km", "ks", "ph"]), // C
        new RandomLetterNode(["i", "o", "a", "e", "io", "ia"]) // V
    ]), 1, 3),

    new ChanceNode(new RandomLetterNode(["b", "g", "z", "k", "m", "n", "l", "ll", "s", "ss", "tt", "t", "p",
    "st", "sp", "sm", "ks", "kn", "km", "ks", "ph"]), .45) // (C)
]);
ginio.modes.push(new Mode("Prénom", quickValidate("^..+[iuoaes]$"), 
    x => upperFirst(removeDoubleExtremities(x))
));

const baccents = {
    "e": ["é", "è", "ë"],
    "a": ["ä"],
    "o": ["ö"],
    "u": ["ü"]
};
const bowels = ["e", "u", "a", "o"];

function accentuateLast(word) {
    for(let i = word.length - 1; i > 0; i--) {
        if (bowels.includes(word[i])) {
            let nword = word;
            return nword.replaceAt(i, baccents[nword[i]][rand(0, baccents[nword[i]].length)]);
        }
    }
    return word;
}

function accentuateBeforeLast(word) {
    let n = 0;
    for(let i = word.length - 1; i > 0; i--) {
        if (bowels.includes(word[i])) {
            n += 1;
            if (n > 1) {
                let nword = word;
                return nword.replaceAt(i, baccents[nword[i]][rand(0, baccents[nword[i]].length)]);
            }
        }
    }
    return word;
}

const getsan = new Language("main", "getsan", "Getsan", [
    new RepeatNode(new LinearNode([
        new RandomLetterNode(["pf", "ts", "ch", "sh", "g", "y", "b", "d", "v"]), // C
        new RandomLetterNode(["e", "u", "a", "o", "an"]), // V
        new ChanceNode(new RandomLetterNode(["ch", "sh", "g", "y", "b", "d", "v"]), .2), // (C)
    ]), 2, 4)
]);
getsan.modes.push(new Mode("Prénom", quickValidate("^.+$"), x => {
    return upperFirst(accentuateLast(x));
}));
getsan.modes.push(new Mode("Entité", quickValidate("^.+$"), x => {
    return accentuateBeforeLast(x);
}));


const euchir = new Language("main", "euchir", "Euchir", [
    new RepeatNode(new LinearNode([
        new ChanceNode(new RandomLetterNode(["j", "w"]), .07), // approximants
        new RandomLetterNode(["i", "u", "ou", "o", "a", "eu", "é"]), // V
        new RandomLetterNode(["m", "p", "b", "f", "v", "t", "ts", "n", "s", "r", "l", "tch", "ch"]), // C
    ]), 2, 4)
]);

const ancientTsatsoumekhu = new Language("hihi", "ancienttsatsoumekhu", "Ancient Tsatsoumekhu", [
    new RepeatNode(new LinearNode([
        new RandomLetterNode(["kh", "xh", "ss", "ph", "m", "th", "ts", "l"]), // C
        new RandomLetterNode(["a", "e", "u", "ou"]), // V
    ]), 1, 5)
]);

const tatomku = new Language("hihi", "tatomku", "Tatomku", [
    new RepeatNode(new LinearNode([
        new RandomLetterNode(["k", "s", "f", "m", "t", "l", "p", "b"]), // C
        new RandomLetterNode(["a", "e", "u", "o", "i"]), // V
        new ChanceNode(new RandomLetterNode(["k", "s", "f", "m", "t", "l", "p", "b"]), .15)
    ]), 1, 5)
]);

const languages = [
    ginio,
    getsan,
    euchir,
    ancientTsatsoumekhu,
    tatomku
];

function getLanguage(languageName) {
    return languages.find(element => element.id.toLowerCase() == languageName.toLowerCase());
}

function getRandomLanguage() {
    return languages[rand(0, languages.length)];
}

function getNameModed(languageName, mode) {
    var language = getLanguage(languageName);
    if (language == null)
        return "Language " + languageName + " not found !";

    return language.generateModed(mode);
}

function getName(languageName) {
    return getNameModed(languageName, 0);
}

function getWord(languageName) {
    var language = getLanguage(languageName);
    if (language == null)
        return "Language " + languageName + " not found !";
    return language.generate();
}

function getCategories() {
    let cats = [];

    languages.forEach(x => {
        if (!cats.includes(x.category))
            cats.push(x.category);
    })
    
    return cats;
}

function compareLanguages(a, b) {
    let /*c = a.category.localeCompare(b.category);
    if (c == 0)*/
        c = a.name.localeCompare(b.name);
    return c;
}

function sortLanguages() {
    languages.sort(compareLanguages);
}