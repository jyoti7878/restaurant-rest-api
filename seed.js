require('dotenv').config();

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');
const config = require('./config/config');

const dishes = [
  {
    name: 'Uthappizza',
    image: 'images/uthappizza.png',
    category: 'mains',
    label: 'Hot',
    price: 499,
    featured: true,
    description: 'A unique combination of Indian Uthappam and Italian pizza.'
  },
  {
    name: 'Zucchipakoda',
    image: 'images/zucchipakoda.png',
    category: 'appetizer',
    label: '',
    price: 199,
    featured: false,
    description: 'Deep fried Zucchini with chickpea batter.'
  }
];

const promotions = [
  {
    name: 'Weekend Grand Buffet',
    image: 'images/buffet.png',
    label: 'New',
    price: 1999,
    featured: true,
    description: 'Featuring mouthwatering combinations with a choice of five different salads, six enticing appetizers, six main entrees and five choicest desserts.'
  }
];

const leaders = [
  {
    name: 'Peter Pan',
    image: 'images/alberto.png',
    designation: 'Chief Epicurious Officer',
    abbr: 'CEO',
    featured: true,
    description: 'Our CEO credits his hardworking East Asian immigrant parents who undertook the arduous journey to the shores of America.'
  }
];

async function seed() {
  await mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  await Promise.all([
    Dishes.deleteMany({}),
    Promotions.deleteMany({}),
    Leaders.deleteMany({})
  ]);
  await Dishes.insertMany(dishes);
  await Promotions.insertMany(promotions);
  await Leaders.insertMany(leaders);
  await mongoose.disconnect();
  console.log('Seed data inserted');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
