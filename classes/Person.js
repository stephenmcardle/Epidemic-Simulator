const Demographics = require('./Demographics');

person_ID = 0;

function Person(age, sex, race, dob) {
	var _id = person_ID++
	var population = null;
	/*
	//TODO These are not useful yet, but we might need them when the model becomes more complex
	this.index = -1;
	this.exposed_household_index = -1;
	this.eligible_to_migrate = true;
	this.native = true;
	this.original = false;
	*/
	this.demographics = new Demographics(this._id, age, sex, race, /*rel, day, today_is_birthday,*/ dob);
	this.infections = new Set(); // this might be unnecessary with the addition of days_infected
	this.days_infected = {};

	this.getId = function() {
		return _id;
	}
	this.getPopulation = function() {
		return population;
	}
	this.setPopulation = function(pop) {
		population = pop;
	}
}

Person.prototype = {
	changeAge: function(newAge) {
    	this.age = newAge;
	},
	print: function() {
		console.log("Person " + this.getId());
	},
	printDemographics: function () {
		console.log ("Person " + this.getId());
		this.demographics.print();
	},
	becomeInfected: function(disease) {
		this.infections.add(disease.getId());
		this.days_infected[disease.getId()] = 1;
		disease.currentInfected++;
		disease.totalInfected++;
		this.getPopulation().incrementNumInfected(disease.getId());
		
	},
	becomeDead: function(disease) {
		//remove from population
		let i = this.getPopulation().members.indexOf(this);
		this.getPopulation().members.splice(i, 1);
	
		disease.currentInfected--;
		disease.totalKilled++;
	}
};

module.exports = Person;