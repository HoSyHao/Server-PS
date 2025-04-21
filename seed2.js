const mongoose = require("mongoose");
const Plant = require("./models/Plant");
const dotenv = require('dotenv');

dotenv.config();
const uri = process.env.ATLAS_URI;

// Dữ liệu không chứa trường id
const plantsData2 = [
  {
    category: "Air Purifying Plants",
    plants: [
      {
        name: "Snake Plant",
        image: "snake-plant.jpg",
        description: "Produces oxygen at night, improving air quality.",
        cost: "$15",
        status: "Sale",
      },
      {
        name: "Spider Plant",
        image: "spider-plant.jpg",
        description: "Filters formaldehyde and xylene from the air.",
        cost: "$12",
        status: "New Arrival",
      },
      {
        name: "Peace Lily",
        image: "peace-lilies.jpg",
        description: "Removes mold spores and purifies the air.",
        cost: "$18",
        status: "Best Seller",
      },
      {
        name: "Boston Fern",
        image: "boston-fern.jpg",
        description: "Adds humidity to the air and removes toxins.",
        cost: "$20",
        status: "Sold Out",
      },
      {
        name: "Rubber Plant",
        image: "rubber-plant.jpg",
        description: "Easy to care for and effective at removing toxins.",
        cost: "$17",
        status: "",
      },
      {
        name: "Aloe Vera",
        image: "aloe-vera.jpg",
        description: "Purifies the air and has healing properties for skin.",
        cost: "$14",
        status: "",
      },
      {
        name: "English Ivy",
        image: "english-ivy.jpg",
        description: "Removes airborne mold and improves indoor air quality.",
        cost: "$16",
        status: "",
      },
      {
        name: "Areca Palm",
        image: "areca-palm.jpg",
        description: "Natural humidifier that filters toxins from the air.",
        cost: "$22",
        status: "",
      },
      {
        name: "Dracaena",
        image: "dracaena.jpg",
        description: "Removes benzene and trichloroethylene from the air.",
        cost: "$19",
        status: "",
      },
      {
        name: "Philodendron",
        image: "philodendron.jpg",
        description: "Low-maintenance air purifier with heart-shaped leaves.",
        cost: "$13",
        status: "",
      },
      {
        name: "Chinese Evergreen",
        image: "chinese-evergreen.jpg",
        description: "Filters pollutants and thrives in low light.",
        cost: "$21",
        status: "",
      },
      {
        name: "Bamboo Palm",
        image: "bamboo-palm.jpg",
        description: "Adds moisture to the air and removes formaldehyde.",
        cost: "$23",
        status: "",
      },
    ],
  },
  {
    category: "Aromatic Fragrant Plants",
    plants: [
      {
        name: "Lavender",
        image: "lavender.jpg",
        description: "Calming scent, used in aromatherapy.",
        cost: "$20",
        status: "Sale",
      },
      {
        name: "Jasmine",
        image: "jasmine.jpg",
        description: "Sweet fragrance, promotes relaxation.",
        cost: "$18",
        status: "New Arrival",
      },
      {
        name: "Rosemary",
        image: "rosemary.jpg",
        description: "Invigorating scent, often used in cooking.",
        cost: "$15",
        status: "Sold Out",
      },
      {
        name: "Mint",
        image: "mint.jpg",
        description: "Refreshing aroma, used in teas and cooking.",
        cost: "$12",
        status: "",
      },
      {
        name: "Lemon Balm",
        image: "lemon-balm.jpg",
        description: "Citrusy scent, relieves stress and promotes sleep.",
        cost: "$14",
        status: "Best Seller",
      },
      {
        name: "Hyacinth",
        image: "hyacinth.jpg",
        description: "Hyacinth is a beautiful flowering plant known for its fragrant.",
        cost: "$22",
        status: "",
      },
      {
        name: "Gardenia",
        image: "gardenia.jpg",
        description: "Rich floral scent, often used in perfumes.",
        cost: "$24",
        status: "",
      },
      {
        name: "Thyme",
        image: "thyme.jpg",
        description: "Earthy aroma, great for cooking and relaxation.",
        cost: "$11",
        status: "",
      },
      {
        name: "Sage",
        image: "sage.jpg",
        description: "Warm, spicy scent with cleansing properties.",
        cost: "$13",
        status: "",
      },
      {
        name: "Eucalyptus",
        image: "eucalyptus.jpg",
        description: "Fresh, invigorating scent with decongestant benefits.",
        cost: "$19",
        status: "",
      },
      {
        name: "Freesia",
        image: "freesia.jpg",
        description: "Sweet, delicate fragrance from colorful blooms.",
        cost: "$21",
        status: "",
      },
      {
        name: "Lemongrass",
        image: "lemongrass.jpg",
        description: "Citrusy aroma, used in teas and insect repellents.",
        cost: "$15",
        status: "",
      },
    ],
  },
  {
    category: "Insect Repellent Plants",
    plants: [
      {
        name: "Oregano",
        image: "oregano.jpg",
        description: "The oregano plants contains compounds that can deter certain insects.",
        cost: "$10",
        status: "",
      },
      {
        name: "Marigold",
        image: "marigold.jpg",
        description: "Natural insect repellent, also adds color to the garden.",
        cost: "$8",
        status: "",
      },
      {
        name: "Geraniums",
        image: "Geraniums.jpg",
        description: "Known for their insect-repelling properties while adding a pleasant scent.",
        cost: "$20",
        status: "",
      },
      {
        name: "Basil",
        image: "basil.jpg",
        description: "Repels flies and mosquitoes, also used in cooking.",
        cost: "$9",
        status: "",
      },
      {
        name: "Lavender",
        image: "lavender.jpg",
        description: "Calming scent, used in aromatherapy.",
        cost: "$20",
        status: "",
      },
      {
        name: "Catnip",
        image: "catnip.jpg",
        description: "Repels mosquitoes and attracts cats.",
        cost: "$13",
        status: "",
      },
      {
        name: "Citronella",
        image: "citronella.jpg",
        description: "Strong lemon scent that repels mosquitoes effectively.",
        cost: "$14",
        status: "",
      },
      {
        name: "Pennyroyal",
        image: "pennyroyal.jpg",
        description: "Mint-like scent that deters fleas and ticks.",
        cost: "$12",
        status: "",
      },
      {
        name: "Chrysanthemum",
        image: "chrysanthemum.jpg",
        description: "Contains pyrethrin, a natural insect repellent.",
        cost: "$17",
        status: "",
      },
      {
        name: "Tansy",
        image: "tansy.jpg",
        description: "Bright yellow flowers that repel ants and flies.",
        cost: "$10",
        status: "",
      },
      {
        name: "Petunia",
        image: "petunia.jpg",
        description: "Colorful blooms that deter certain garden pests.",
        cost: "$11",
        status: "",
      },
      {
        name: "Allium",
        image: "allium.jpg",
        description: "Onion-like scent that keeps insects at bay.",
        cost: "$16",
        status: "",
      },
    ],
  },
  {
    category: "Medicinal Plants",
    plants: [
      {
        name: "Aloe Vera",
        image: "aloe-vera.jpg",
        description: "Soothing gel used for skin ailments.",
        cost: "$14",
        status: "",
      },
      {
        name: "Echinacea",
        image: "echinacea.jpg",
        description: "Boosts immune system, helps fight colds.",
        cost: "$16",
        status: "",
      },
      {
        name: "Peppermint",
        image: "peppermint.jpg",
        description: "Relieves digestive issues and headaches.",
        cost: "$13",
        status: "",
      },
      {
        name: "Lemon Balm",
        image: "lemon-balm.jpg",
        description: "Calms nerves and promotes relaxation.",
        cost: "$14",
        status: "",
      },
      {
        name: "Chamomile",
        image: "chamomile.jpg",
        description: "Soothes anxiety and promotes sleep.",
        cost: "$15",
        status: "",
      },
      {
        name: "Calendula",
        image: "calendula.jpg",
        description: "Heals wounds and soothes skin irritations.",
        cost: "$12",
        status: "",
      },
      {
        name: "Ginger",
        image: "ginger.jpg",
        description: "Aids digestion and reduces nausea effectively.",
        cost: "$13",
        status: "",
      },
      {
        name: "Turmeric",
        image: "turmeric.jpg",
        description: "Anti-inflammatory properties for joint health.",
        cost: "$15",
        status: "",
      },
      {
        name: "St. John's Wort",
        image: "st-johns-wort.jpg",
        description: "Supports mood balance and relieves mild depression.",
        cost: "$17",
        status: "",
      },
      {
        name: "Feverfew",
        image: "feverfew.jpg",
        description: "Helps reduce migraines and inflammation.",
        cost: "$14",
        status: "",
      },
      {
        name: "Valerian",
        image: "valerian.jpg",
        description: "Promotes sleep and reduces anxiety naturally.",
        cost: "$16",
        status: "",
      },
      {
        name: "Yarrow",
        image: "yarrow.jpg",
        description: "Supports wound healing and reduces bleeding.",
        cost: "$12",
        status: "",
      },
    ],
  },
  {
    category: "Low Maintenance Plants",
    plants: [
      {
        name: "ZZ Plant",
        image: "zzplant.jpg",
        description: "Thrives in low light and requires minimal watering.",
        cost: "$25",
        status: "",
      },
      {
        name: "Pothos",
        image: "pothos.jpg",
        description: "Tolerates neglect and can grow in various conditions.",
        cost: "$10",
        status: "",
      },
      {
        name: "Snake Plant",
        image: "snake-plant.jpg",
        description: "Needs infrequent watering and is resilient to most pests.",
        cost: "$15",
        status: "",
      },
      {
        name: "Cast Iron Plant",
        image: "cast-iron-plant.jpg",
        description: "Hardy plant that tolerates low light and neglect.",
        cost: "$20",
        status: "",
      },
      {
        name: "Succulents",
        image: "succulents.jpg",
        description: "Drought-tolerant plants with unique shapes and colors.",
        cost: "$18",
        status: "",
      },
      {
        name: "Aglaonema",
        image: "aglaonema.jpg",
        description: "Requires minimal care and adds color to indoor spaces.",
        cost: "$22",
        status: "",
      },
      {
        name: "Jade Plant",
        image: "jade-plant.jpg",
        description: "Succulent that thrives with minimal water and care.",
        cost: "$17",
        status: "",
      },
      {
        name: "Haworthia",
        image: "haworthia.jpg",
        description: "Small succulent perfect for indoor low-light spaces.",
        cost: "$14",
        status: "",
      },
      {
        name: "Air Plant",
        image: "air-plant.jpg",
        description: "No soil needed, survives with occasional misting.",
        cost: "$12",
        status: "",
      },
      {
        name: "Spathiphyllum",
        image: "spathiphyllum.jpg",
        description: "Tolerates neglect and purifies indoor air.",
        cost: "$19",
        status: "",
      },
      {
        name: "Parlor Palm",
        image: "parlor-palm.jpg",
        description: "Elegant palm that thrives in low light conditions.",
        cost: "$23",
        status: "",
      },
      {
        name: "Peperomia",
        image: "peperomia.jpg",
        description: "Compact plant with low water and light needs.",
        cost: "$15",
        status: "",
      },
    ],
  },
];

// Hàm tạo mã category
const getCategoryCode = (category) => {
  switch (category) {
    case "Air Purifying Plants":
      return "APP";
    case "Aromatic Fragrant Plants":
      return "AFP";
    case "Insect Repellent Plants":
      return "IRP";
    case "Medicinal Plants":
      return "MCP";
    case "Low Maintenance Plants":
      return "LMP";
    default:
      throw new Error(`Unknown category: ${category}`);
  }
};


const flattenedPlants2 = plantsData2.flatMap((category) => {
  const categoryCode = getCategoryCode(category.category);
  
  return category.plants.map((plant, index) => ({
    id: `PLANT${categoryCode}${(index + 1).toString().padStart(4, '0')}`, 
    category: category.category,
    name: plant.name,
    image: plant.image,
    description: plant.description,
    cost: plant.cost,
    status: plant.status,
  }));
});

async function seedDatabase() {
  try {
    await mongoose.connect(uri, {
      tls: true,
    });
    console.log("Connected to MongoDB Atlas");

    await Plant.deleteMany({});
    console.log("Cleared existing plants");

    await Plant.insertMany(flattenedPlants2);
    const count = await Plant.countDocuments({});
    console.log(`${count} Plants from seed2 imported successfully`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed");
  }
}

seedDatabase();