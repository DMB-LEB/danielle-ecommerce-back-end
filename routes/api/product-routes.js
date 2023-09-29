const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

router.get('/', (req, res) => {
  // find all products
  Product.findAll({
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Tag,
        attributes: ['tag_name']
      }
    ]
  })
    .then(dbproductData => res.json(dbproductData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.get('/:id', (req, res) => {
  // find by product ID
  Product.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Tag,
        attributes: ['tag_name']
      }
    ]
  })
    .then(dbproductData => {
      if (!dbproductData) {
        res.status(404).json({message: 'No product found with this id'});
        return;
      }
      res.json(dbproductData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // create product
  Product.create({
     product_name: req.body.product_name,
     price: req.body.price,
     stock: req.body.stock,
     tagIds: req.body.tagIds
     })
     .then((product) => {
       if (req.body.tagIds.length) {
         const productTagIdArray = req.body.tagIds.map((tag_id) => {
           return {
             product_id: product.id,
             tag_id,
           };
         });
         return ProductTag.bulkCreate(productTagIdArray);
       }
       // no product tags
       res.status(200).json(product);
     })
     .then((productTagIds) => res.status(200).json(productTagIds))
     .catch((err) => {
       console.log(err);
       res.status(400).json(err);
     });
 });

 router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get current tag IDs
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // to remove ID
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      })
      .then((updatedProductTags) => res.json(updatedProductTags))
      .catch((err) => {
        // console.log(err);
        res.status(400).json(err);
      });
  });

  router.delete('/:id', (req, res) => {
    res.send ("Successfully deleted ID");
    // delete by ID
    Product.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(dbProductData => {
      if (!dbProductData) {
        rs.status(404).json({message: 'No product found with this id'});
        return;
      }
      res.json(dbProductData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

module.exports = router;
