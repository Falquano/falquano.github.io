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

class SyllabusNode {
    constructor(letters, chance) {
        this.letters = letters;
        this.chance = chance;
    }

    generate(i, l) {
        if (this.chance(i, l))
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
        /* 
        this.patterns = ["^.+$"];
        this.patterns_n = ["Default"]; */
        this.patterns = [new LPattern("Default", "^.+$", x => removeDoubleExtremities(x))]
    }

    generateBaseWord() {
        var word = "";
        var len = rand(this.min, this.max + 1);
        for (var j = 0; j < len; j++) {
            for (var i = 0; i < this.nodes.length; i++) {
                word += this.nodes[i].generate(j, len);
            }   
        }
        return word;
    }

    generateModed(mode) {
        var tests = 0;
        var word = "";
        do {
            word = this.generateBaseWord();
            tests++;
        } while (!this.doesFit(word, mode) && tests < 100);

        if (tests == 100)
            return "Error : no word fits mode";

        let nword = this.patterns[mode].process(word);

        if (word != nword) {
            console.log("base : " + word + "\nnew : " + nword);
        }

        return nword;
    }

    doesFit(word, mode) {
        return this.patterns[mode].fits(word);
    }
}

const ginio = new Language("ginio", "Ginio",
[
    new SyllabusNode(["i", "o", "a", "e"], (x, l) => {
        if (x == 0 && Math.random() < .5)
            return true;
        return false;
    }), // V
    new SyllabusNode(["b", "g", "z", "k", "m", "n", "l", "ll", "s", "ss", "tt", "t", "p",
                        "st", "sp", "sm", "ks", "kn", "km", "ks", "ph"], (x, l) => true), // C
    new SyllabusNode(["i", "o", "a", "e", "io", "ia"], (x, l) => true), // V
], 2, 4);
ginio.patterns.push(new LPattern("Prénom", "^.+[iuoaes]$", 
    x => {
        if (rand(0, 10) < 2) {
            x = x + "s";
        }

        return upperFirst(removeDoubleExtremities(x));
    }));

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

const b = new Language("b", "B",
[
    new SyllabusNode(["pf", "ts", "ch", "sh", "g", "y", "b", "d", "v"], (x, l) => true), // C
    new SyllabusNode(["e", "u", "a", "o"], (x, l) => true), // V
    new SyllabusNode(["ch", "sh", "g", "y", "b", "d", "v"], (x, l) => Math.random() < .2), // C
], 2, 5);
b.patterns.push(new LPattern("Person", "^.+$", x => {
    return upperFirst(accentuateLast(x));
}))

const languages = [
    ginio,
    b
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