function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function upperFirst(string) {
    return string[0].toUpperCase() + string.substring(1);
}

class SyllabusNode {
    constructor(letters, chance) {
        this.letters = letters;
        this.chance = chance;
    }

    generate() {
        if (Math.random() < this.chance)
            return this.letters[rand(0, this.letters.length)];
        return "";
    }
}

class Language {
    constructor(id, name, nodes, min = 2, max = 5) {
        this.id = id;
        this.name = name;
        this.nodes = nodes;
        this.min = min;
        this.max = max;
        this.malePattern = "^.+$";
        this.femalePattern = "^.+$";
        this.neutralPattern = "^.+$";
    }

    generate() {
        var word = "";
        var len = rand(this.min, this.max + 1);
        for (var j = 0; j < len; j++) {
            for (var i = 0; i < this.nodes.length; i++) {
                word += this.nodes[i].generate();
            }   
        }
        return word;
    }

    generateGendered(female, neutral, male) {
        if (!female && !neutral && !male)
            return this.generate();

        var tests = 0;
        var word = "";
        do {
            word = this.generate();
            tests++;
        } while (!this.doesFit(word, female, neutral, male) && tests < 100);

        if (tests == 100)
            return "Error : no word fits gender tests";

        return word;
    }

    isMale(word) {
        let re = new RegExp(this.malePattern);
        return re.test(word);
    }

    isFemale(word) {
        let re = new RegExp(this.femalePattern);
        return re.test(word);
    }
    
    isNeutral(word) {
        let re = new RegExp(this.neutralPattern);
        return re.test(word);
    }

    isName(word) {
        return this.isMale(word) || this.isFemale(word) || this.isNeutral(word);
    }

    doesFit(word, female, neutral, male) {
        if (!female && !neutral && !male)
            return true;

        if (female && this.isFemale(word))
            return true;
        if (male && this.isMale(word))
            return true;
        if (neutral && this.isNeutral(word))
            return true;

        return false;
    }
}

// Langues par défaut
const dzaka = new Language("dzaka", "Dzaka", 
[
    new SyllabusNode(["m", "n", "p", "t", "kj", "gj", "ts", "dz", "x", "v", "r", "l", "ch", "j"], 1),
    new SyllabusNode(["è", "eu", "i", "u", "a"], 1),
    new SyllabusNode(["m", "n", "p", "t", "kj", "gj", "ts", "dz", "x", "v", "r", "l", "ch", "j"], .1)
], 2, 4);

const klaglist = new Language("klaglist", "Klaglist",
[
    new SyllabusNode(["t", "l", "p", "k", "tr", "f", "ch", "vr", "g", "d", "s", "st",  // (C)
    "kl", "kf", "kch", "ks", "fl", "fk", "fch", "fs", "chl", "chk", "chf", "chs", "sl", "sk", "sf", "sch"], .6), // (C) (C)
    new SyllabusNode(["a", "e", "u", "o", "ia", "an"], 1), // V
    new SyllabusNode(["t", "l", "p", "k", "tr", "f", "ch", "vr", "g", "d", "s", "st"], .3), // (C)
], 2, 4);

const wonyi = new Language("wonyi", "Wonyi", 
[
    new SyllabusNode(["m", "n", "ny", "d", "dz", "g", "s", "z", "h", "r", "j", "w", "t", "ts", "k"], 1), // C
    new SyllabusNode(["i", "u", "e", "o", "a"], 1), // V
], 2, 5);

const wehejam = new Language("wehejam", "Wehèjam",
[
    new SyllabusNode(["b", "d", "f", "h", "j", "k", "m", "n", "r", "s", "w", "z"], 1), // C
    new SyllabusNode(["a", "i", "e", "a", "i", "e", "a", "i", "e", "à", "ì", "è"], 1), // V
    new SyllabusNode(["b", "h", "k", "m", "n", "z"], .2), // (C)
], 2, 5);
wehejam.malePattern = "^.+[iì]$";
wehejam.femalePattern = "^.+[aà]$";
wehejam.neutralPattern = "^.+[eè]$";

const raedos = new Language("raedos", "Rædos",
[
    new SyllabusNode(["v", "w", "b", "m", "n", "k", "g", "s", "th", "f", "j", "r", "t", "d"], .8), // [C]
    new SyllabusNode(["e", "o", "ø", "æ", "u", "i", "a", "ey"], 1), // V
    new SyllabusNode(["v", "w", "b", "m", "n", "k", "g", "s", "th", "f", "j", "r", "t", "d"], .2), // (C)
], 2, 5);

const languages = [
    dzaka,
    klaglist,
    wonyi,
    wehejam,
    raedos
];

function getLanguage(languageName) {
    return languages.find(element => element.id.toLowerCase() == languageName.toLowerCase());
}

function getRandomLanguage() {
    return languages[rand(0, languages.length)];
}

function getName(languageName) {
    var language = getLanguage(languageName);
    if (language == null)
        return "Language " + languageName + " not found !";
    return upperFirst(language.generate());
}

function getName(languageName, female, neutral, male) {
    var language = getLanguage(languageName);
    if (language == null)
        return "Language " + languageName + " not found !";

    if (!female && !neutral && !male)
        return language.generate();

    return upperFirst(language.generateGendered(female, neutral, male));
}

function getWord(languageName) {
    var language = getLanguage(languageName);
    if (language == null)
        return "Language " + languageName + " not found !";
    return language.generate();
}