var disease_ID = 0;

function Disease(name, r0val) {
	var ratio = r0val / 2.5;
	var _id = disease_ID++;
	this.name = name;
	this.totalInfected = 0;
	
	//TODO figure out where we're going to get the data for these parameters

	/* I ASSUME THIS IS WHAT HE MEANT IN THE EMAIL */

	//If we figure out we do not need any of these we can take them out
	this.transmissibility = 1.0 * ratio;
	this.prob_of_symptoms = 0.67 * ratio;
	this.symp_infectivity = 1.0 * ratio;
	this.asymp_infectivity = 0.5 * ratio;
	
	//Have to figure out if we want to deal with this as 3 days being 
	//the same or make it vary
	this.days_latent = 3 * ratio;
	this.days_infectious = 7 * ratio;
	this.days_incubating = 3 * ratio;
	this.days_symptomatic = 7 * ratio;
	

	/*
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