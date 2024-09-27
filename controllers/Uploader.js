const csvtojson = require('csvtojson');
const fs = require('fs');
const Category = require('../models/category');
const Product = require('../models/product');
const Subcategory = require('../models/subcategory');
const path = require("path");
const { uploadToCloudinary } = require('../utils/uploader');

exports.uploader = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const imageFolderPath = req.body.imageFolderPath;
        console.log("Imagefolderpath : ", imageFolderPath);

        const filePath = req.file.path;
        let allRecords = [];
        if (!imageFolderPath) {
            return res.status(400).send("No image folder path provided.");
        }

        csvtojson()
            .fromFile(filePath)
            .then(async (csvData) => {
                for (let i = 0; i < csvData.length; i++) {
                    const categoryName = csvData[i]['Category'];
                    const subcategoryName = csvData[i]['Subcategory'];
                    let priceValue = csvData[i]['Price'];

                    priceValue = priceValue.replace(/[^\d.]/g, '').trim();

                    if (!categoryName) {
                        console.error(`Category name is missing for record at index ${i}:`, csvData[i]);
                        continue; 
                    }

                    let category = await Category.findOne({ name: categoryName });
                    if (!category) {
                        category = new Category({ name: categoryName });
                        await category.save();
                    }

                    if (!subcategoryName) {
                        console.error(`Subcategory name is missing for record at index ${i}:`, csvData[i]);
                        continue; 
                    }

                    let subcategory = await Subcategory.findOne({
                        name: subcategoryName,
                        category: category._id
                    });
                    if (!subcategory) {
                        subcategory = new Subcategory({
                            name: subcategoryName,
                            category: category._id
                        });
                        await subcategory.save();
                        category.subcategories.push(subcategory._id);
                        await category.save(); 
                    }

                    const price = parseFloat(priceValue);
                    if (isNaN(price)) {
                        console.error(`Invalid price for record at index ${i}:`, csvData[i]);
                        continue;
                    }

                    const oldSku = csvData[i]['OLD SKU'];
                    if (!oldSku) {
                        console.error(`Missing OLD SKU for record ${i}`);
                        continue;
                    }

                    const productImagePath = path.join(imageFolderPath, oldSku);
                    const images = [];

                    try {
                        if (!fs.existsSync(productImagePath)) {
                            console.error('Directory does not exist:', productImagePath);
                            continue;
                        }

                        const files = await fs.promises.readdir(productImagePath);

                        for (const file of files) {
                            let imagePath = path.join(productImagePath, file);
                            imagePath = imagePath.replace(/\\/g, "/");
                            console.log("imagePath ", imagePath);

                            if (fs.existsSync(imagePath)) {
                                const uploadImage = await uploadToCloudinary(imagePath, "Furniture");
                                images.push(uploadImage.secure_url);
                            } else {
                                console.error('File does not exist:', imagePath);
                            }
                        }
                    } catch (error) {
                        console.error('Error reading or uploading images:', error);
                        continue;
                    }

                    console.log("Images for product: ", images);
                    
                    
                    if (images.length > 0) {
                        const newProduct = new Product({
                            name: csvData[i]['Name'],
                            description: csvData[i]['Description'],
                            images: images.map(url => ({ url })), 
                            price,
                            sizes: [
                                { size: csvData[i]['Size 1'], dimensions: csvData[i]['Dimensions 1'] },
                                { size: csvData[i]['Size 2'], dimensions: csvData[i]['Dimensions 2'] }
                            ],
                            woodFinish: csvData[i]['Wood Finish'].split(',').map(finish => finish.trim()),
                            subcategory: subcategory._id,
                            stock: parseInt(csvData[i]['Stock'], 10) || 0
                        });

                        const savedProduct = await newProduct.save();
                        subcategory.products.push(savedProduct._id); 
                        await subcategory.save();
                        allRecords.push(savedProduct);
                    } else {
                        console.warn(`No images uploaded for product at index ${i}:`, csvData[i]);
                    }
                }

                fs.unlinkSync(filePath); 
                res.status(200).send('File uploaded and product data successfully inserted into MongoDB');
            })
            .catch((err) => {
                console.error('Error parsing CSV:', err);
                res.status(500).send('Error parsing CSV file.');
            });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).send('Error during file upload.');
    }
};









// exports.uploader = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send("No file uploaded.");
//         }

//         const imageFolderPath = req.body.imageFolderPath;
        

//         const filePath = req.file.path;

//         csvtojson()
//             .fromFile(filePath)
//             .then(async (csvData) => {
//                 for (let i = 0; i < csvData.length; i++) {
//                     const oldSku = csvData[i]['OLD SKU'];

//                     if (!oldSku) {
//                         console.error(`Missing OLD SKU for record ${i}`);
//                         continue;
//                     }

//                     const productImagePath = path.join(imageFolderPath, oldSku);

//                     const images = [];

//                     try {
//                         if (!fs.existsSync(productImagePath)) {
//                             console.error('Directory does not exist:', productImagePath);
//                             continue;
//                         }

//                         const files = await fs.promises.readdir(productImagePath);

//                         for (const file of files) {
//                             let imagePath = path.join(productImagePath, file);

//                             // Replace backslashes with forward slashes
//                             imagePath = imagePath.replace(/\\/g, "/");
//                             console.log("imagePath ", imagePath);

//                             // Ensure file exists before upload
//                             if (fs.existsSync(imagePath)) {
//                                 const uploadImage = await uploadToCloudinary(imagePath, "Furniture");
//                                 images.push(uploadImage.secure_url);
//                             } else {
//                                 console.error('File does not exist:', imagePath);
//                             }
//                         }
//                     } catch (error) {
//                         console.error('Error reading or uploading images:', error);
//                         continue;
//                     }

//                     console.log("Images for product: ", images);
//                 }

//                 fs.unlinkSync(filePath); 
//                 res.status(200).send('File uploaded and product data successfully inserted into MongoDB');
//             })
//             .catch((err) => {
//                 console.error('Error parsing CSV:', err);
//                 res.status(500).send('Error parsing CSV file.');
//             });
//     } catch (error) {
//         console.error('Error during file upload:', error);
//         res.status(500).send('Error during file upload.');
//     }
// };
