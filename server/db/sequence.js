// Used to generate a sequence that auto-increments, used here to generate Article ID (aid)
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Store the sequence ID values
SequenceSchema = new Schema({
  _id: String, // The unique identifier for the sequence
  next: Number, // The next number in the sequence
});

// The following commented-out functions can be used to find and modify a sequence or to increment a sequence

// This method would find a sequence and modify it
/* SequenceSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
}; */

// This method would increment a sequence
/* SequenceSchema.statics.increment = function (schemaName, callback) {
    return this.collection.findAndModify({_id: schemaName}, [],
        { $inc: { next: 1 } }, {"new":true, upsert:true}, callback);
}; */

// Create a model from the schema and export it
var Sequence = mongoose.model("Sequence", SequenceSchema);

module.exports = Sequence;
