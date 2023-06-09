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

class LPattern {
    constructor(name, workablePattern, process) {
        this.name = name;
        this.pattern = workablePattern;
        this.process = process;
    }

    fits(word) {
        let re = new RegExp(this.pattern);
        return re.test(word);
    }
}

class Language {
    constructor(id, name, nodes, min = 2, max = 5) {
        this.id = id;
        this.name = name;
        this.nodes = nodes;
        this.min = min;
        this.max = max;
        this.patterns = ["^.+$"];
        this.patterns_n = ["Default"];
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

    generateModed(mode) {
        var tests = 0;
        var word = "";
        do {
            word = this.generate();
            tests++;
        } while (!this.doesFit(word, mode) && tests < 100);

        if (tests == 100)
            return "Error : no word fits mode";

        return word;
    }
    
    /*
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

    isName(word) {
        return this.isMale(word) || this.isFemale(word) || this.isNeutral(word);
    }
    */

    doesFit(word, mode) {
        let re = new RegExp(this.patterns[mode]);
        return re.test(word);
    }
}

// Langues par défaut
/*
const wehejam = new Language("wehejam", "Wehèjam",
[
    new SyllabusNode(["b", "d", "f", "h", "j", "k", "m", "n", "r", "s", "w", "z"], 1), // C
    new SyllabusNode(["a", "i", "e", "a", "i", "e", "a", "i", "e", "à", "ì", "è"], 1), // V
    new SyllabusNode(["b", "h", "k", "m", "n", "z"], .2), // (C)
], 2, 6);
wehejam.malePattern = "^.+[iì]$";
wehejam.femalePattern = "^.+[aà]$";
wehejam.neutralPattern = "^.+[eè]$";
*/

const ginio = new Language("ginio", "Ginio",
[
    new SyllabusNode(["b", "g", "z", "k", "m", "n", "l", "ll", "s", "ss", "tt", "t", "p",
                        "st", "sp", "sm", "ks", "kn", "km", "ks", "ph"], 1), // C
    new SyllabusNode(["i", "o", "a", "e", "io", "ia"], 1), // V
], 2, 4);
ginio.patterns.push("^.+[iuoaes]$");
ginio.patterns_n.push("Name");

const languages = [
    ginio
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

    return upperFirst(language.generate(mode));
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