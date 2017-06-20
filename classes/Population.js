pop_ID = 0;

// returns bool(low <= value < high)
function isInRange(low, value, high) {
	return low <= value && value < high;
}

function Population(arr) {
	var _id = pop_ID++;
	this.person_array = arr;
	this.numInfected = {};

	this.getId = function() {
		return _id;
	}
	
	for (let i = 0; i < this.person_array.length; i++) {
		this.person_array[i].setPopulation(this);
		//console.log(this.person_array[i].population.getId());
	}
}

Population.prototype = {
	print: function() {
		console.log("Population " + this.getId() + " contains:");
		for (let i = 0; i < this.person_array.length; i++) {
			this.person_array[i].printDemographics();
			console.log();
		}
	},
	printAgeDistribution: function() {
		var p0 = p20 = p40 = p60 = p80 = 0;
		console.log("Population " + this.getId() + " age distribution:");
		for (let i = 0; i < this.person_array.length; i++) {
			let curr_age = this.person_array[i].demographics.age;
			if (curr_age < 20) {
				p0++;
			} else if (isInRange(20, curr_age, 40)) {
				p20++;
			} else if (isInRange(40, curr_age, 60)) {
				p40++;
			} else if (isInRange(60, curr_age, 80)) {
				p60++;
			} else if (80 <= curr_age) {
				p80++;
			}
		}
		console.log("0-19  :", p0);
		console.log('20-39 :', p20);
		console.log('40-59 :', p40);
		console.log('60-79 :', p60);
		console.log('80+   :', p80);
	},
	printInfections: function() {
		for (let i = 0; i < this.person_array.length; i++) {
			console.log("Person " + this.person_array[i].getId() + " has infections: " + Array.from(this.person_array[i].infections));
		}
	},
	incrementNumInfected: function(diseaseId) {
		if (this.numInfected.hasOwnProperty(diseaseId)) {
			this.numInfected.diseaseId += 1;
		} else {
			this.numInfected[diseaseId] = 1;
		}
	},
	getNumInfected: function(diseaseId) {
		if (this.numInfected.hasOwnProperty(diseaseId)) {
			return this.numInfected[diseaseId];
		} else {
			console.log("ERROR: This population has 0 infections for this disease");
			return 0;
		}
	}
};

module.exports = Population;