const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    stringFields: [String],
    linkFields: [{
        label: String,
        url: String
    }],
    imageFields: [String]
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
