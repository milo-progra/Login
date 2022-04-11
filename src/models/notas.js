
var mongoose = require('mongoose')

const NotasSchema = mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        user:{
            type: String,
            required: true
        }
    
},{
    timesTamps: true
});

module.exports = mongoose.model('Nota', NotasSchema);
