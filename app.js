const csv2array = require('csv-to-array');
const run = require("./run");
const create = run.create;
var os = require('os');

var NUM_SIM_DAYS = 100;
var numberOfInteractions = 15;

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
	var daySpecificProb;
	if (day == 0 || day == 1) {
		daySpecificProb = 1.5
	} else {
		daySpecificProb = 1;
	}
	for (var i = 0; i < disease_array.length; i++) { // for disease in diseases
		currDisease = disease_array[i];

		tempPersons = [];
		personsLeft = 0;
		for (var j = 0; j < pop.members.length; j++) {
			let currId = pop.members[j].getId();
			let tempObj = { 'id' : currId, 'numInteractions' : Math.floor(numberOfInteractions * daySpecificProb)};
			tempPersons[j] = tempObj;
			personsLeft++;
		}

		//console.log(tempPersons[0]['id']);

		for (var j = 0; j < pop.members.length; j++) { // for person in population
			if (personsLeft === 1) {
				break;
			}
			currMember = pop.members[j];
			currId = currMember.getId();
			
			/*  To check if a person needs to keep interacting, keep a counter for each person with the interactons they have left
				Only do the next 2 for loops if the counter is > 0 for this day 
				We could try another list/set with everybody that we grab from for interactions and remove a person from the list 
				once they go through this loop or reach maximum interactions. */
			//build array of size numberOfInteractions * daySpecificProb of random people to interact with
			if (personsLeft < 3) {
				//figure out how to handle this
			} else if(tempPersons[j]['numInteractions'] > 0) {
				var interactWith = [];
				while (tempPersons[j]['numInteractions'] > 0 && personsLeft > 2) {
					let personToInteractWith = Math.floor(Math.random() * (personsLeft - 1));
					while (personToInteractWith === j) {
						//console.log("random = current");
						//console.log(personsLeft + ' ' + j + '\n');
						personToInteractWith = Math.floor(Math.random() * (personsLeft - 1));
					}
					//console.log(personsLeft);
					//console.log(personToInteractWith);
					//console.log(typeof tempPersons[personToInteractWith]['id']);
					if (pop.getMemberById(tempPersons[personToInteractWith]['id']) === undefined) {
						console.log(personsLeft);
						console.log(personToInteractWith);
					}
					interactWith.push(pop.getMemberById(tempPersons[personToInteractWith]['id']));
					tempPersons[j]['numInteractions']--;
					tempPersons[personToInteractWith]['numInteractions']--;
					//console.log(tempPersons[personToInteractWith]['numInteractions']);
					if (tempPersons[personToInteractWith]['numInteractions'] < 1) {
						tempPersons.splice(personToInteractWith, 1);
						personsLeft--;
						if (personToInteractWith < j) {
							j--;
						}
					}
				}
				//console.log();
				//console.log(interactWith);
				for (let k = 0; k < interactWith.length; k++) {
					if (currMember.infections.has(currDisease.getId())) {
						if (!interactWith[k].infections.has(currDisease.getId())) {
							if (Math.random() < currDisease.transmissibility) {
								interactWith[k].becomeInfected(currDisease);
							}
						}
					} else {
						//console.log(interactWith[k]);
						if (interactWith[k].infections.has(currDisease.getId())) {
							if (Math.random() < currDisease.transmissibility) {
								currMember.becomeInfected(currDisease);
							}
						}
					}
				}

			} else {
				// if the person is out of interactions, remove them
				tempPersons.splice(j, 1);
				personsLeft--;
				j--;
			}


			/*  Since we infect both ways when we go through people (the second for loop) we shouldn't have to worry about missing someone
				and if the person has already had all the alotted interactions they just see if they die today */

			// at the end of the day, calculate if this person should die
			if (currMember.infections.has(currDisease.getId())) {
				//console.log("Person " + currMember.getId() + " has had " + currDisease.name + " for " + currMember.days_infected[currDisease.getId()] + " days");
				if (Math.random() < (currDisease.fatalityRateUnVacc + currMember.days_infected[currDisease.getId()] * 0.00001)) { //not sure about this condition yet
					currMember.becomeDead(currDisease);
					tempPersons.splice(j, 1);
					j--;
					personsLeft--;
					//console.log("Person " + currMember.getId() + " died after having " + currDisease.name + " for " + currMember.days_infected[currDisease.getId()] + " days");
				} else {
					currMember.days_infected[currDisease.getId()]++;
				}
			}
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
