'use strict';

const mongoose = require('mongoose');

// definir un esquema
const adSchema = mongoose.Schema({
  name: {type: String, index: true},
  sale: {type: Boolean, index: true},
  price: {type: Number, index: true},
  photo: String,
  tags: {type: [String], index: true}
  });



// crear método estático para listar tags
adSchema.statics.tags = function() {
   return Ad.distinct('tags');
}

// crear método estático para listar anuncios
adSchema.statics.adfilters = function(filtros, skip, limit, select, sort) {
  const query = Ad.find(filtros);
  query.skip(skip);
  query.limit(limit);
  query.select(select);
  query.sort(sort);

  return query.exec();
}

// crear modelo con ese esquema
const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;