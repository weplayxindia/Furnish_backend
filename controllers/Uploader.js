const csvtojson = require('csvtojson');
const fs = require('fs');
const Category = require('../models/category'); 
const Product = require('../models/product'); 
const Subcategory = require('../models/subcategory');

exports.uploader = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const filePath = req.file.path;
        let allRecords = [];

        
        csvtojson()
            .fromFile(filePath)
            .then(async (csvData) => {
                for (let i = 0; i < csvData.length; i++) {
                    const categoryName = csvData[i]['Category'];
                    const subcategoryName = csvData[i]['Subcategory'];

                    
                    let category = await Category.findOne({ name: categoryName });
                    if (!category) {
                        category = new Category({ name: categoryName });
                        await category.save();
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
                    }

                    
                    allRecords.push({
                        name: csvData[i]['Name'],
                        description: csvData[i]['Description'],
                        images: [
                            { url: csvData[i]['Image URL 1'], altText: csvData[i]['Image Alt Text 1'] || '' },
                            { url: csvData[i]['Image URL 2'], altText: csvData[i]['Image Alt Text 2'] || '' }
                        ],
                        price: parseFloat(csvData[i]['Price']),
                        sizes: [
                            { size: csvData[i]['Size 1'], dimensions: csvData[i]['Dimensions 1'] },
                            { size: csvData[i]['Size 2'], dimensions: csvData[i]['Dimensions 2'] }
                        ],
                        woodFinish: csvData[i]['Wood Finish'].split(',').map(finish => finish.trim()),
                        subcategory: subcategory._id,  
                        stock: parseInt(csvData[i]['Stock'], 10) || 0
                    });
                }

                
                try {
                    const result = await Product.insertMany(allRecords);
                    console.log('Data inserted successfully:', result);
                } catch (dbError) {
                    console.error('Error inserting data into MongoDB:', dbError);
                    res.status(500).send('Error inserting data into MongoDB.');
                    return;
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
}
