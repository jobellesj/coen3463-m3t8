var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tedtalksSchema = new Schema
(
    {
        title: {type: String, required: true},
        uploader_name: {type: String, required: true},
        youtube_page: {type: String, required: true},
        youtube_link: {type: String, required: true},
        description: {type: String},
        pub_date: {type: Data},
        category: {type: String},
        likes: {type: Number},
        embedded: {type: String},
        creation_date: {type: Number},
        last_update: {type: Number}
    },
    {
        collection: 'tedtalks'
    }
);

module.exports = mongoose.model('tedtalks', tedtalksSchema);