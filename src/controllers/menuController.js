//const Product = require("../models/productModel");
const User = require('../models/user-model')
//const productErrorHandler = require("../helpers/productErrorHandler");
const Menu = require("../models/menuModel");


//foodItem == produtCt
//Product == Food
// productName == foodName
// productCounter == foodCounter

/*ADD ITEM */
exports.addMenuItem = async (request, response) => {  
  try {
    const user = await User.findById(request.body.vendor);
    const foodItem = await Menu.findOne({ foodName: request.body.foodName }); 
    if (user && foodItem) {  
      foodItem.foodCounter += 1;
      await foodItem.save();
      return response.status(201).send({
        status: true, // check
        message: "Food count has been increased successfully!",
        ToReturn: foodItem 
      })
    } else if (user && !foodItem) {
        const food = new Menu(request.body)
        await food.save();
        return response.status(201).send({
                status: true, // check
                message: "Food item has been uploaded successfully! ",
                ToReturn: food,
        })
    }
  } catch (error) {
    const err = productErrorHandler(error);
    return response.status(404).json({ err });
  }
};

// exports.createProduct = async (request, response) => {  
//   try {
//     const user = await User.findById(request.body.vendor);
//     const productCt = await Product.findOne({ productName: request.body.productName }); 
//     if (user && productCt) {  
//       productCt.productCounter += 1;
//       await productCt.save();
//       return response.status(201).send({
//         status: true, // check
//         message: "product count has been increased successfully",
//         productCtToReturn: productCt 
//       })
//     } else if (user && !productCt) {
//         const product = new Product(request.body)
//         await product.save();
//         return response.status(201).send({
//                 status: true, // check
//                 message: "product has been uploaded successfully",
//                 productToReturn: product,
//         })
//     }
//   } catch (error) {
//     const err = productErrorHandler(error);
//     return response.status(404).json({ err });
//   }
// };

/*UPDATE FOOD ITEM */
exports.updateMenuItem = async (request, response) => {
  try {
    //find product = find item
    const findItem = await Menu.findById(request.params.id);
    console.log(findItem)
    if (findItem) {
      findItem.price = request.body.price;
      findItem.description = request.body.description;
      findItem.images = request.body.images;
      await findItem.save();
      return response.status(200).send({
        status: true,
        message: "Menu has been updated successfully!",
        updatedItem: findItem,
      });
    } else {
      return response.status(404).send({
        status: false,
        message: "Item not found!",
      });
    }
  } catch (error) {
    const err = productErrorHandler(error);
    return response.status(400).json({ err });
  }
};




// exports.updateProduct = async (request, response) => {
//   try {
//     const findProduct = await Product.findById(request.params.id);
//     console.log(findProduct)
//     if (findProduct) {
//       findProduct.price = request.body.price;
//       findProduct.description = request.body.description;
//       findProduct.images = request.body.images;
//       await findProduct.save();
//       return response.status(200).send({
//         status: true,
//         message: "Product has been updated successfully",
//         updatedProduct: findProduct,
//       });
//     } else {
//       return response.status(404).send({
//         status: false,
//         message: "Product not found",
//       });
//     }
//   } catch (error) {
//     const err = productErrorHandler(error);
//     return response.status(400).json({ err });
//   }
// };


/*GET SINGLE FOOD ITEM */
exports.getMenuItem= async (request, response) => {
    try {
      const id = request.params.id;
      const findOneItem = await Menu.findById(id);
      if (!findOneItem) {
        return response.status(404).send({
          status: false,
          message: "Item not found!",
        });
      } else {
        return response.status(200).send({
          status: true,
          message: "Item found!",
          Item: findOneItem,
        });
      }
    } catch (err) {
        return response.status(401).send({
          status: false,
          message: "Invalid ID",
        });
    }
  } 
  

  /*GET ALL FOOD ITEMS */
exports.getMenuItems = async (request, response) => {
    try {
      const foodItem = await Menu.find({
        foodName: request.body.foodName,
      });

      if(foodItem) {
       foodItem.productCounter += 1;
      }
      const findAllItems = await Menu.find();
      return response.status(200).send({
        status: true,
        message: "All Items In The Menu",
        itemListing: findAllItems,
        counts: findAllItems.length,
        foodCounter: findAllItems.foodCounter
      });
    } catch (error) {
      const err = productErrorHandler(error);
      return response.status(400).json({ err });
    }
  }


/*DELETE FOOD ITEM */
exports.deleteMenuItem = async (request, response) => {
  try {
    const id  = request.params.id;
    const findItem = await Menu.findById(id)
    if (findItem.foodCounter > 1) {
      findItem.foodCounter -= 1;
      await findItem.save();
      return response.status(200).send({
        status: true,
        message: `${findItem.foodName} has been removed from the Menu!`,
        deletedItem: findItem,
      });
    }else if (findItem.foodCounter === 1){
      findItem.deleteOne();
      return response.status(200).send({
        status: true,
        message: "Item deleted successfully!",
        deletedItem: findItem,
      })
    } else if (!findItem) {
      return response.status(404).send({
        status: false,
        message: "Item not found! ",
      });
    }
  } catch (error) {
    const err = productErrorHandler(error);
    return response.status(400).json({ err });
  }
};
