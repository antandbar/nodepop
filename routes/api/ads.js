'use strict';

const express = require('express');
const createError = require('http-errors');
const Ad = require('../../models/Ad');
const { getUrlPhotos } = require('../../lib/utils');

const router = express.Router();

// GET /apiv1/ads
// Devuelve una lista de Anuncios
router.get('/', async (req, res, next) => {
  try {

    const name = req.query.name;
    const sale = req.query.sale;
    const minprice = req.query.minprice;
    const maxprice = req.query.maxprice;
    const tags = req.query.tags;      
    const skip = req.query.skip;
    const limit = req.query.limit;
    const select = req.query.select;
    const sort = req.query.sort;
    
    const filters = {}
    
    if(name) filters.name = new RegExp('^' +req.query.name, "i");
    if(sale) filters.sale = sale;
    if(tags) filters.tags = tags; 
    if(minprice) filters.price = {$gte: minprice};
    if(maxprice) filters.price = {$lte: maxprice};
    if(minprice && maxprice) filters.price = {$gte: minprice, $lte: maxprice};
    

    const ads = await Ad.adfilters(filters, skip, limit, select, sort);
  
    for(let ad of ads) {
      ad.photo = getUrlPhotos(req, ad.photo);
    }  

    res.json({ results: ads })

  } catch (err) {
    next(err);
  }
});

// GET /apiv1/ads/tagslist
// Devuelve lista de tags existentes
  router.get('/tagslist', async (req, res, next) => {
    try {
      const ad = await Ad.tags();
      
      res.json({ results: ad })
    
      } catch (err) {
        next(err);
      }
});


// POST /apiv1/ads
// Crea un nuevo anuncio
router.post('/' ,async (req, res, next) => {
  try {
    const adData = req.body;

    const ad = new Ad(adData);

    const adGuardado = await ad.save();

    res.status(201).json({ result: adGuardado });

  } catch (err) {
    next(err);
  }
})

module.exports = router;