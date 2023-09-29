const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', (req, res) => {
    // find all categories
  Category.findAll ({
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  })
  .then (catData => res.json (catData))
  .catch(err => {
    console.log (err);
    res.status(500).json(err);
  })
});

  router.get('/:id', (req, res) => {
      // find by category ID
    Category.findOne ({
      where: {
        id: req.params.id
      },
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    })
    .then (catData => res.json (catData))
    .catch(err => {
      console.log (err);
      res.status(500).json(err);
    })
  });
  
router.post('/', (req, res) => {
    // create category
  Category.create({
    category_name: req.body.category_name
  })
  .then(catData => res.json(catData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update category ID
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
  // delete category by ID
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
