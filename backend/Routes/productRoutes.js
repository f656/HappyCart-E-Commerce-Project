const express = require("express");
const Product = require("../Models/Product");

const { protect, admin } = require("../Middleware/authMiddleware");

const router = express.Router();

// @route Post /api/products
// @desc Create a new product
// @access Private

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, //Reference to the admin user who created it
    });
    const createdProduct = await product.save();
    res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route PUT /api/products/:id
// @desc Update an existing product
// @access Private

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    //Find product by ID
    const product = await Product.findById(req.params.id);
    if (product) {
      //Update Product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      //Save updated product
      const updatedProduct = await product.save();
      res.json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      res.status(404).json({ msg: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@route DELETE /api/products/:id
// @desc Delete an existing product
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    //Find product by ID
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ msg: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;
    let query = {};
    // Filter logic
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }
    if (color) {
      query.colors = { $in: [color] };
    }
    if (gender) {
      query.gender = gender;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    //Sort logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    //Fetch products and  apply sorting and limit
    let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
    res.status(200).json({success:true,msg:"Product Fetched Successfully",products});
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});



//@route Get /api/products/best-seller
// @desc Get the best-selling products with highest rating
// @access Public
router.get("/best-seller", async (req, res) => {
  try {
     const bestSeller = await Product.findOne().sort({ rating: -1});
     if (bestSeller) {
       res.json({success:true,msg:"Best Seller fetched successfully",bestSeller});
     } else {
       res.status(404).json({ msg: "No best seller found" });
     }
  } catch (error) {
     console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

//@route GET/api/products/new-arrival
//@desc retrieve latest 8 product -creation date
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    //Fetch 8 latest products
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json({success:true,msg:"New Arrivals fetched successfully",newArrivals});
  } catch (error) {
     console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
})



// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json({success:true,msg:"Single Product fetched successfully",product});
    } else {
      res.status(404).json({ msg: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

//@route GET /api/products/similar/:id
// @desc Get similar products based on a given product  gender and category
// @access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  try {
     const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({success:false, msg: "Product not found" });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id }, //Exclude the current product Id
      gender: product.gender, //Similar products must have the same gender
      category: product.category, //Similar products must have the same category
    }).limit(4); //Limit the results to 4
    res.json({ success:true, msg:"Similar Products fetched successfully", similarProducts });
  } catch (error) {
     console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
})



module.exports = router;
