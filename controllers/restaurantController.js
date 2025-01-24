const {Restaurant} = require('../models');
const categories = ['Italian', 'Fast Food', 'Food'];

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

module.exports.viewAll = async function (req, res, next) {
    let searchCategories = ['All'];
    let searchRandom = req.query.random || false;
    for(let i = 0; i<categories.length; i++){
        searchCategories.push(categories[i]);
    }
    let restaurants;
    let searchCategory = req.query.category || 'All';
    if(searchCategory === 'All'){
        restaurants = await Restaurant.findAll();
    } else {
        restaurants = await Restaurant.findAll( {
            where:
                {
                    category: searchCategory
                }
        });
    }
    if(restaurants.length > 0 && searchRandom){
        let randomIndex = getRandomInt(restaurants.length);
        restaurants = [restaurants[randomIndex]];
    }
    res.render('index', {restaurants, categories:searchCategories, searchCategory, searchRandom});
}

module.exports.renderEditForm = async function (req, res, next) {
    const restaurant = await Restaurant.findByPk(
        req.params.id
    );
    res.render('edit', {restaurant, categories});
}

module.exports.updateRestaurant = async function (req, res, next) {
    await Restaurant.update(
        {
            name: req.body.name,
            category: req.body.category,
            rating: req.body.rating,
            image: req.body.image,
            description: req.body.description
        },
        {
            where:
                {
                    id: req.params.id
                }
        });
    res.redirect('/');
}

module.exports.deleteRestaurant = async function (req, res, next) {
    await Restaurant.destroy(
        {
        where:
            {
                id: req.params.id
            }
    });
    res.redirect('/');
}

module.exports.renderAddForm = async function (req, res, next) {
    const restaurant = {
        name: '',
        description: '',
        rating: 1,
        image: '',
        category: categories[0],
    };
    res.render('add', {restaurant, categories});
}

module.exports.addRestaurant = async function (req, res, next) {
    await Restaurant.create(
        {
            name: req.body.name,
            category: req.body.category,
            rating: req.body.rating,
            image: req.body.image,
            description: req.body.description
        });
    res.redirect('/');
}