function Demographics(id, age, sex, race, dob) {
	var _id = id;
	this.age = age;
	this.sex = sex;
	this.race = race;
	this.dob = dob;

	this.getId = function() {
		return _id;
	}
}

Demographics.prototype = {
	print: function() {
		console.log("Age:  " + this.age);
		console.log("Sex:  " + this.sex);
		console.log("Race: " + this.race);
		console.log("DOB:  " + this.dob);
	}
}

module.exports = Demographics;