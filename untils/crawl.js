const axios = require('axios');
const cheerio = require('cheerio');
const slug = require('slugify');
const Product = require('../models/Product'); // Import your Product model

async function fetchPageData(pageNumber) {
    const url = `https://teelab.vn/collections/all?q=&page=${pageNumber}&view=grid`;

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const products = [];

        $('.products-view .item_product_main').each((index, element) => {
            const productName = $(element).find('.product-name').text();
            const productSale = $(element).find('.product-thumbnail.sale').attr('data-sale');
            const productLink = 'https://teelab.vn/' + convertToSlug(productName);
            console.log('Product Link:', productLink);
            products.push({ link: productLink, sale: productSale });
        });

        for (const product of products) {
            await processProductDetail(product);
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
    }
}

async function processProductDetail(productData) {
    try {
        const response = await axios.get(productData.link);
        const html = response.data;
        const $ = cheerio.load(html);

        const productName = $('.title-head').text();
        const productPrice = $('.product-price').text();
        const productOldPrice = $('del.price.product-price-old').text().trim();
        const productDescription = $('.ba-text-fpt').html();
        const colorData = extractColorData($);
        const imageUrls = extractImage($);

        const productCategory = extractCategory(productName);

        if (productName !== '') {
            await Product.create({
                name: productName,
                price: productPrice,
                oldPrice: productOldPrice,
                description: productDescription,
                images: imageUrls,
                colors: colorData,
                category: productCategory,
                sale: productData.sale
            });
            console.log('Product saved:', productName);
        }
    } catch (error) {
        console.log('Error processing product detail:', error);
    }
}
function convertToSlug(text) {
    return slug(text, {
        lower: true,
        remove: /[*+~.()'"!:@]/g
    });
}

function extractImage($) {
    const imageUrls = [];
    $('.swiper-slide').each((index, element) => {
        const imageUrl = $(element).find('img').attr('data-image');
        if (imageUrl) {
            imageUrls.push(imageUrl);
        }
    });
    return imageUrls;

}
function extractColorData($) {
    const colorData = [];
    $('.swatch-element.color').each((index, element) => {
        const colorName = $(element).data('value');
        const colorImage = $(element).find('label').attr('data-image');

        if (colorName && colorImage) {
            colorData.push({
                name: colorName,
                image: colorImage,
            });
        }
    });

    return colorData;
}
function extractCategory(name) {
    if (name.includes('Áo Thun')) {
        return '64e614e38ff753137682cc94';
    } else if (name.includes('Áo Polo')) {
        return '64e6150e8ff753137682cc95';
    } else if (name.includes('Áo Sơ Mi')) {
        return '64e6152e8ff753137682cc96';
    } else if (name.includes('Áo Khoác')) {
        return '64e6157d8ff753137682cc9a';
    } else if (name.includes('Hoodie')) {
        return '64e615528ff753137682cc97';
    } else if (name.includes('Quần')) {
        return '64e6155e8ff753137682cc98';
    } else {
        return '64e6156a8ff753137682cc99';
    }
}


module.exports = fetchPageData;
