const csv2array = require('csv-to-array');
const run = require("./run");
const create = run.create;
var os = require('os');

var NUM_SIM_DAYS = 100;

// These variables are global so they can be accessed in the ./run directory
person_array = []; //this gets copied into pop.members
population_array = [];
disease_array = [];

const DISEASE_LIST = {
	"Influenza": [2.5, 0.75], "Diphtheria": [6.5, 7.5], "Smallpox": [6, 30, 3], 
	"Polio": [6], "Rubella": [6], "Mumps": [5.5, 1], "HIV": [3.5, 85], 
	"Pertussis": [5.5, 2.35], "SARS": [3.5, 11], "Ebola": [2, 50]
};


function step(pop, day) {
	var day_specific_prob;
	if (day == 0 || day == 1) {
		day_specific_prob = 1.5
	} else {
		day_specific_prob = 1;
	}
	for (var i = 0; i < disease_array.length; i++) { // for disease in diseases
		currDisease = disease_array[i];
		for (var j = 0; j < pop.members.length; j++) { // for person in population
			currMember = pop.members[j];
			if (currMember.infections.has(currDisease.getId())) {
				//console.log("Person " + currMember.getId() + " has had " + currDisease.name + " for " + currMember.days_infected[currDisease.getId()] + " days");
				if (Math.random() < (currDisease.fatalityRateUnVacc + currMember.days_infected[currDisease.getId()] * 0.00001)) { //not sure about this condition yet
					currMember.becomeDead(currDisease);
					j--;
					//console.log("Person " + currMember.getId() + " died after having " + currDisease.name + " for " + currMember.days_infected[currDisease.getId()] + " days");
				} else {
					currMember.days_infected[currDisease.getId()]++;
				}
				continue;
			}
			//If a random number is less than the number of people infected by this disease in the current population, become infected
			//These numbers were chosen arbitrarily for testing purposes and should be changed later to more realistic numbers
			if (Math.floor(Math.random() * (pop.members.length) < (pop.getNumInfected(currDisease.getId())))) {
				currMember.becomeInfected(currDisease);
			}
			//We have to decide if we want to create a random number for each interaction,
			//or just multiply by num_infected. The second way will be much slower (n^2 instead of n) but probably more realistic?
			/*
			Should we do separate tests and create a new random number for each? like
				if (Math.random() < chance_to_interact)
					if (Math.random() < chance_to_get_infected)
						if (Math.random() < ....)
							person.becomeInfected()
			Or one test like
				if (Math.random() < chance_to_interact * chance_to_get_infected * ....)
					person.becomeInfected()
			*/
			
			/* 
			//pseudo-code for infections
			//for each person except the current person
			for (var k = 0; k < pop.members.length - 1; k++) {
				generate a new random number for every interaction
				if (pop.members[k].is_infected) {
					//what else do we need to consider for the probability?
					if (Math.random() < day_specific_contact_rate * disease.transmissibility * ...) {
						pop.members[j].becomeInfected();
					}
				}
			}
			*/
		}
	}
	// Uncomment the next line for a daily report of each population
	//pop.printInfections();
}

function main() {
	console.log("\nSTARTING SIMULATION");
	//create new diseases
	create.newDisease("HIV", DISEASE_LIST["HIV"]);
	create.newDisease("Influenza", DISEASE_LIST["Influenza"]);
	//Infect a random person with each disease to start the spread
	for (let p = 0; p < population_array.length; p++) {
		var currPop = population_array[p];
		var people = currPop.members;
		console.log("\nPopulation", currPop.getId(), '\n');
		for (let i = 0; i < disease_array.length; i++) {
			let person_to_infect = Math.floor(Math.random() * (people.length));
			people[person_to_infect].becomeInfected(disease_array[i]);
			console.log("Person " + people[person_to_infect].getId() + " starts with disease " + i);
		}
	}
	//Perform daily operations
	var day_of_week = 0;
	for (i = 0; i < NUM_SIM_DAYS; i++) {
		if (day_of_week === 7) {
			day_of_week = 0;
		}
		for (let p = 0; p < population_array.length; p++) {
			var currPop = population_array[p];
			step(currPop, day_of_week);
		}
		day_of_week++;
	}
	//currPop.printInfections();
	console.log();
	for (let i = 0; i < disease_array.length; i++) {
		disease_array[i].printTotalInfected();
		disease_array[i].printTotalKilled();
	}
	console.log("\nSimulation finished");
}


//Read in population file
//Eventually this has to be changed to an api call based on user input (location)
var columns = ["lat", "lon", "pop"];
csv2array({file: "data/sample_density.csv", columns: columns},
	function (err, array) {
		if (err) console.log(err);
		//console.log(array);
		for (i = 0; i < array.length; i++) {
			person_array = [];
 			for (var j = 0; j < array[i]['pop']; j++) {
				create.newPerson('M', 'White');
  			}
  			create.newPopulation(person_array);
  		}
  		for (i = 0; i < population_array.length; i++) {
  			console.log(population_array[i].members.length);
  		}
  		main();
});
