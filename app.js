const classes = require("./classes");
const Person = classes.Person;
const Population = classes.Population;
const Disease = classes.Disease;
const csv2array = require('csv-to-array');
var os = require('os');

var NUM_SIM_DAYS = 100;

var person_array = [];
var population_array = [];
var disease_array = [];
const DISEASE_LIST = new Map([["Influenza", 2.5], ["Diphtheria", 6.5], 
["Smallpox", 6], ["Polio", 6], ["Rubella", 6], 
["Mumps", 5.5], ["HIV", 3.5], ["Pertussis", 5.5], 
["SARS", 3.5], ["Ebola", 2]]);

function createNewPerson(sex, race) {
	var age = Math.floor(Math.random() * 101);
	var person = new Person(age, sex, race, 2017 - age);
	person_array.push(person);
}

function createNewPopulation(arr) {
	var pop = new Population(person_array);
  	population_array.push(pop);
}

function createNewDisease(name) {
	var disease = new Disease(name);
	disease_array.push(disease);
}

function step(pop) {
	for (var i = 0; i < disease_array.length; i++) { // for disease in diseases
		for (var j = 0; j < pop.person_array.length; j++) { // for person in population
			//If a random number is less than the number of people infected by this disease in the current population, become infected
			//These numbers were chosen arbitrarily for testing purposes and should be changed later to more realistic numbers
			if (Math.floor(Math.random() * (pop.person_array.length) < (pop.getNumInfected(disease_array[i].getId())))) {
				pop.person_array[j].becomeInfected(disease_array[i]);
			}
		}
	}
	// Uncomment the next line for a daily report of each population
	//pop.printInfections();
}

function main() {
	console.log("\nSTARTING SIMULATION");
	//create new diseases
	createNewDisease("HIV", DISEASE_LIST.get("HIV"));
	createNewDisease("Influenza", DISEASE_LIST.get("Influenza"));
	//Infect a random person with each disease to start the spread
	for (let p = 0; p < population_array.length; p++) {
		var currPop = population_array[p];
		var people = currPop.person_array;
		console.log("\nPopulation", currPop.getId(), '\n');
		for (let i = 0; i < disease_array.length; i++) {
			let person_to_infect = Math.floor(Math.random() * (people.length));
			people[person_to_infect].becomeInfected(disease_array[i]);
			console.log("Person " + people[person_to_infect].getId() + " starts with disease " + i);
		}
		//Perform daily operations
		for (i = 0; i < NUM_SIM_DAYS; i++) {
			//console.log("\nDAY", i + ":");
			step(currPop); // TODO merge populations and add the chance for them to interact (like neighborhoods in FRED)
		}
		//currPop.printInfections();
	}
	console.log();
	for (let i = 0; i < disease_array.length; i++) {
		disease_array[i].printTotalInfected();
	}
	console.log("\nSimulation finished");
}


//testing csv-to-array module
var columns = ["lat", "lon", "pop"];
csv2array({file: "data/sample_density.csv", columns: columns},
	function (err, array) {
		if (err) console.log(err);
		//console.log(array);
		for (i = 0; i < array.length; i++) {
			person_array = [];
 			for (var j = 0; j < array[i]['pop']; j++) {
				createNewPerson('M', 'White');
  			}
  			createNewPopulation(person_array);
  		}
  		for (i = 0; i < population_array.length; i++) {
  			console.log(population_array[i].person_array.length);
  		}
  		main();
  		console.log(os.freemem());
});
