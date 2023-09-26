const router = require('express').Router();
const { Category, Product } = require('../../models');

  // be sure to include its associated Products

  //ABLE TO GET CATEGORIES WITH INSOMNIA
router.get('/', (req, res) => {
  Category.findAll ({
    include: {
      model: Product,
      attributes: ['product_name']
    }
  })
  .then (catData => res.json (catData))
  .catch(err => {
    console.log (err);
    res.status(500).json(err);
  })
});

// ABLE TO GET ID WITH INSOMNIA
  router.get('/:id', (req, res) => {
    Category.findOne ({
      where: {
        id: req.params.id
      },
      include: {
        model: Product,
        attributes: ['product_name']
      }
    })
    .then (catData => res.json (catData))
    .catch(err => {
      console.log (err);
      res.status(500).json(err);
    })
    // find one category by its `id` value
    // be sure to include its associated Products
  });
  

router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })
  .then(catData => res.json(catData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  // create a new category
});

router.put('/:id', (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(catData => {
      if (!catData) {
        res.status(404).json({message:'No category associated with id'});
        return;
      }
      res.json(catData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(catData => {
    if (!catData) {
      res.status(404).json({message:'No category associated with id'});
      return;
    }
    res.json(catData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
