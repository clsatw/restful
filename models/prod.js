const mongoose = require('mongoose');

// const prodSchema: Schema = new Schema({
const prodSchema = mongoose.Schema({		
	name: {
		type: String,
		required: true,
		unique: false,
		default: ''
	},
	type: {
		type: String,
		required: true,
		default: ''
	},
	price: {
		type: String,
		default: ''
	},
	imgUrl: {
		type: String,
		default: ''
	}
}, { versionKey: false });

// order schema should be created late on for order management

// use the schema instance to define your Prods model
/* Mongoose automatically looks for the plural version of your model name.
** Thus, for the example above, the model user is for the users collection in the database.
** declare a model called Prod which has schema prodSchema
 */
module.exports = mongoose.model('Prod', prodSchema);
// module.exports = Prod;