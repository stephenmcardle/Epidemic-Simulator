var disease_ID = 0;

function Disease(name) {
	var _id = disease_ID++;
	this.name = name;
	this.totalInfected = 0;
	/*
	//TODO figure out where we're going to get the data for these parameters
	this->transmissibility = -1.0;
	this->natural_history = null;
	this->min_symptoms_for_seek_healthcare = -1.0;
	this->hospitalization_prob = null;
	this->outpatient_healthcare_prob = null;
	this->seasonality_Ka = -1.0;
	this->seasonality_Kb = -1.0;
	this->seasonality_min = -1.0;
	this->seasonality_max = -1.0;
	strcpy(this->natural_history_model,"markov");
	strcpy(this->transmission_mode,"respiratory");
	*/
	this.getId = function() {
		return _id;
	}
}

Disease.prototype = {
	printTotalInfected: function() {
		console.log("Disease " + this.getId() + ": " + this.name + " has infected " + this.totalInfected + " people.");
	}
}


module.exports = Disease;