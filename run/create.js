const classes = require("../classes");
const Person = classes.Person;
const Population = classes.Population;
const Disease = classes.Disease;

module.exports = {

	//Creates a new person and adds it to the global variable person_Array
	newPerson: function(sex, race) {
		var age = Math.floor(Math.random() * 101);
		var person = new Person(age, sex, race, 2017 - age);
		person_array.push(person);
	},

	newPopulation: function(arr) {
		var pop = new Population(person_array);
	  	population_array.push(pop);
	},

	newDisease: function(name) {
		var disease = new Disease(name);
		disease_array.push(disease);
	}

}