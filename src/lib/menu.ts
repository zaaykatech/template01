import type { MenuItem, MenuSection } from '@/types';

export const rawMenuSections: MenuSection[] = [
  {
    "id": "classic-espresso-bar",
    "title": "Classic Espresso Bar",
    "items": [
      {
        "name": "Espresso (Hot/Iced)",
        "price": 100,
        "description": "Pure extraction"
      },
      {
        "name": "Americano (Hot/Iced)",
        "price": 140,
        "description": "Espresso & hot water"
      },
      {
        "name": "Cappuccino (Hot/Iced)",
        "price": 160,
        "description": "Foam & espresso"
      },
      {
        "name": "Latte (Hot/Iced)",
        "price": 170,
        "description": "Steamed milk heavy"
      },
      {
        "name": "Cortado (Hot/Iced)",
        "price": 190,
        "description": "This delightful duet of espresso and steamed milk is like a sophisticated dance on your palate"
      },
      {
        "name": "Flat White (Hot/Iced)",
        "price": 200,
        "description": "It is like a love letter from espresso to milk- bold, smooth and perfectly balanced in every sip"
      },
      {
        "name": "Mocha (Hot/Iced)",
        "price": 220,
        "description": "A sweet symphony of espresso, velvety chocolate, and milk, finished with a swirl of whipped cream"
      }
    ]
  },
  {
    "id": "craft-coffees",
    "title": "Craft Coffees",
    "items": [
      {
        "name": "Irish Cappuccino (Hot/Iced)",
        "price": 220,
        "isMostOrdered": true
      },
      {
        "name": "Caramel Latte (Hot/Iced)",
        "price": 230
      },
      {
        "name": "Hazelnut Cappuccino (Hot/Iced)",
        "price": 220
      },
      {
        "name": "French Vanilla Cappuccino (Hot/Iced)",
        "price": 210
      },
      {
        "name": "Dark Chocolate Mocha (Hot/Iced)",
        "price": 240
      },
      {
        "name": "Saffron Turmeric Latte (Hot/Iced)",
        "price": 250,
        "isMostOrdered": true
      },
      {
        "name": "Tiramisu Cappuccino (Hot/Iced)",
        "price": 260
      },
      {
        "name": "Lotus Biscoff Latte (Hot/Iced)",
        "price": 250
      },
      {
        "name": "Classic Iced Coffee",
        "price": 250
      },
      {
        "name": "Vietnamese Iced Coffee",
        "price": 260,
        "isMostOrdered": true
      },
      {
        "name": "Red Velvet Mocha",
        "price": 250,
        "customTag": "Barista's Choice"
      }
    ]
  },
  {
    "id": "frappe-to-go",
    "title": "Frappe To Go",
    "items": [
      {
        "name": "Hazelnut Frappe",
        "price": 230
      },
      {
        "name": "Irish Frappe",
        "price": 230,
        "isMostOrdered": true
      },
      {
        "name": "Java Chip Frappe",
        "price": 250
      },
      {
        "name": "Toffee Caramel Frappe",
        "price": 230
      },
      {
        "name": "Tiramisu Frappe",
        "price": 260
      },
      {
        "name": "Biscoff Frappe",
        "price": 250
      },
      {
        "name": "Brownie Frappe",
        "price": 250
      },
      {
        "name": "9:50 Signature Frappe",
        "price": 220,
        "description": "Your go-to strong cold coffee with a hint of vanilla, designed to relish anytime and every time",
        "isSignature": true
      }
    ]
  },
  {
    "id": "cold-brews",
    "title": "Cold Brews",
    "subtitle": "slow-steeped extracted coffee known for its bold flavour, smooth finish, and low acidity-your all-day iced companion.",
    "items": [
      {
        "name": "Pomegranate Cold Brew",
        "price": 230
      },
      {
        "name": "Orange Cold Brew",
        "price": 230
      },
      {
        "name": "Classic Espresso Tonic (E&T)",
        "price": 220,
        "description": "An evergreen blend of rich espresso and sparkling tonic water"
      },
      {
        "name": "Ginger Ale Cold Brew",
        "price": 220
      },
      {
        "name": "Pineapple Cold Brew",
        "price": 230
      },
      {
        "name": "Whisky Cold Brew",
        "price": 280,
        "description": "Crafted from 16 hours of brewing barrel-aged beans, this strong cold brew offers deep and rich flavors.",
        "isMostOrdered": true
      },
      {
        "name": "Fizzy Coconut Cold Brew",
        "price": 260
      },
      {
        "name": "9:50 Signature Cold Brew",
        "price": 270,
        "description": "A drool-worthy blend of refreshing juices, vibrant fruit chunks, and our house blend cold brew.",
        "isSignature": true
      }
    ]
  },
  {
    "id": "affogato",
    "title": "Affogato",
    "subtitle": "An Italian classic: vanilla gelato bathed in warm espresso, creating a swirl of sweetness, warmth, and smooth coffee magic.",
    "items": [
      {
        "name": "Classic Affogato",
        "price": 220
      },
      {
        "name": "Dark Chocolate Affogato",
        "price": 240
      },
      {
        "name": "Caramel Pistachio Affogato",
        "price": 240,
        "isMostOrdered": true
      },
      {
        "name": "9:50 Signature Affogato",
        "price": 250,
        "description": "Classic Affogato gets a vibrant makeover with an assortment of fresh fruits.",
        "isSignature": true
      }
    ]
  },
  {
    "id": "matcha",
    "title": "Matcha",
    "items": [
      {
        "name": "Matcha Latte",
        "price": 220
      },
      {
        "name": "Iced Matcha",
        "price": 220
      },
      {
        "name": "Matcha Frappe",
        "price": 230
      },
      {
        "name": "Mango Matcha Latte",
        "price": 250
      },
      {
        "name": "Strawberry Matcha Latte",
        "price": 250
      },
      {
        "name": "Coconut Matcha Latte",
        "price": 260,
        "isMostOrdered": true
      },
      {
        "name": "Lavender Love Matcha",
        "price": 260
      },
      {
        "name": "Caramel Matcha Latte",
        "price": 270
      }
    ]
  },
  {
    "id": "hot-teas",
    "title": "Hot teas",
    "items": [
      {
        "name": "Classic Masala Chai",
        "price": 80
      },
      {
        "name": "Moroccan Mint Tea",
        "price": 150,
        "description": "Soothing green tea infused with fresh mint."
      },
      {
        "name": "Lemon Ginger Tea",
        "price": 140
      },
      {
        "name": "Lavender Earl Grey Tea",
        "price": 180,
        "description": "Experience the tradition of black tea blended with calming lavender and traditional Earl Grey notes.",
        "isMostOrdered": true
      }
    ]
  },
  {
    "id": "iced-teas",
    "title": "Iced teas",
    "items": [
      {
        "name": "Lemon Iced Tea",
        "price": 160
      },
      {
        "name": "Peach Iced Tea",
        "price": 180
      },
      {
        "name": "Irish Iced Tea",
        "price": 190
      },
      {
        "name": "Hibiscus Iced Tea",
        "price": 220,
        "isMostOrdered": true
      },
      {
        "name": "Hibiscus Strawberry Iced Tea",
        "price": 250,
        "customTag": "trending"
      },
      {
        "name": "Earl Grey Iced Tea",
        "price": 250
      },
      {
        "name": "Green Apple Iced Tea",
        "price": 200
      }
    ]
  },
  {
    "id": "hot-chocolate",
    "title": "Hot Chocolate",
    "items": [
      {
        "name": "Classic Hot Chocolate",
        "price": 210
      },
      {
        "name": "Spiced Hot Chocolate",
        "price": 230,
        "description": "Adding a touch of spice with cinnamon to the classic hot chocolate, making it a perfect warm drink for chilly days."
      },
      {
        "name": "Nutella Hot Chocolate",
        "price": 250
      },
      {
        "name": "Tiramisu Hot Chocolate",
        "price": 270,
        "isMostOrdered": true
      }
    ]
  },
  {
    "id": "shakes",
    "title": "Milk Shakes",
    "items": [
      {
        "name": "Oreo Shake",
        "price": 220
      },
      {
        "name": "Kitkat Shake",
        "price": 220
      },
      {
        "name": "Strawberry Shake",
        "price": 230
      },
      {
        "name": "French Vanilla Shake",
        "price": 240
      },
      {
        "name": "Brownie Shake",
        "price": 260
      },
      {
        "name": "Nutella Shake",
        "price": 270
      },
      {
        "name": "Lotus Biscoff Shake",
        "price": 270
      },
      {
        "name": "Blueberry Cheesecake Shake",
        "price": 300
      },
      {
        "name": "Tropical Avocado Shake",
        "price": 320,
        "description": "A silky-smooth shake made with creamy avocado, tropical pineapple, and a touch of mango-pure bliss in a glass.",
        "isMostOrdered": true
      },
      {
        "name": "Red Velvet Shake",
        "price": 300,
        "customTag": "Newly added"
      },
      {
        "name": "Rose Pistachio Shake",
        "price": 340,
        "customTag": "trending"
      }
    ]
  },
  {
    "id": "craft-mocktails",
    "title": "Craft Mocktails",
    "items": [
      {
        "name": "Virgin Mojito",
        "price": 180
      },
      {
        "name": "Masala Lemonade",
        "price": 190
      },
      {
        "name": "Watermelon Mojito",
        "price": 200
      },
      {
        "name": "Coffee Lemonade",
        "price": 220,
        "description": "A zesty, caffeinated kick that's bold, bright, and totally refreshing.",
        "isMostOrdered": true
      },
      {
        "name": "Cinderella",
        "price": 230,
        "description": "A refreshing fusion of pomegranate and mint, topped with soda."
      },
      {
        "name": "Passionate Love",
        "price": 240,
        "description": "An addictive blend of passion fruit and citrus flavours, a drink that's as refreshing and full of love as it sounds."
      },
      {
        "name": "Raspberry Lemonade",
        "price": 250
      },
      {
        "name": "Mango Chilli Cooler",
        "price": 280
      },
      {
        "name": "Strawberry Espresso Tonic",
        "price": 260,
        "customTag": "Barista's Choice"
      }
    ]
  },
  {
    "id": "blue-dream",
    "title": "Blue Dream",
    "subtitle": "Blue pea, our café's botanical gem, brings a soft floral fragrance and a naturally brilliant blue color that transforms every beverage into a little moment of magic.",
    "items": [
      {
        "name": "Blue Pea Iced Latte",
        "price": 200
      },
      {
        "name": "Blue Pea Sparkler",
        "price": 240,
        "description": "A fizzy, floral delight with the refreshing taste of blue pea flower, sophisticated with a touch of tonic water.",
        "isMostOrdered": true
      },
      {
        "name": "Blue Pea Coconut Cooler",
        "price": 270
      },
      {
        "name": "Blue Pea Matcha Smoothie",
        "price": 300
      }
    ]
  },
  {
    "id": "healthy-juices",
    "title": "Healthy Juices",
    "items": [
      {
        "name": "Carrot Ginger Juice",
        "price": 180
      },
      {
        "name": "Watermelon Mint Juice",
        "price": 200
      },
      {
        "name": "ABC",
        "price": 250,
        "description": "A refreshing blend of red apple, beetroot, and English carrot, this juice is as delicious as it is nutritious.",
        "isMostOrdered": true
      },
      {
        "name": "ABO (Apple, Beetroot and Orange) Juice",
        "price": 250,
        "customTag": "Barista's Choice"
      }
    ]
  },
  {
    "id": "smoothies",
    "title": "Smoothies",
    "items": [
      {
        "name": "Mango Madness Smoothie",
        "price": 280
      },
      {
        "name": "Berry Powerful Smoothie",
        "price": 300,
        "description": "Dreamy blend of assorted berries, milk, and curd.",
        "isMostOrdered": true
      },
      {
        "name": "Nutty Buddy Smoothie",
        "price": 310,
        "description": "Nutritious mix of peanut butter, dark chocolate, curd, and cocoa on top."
      },
      {
        "name": "Avocado Coconut Smoothie",
        "price": 340
      },
      {
        "name": "9:50 Signature Smoothie",
        "price": 350,
        "description": "Fresh fruits, curd, and milk come together to create an utterly satisfying experience.",
        "isSignature": true
      }
    ]
  },
  {
    "id": "beverage-companions",
    "title": "Beverage Companions",
    "items": [
      {
        "name": "Red Velvet Cookie",
        "price": 150
      },
      {
        "name": "Brookie (Cookie with a Brownie Twist)",
        "price": 130
      },
      {
        "name": "Classic Avocado Toast",
        "price": 250,
        "isMostOrdered": true
      },
      {
        "name": "Pesto Ricotta Toast",
        "price": 300
      }
    ]
  },
  {
    "id": "healthy-salads",
    "title": "Healthy Salads",
    "items": [
      {
        "name": "Classic Caesar Salad",
        "price": 250,
        "description": "The perfect balance of crisp lettuce, creamy dressing, and crunchy croutons, always a classic!"
      },
      {
        "name": "Greek Salad",
        "price": 280,
        "description": "A vibrant mix of exotic vegetables and Mediterranean flavors, making healthy feel like a treat!",
        "isMostOrdered": true
      },
      {
        "name": "Yogurt Salad",
        "price": 300
      },
      {
        "name": "Peri Peri Paneer Salad",
        "price": 320
      }
    ]
  },
  {
    "id": "bites-for-sides",
    "title": "Bites for Sides",
    "items": [
      {
        "name": "Nachos with Salsa",
        "price": 200
      },
      {
        "name": "Overloaded Nachos",
        "price": 220,
        "description": "Crispy nachos loaded with vibrant salsa, veggies and ultimately crowned with cheese and jalapeño sauce."
      },
      {
        "name": "Cherry Tomato & Cottage Cheese Bruschetta",
        "price": 250
      },
      {
        "name": "Pesto Cottage Cheese in Focaccia Bread",
        "price": 320,
        "isMostOrdered": true
      },
      {
        "name": "Paneer Tikka in Focaccia Bread",
        "price": 340,
        "customTag": "chiefs choice"
      },
      {
        "name": "Sourdough Mushroom Melt with Pesto Sauce",
        "price": 350,
        "customTag": "chiefs choice"
      }
    ]
  },
  {
    "id": "fries-corner",
    "title": "Fries Corner",
    "items": [
      {
        "name": "Simply Salted Fries",
        "price": 160
      },
      {
        "name": "Potato Wedges",
        "price": 220
      },
      {
        "name": "Parmesan Truffle Fries",
        "price": 230
      },
      {
        "name": "Peri Peri Fries",
        "price": 210
      },
      {
        "name": "Onion Rings",
        "price": 220
      },
      {
        "name": "Cheese Garlic Fries",
        "price": 220,
        "isMostOrdered": true
      }
    ]
  },
  {
    "id": "sandwiches",
    "title": "Sandwiches",
    "items": [
      {
        "name": "Bombay Kaccha/Grilled Sandwich",
        "price": "170/190"
      },
      {
        "name": "Cheese Chutney Sandwich",
        "price": 200
      },
      {
        "name": "Cheese Corn Sandwich",
        "price": 210
      },
      {
        "name": "Veg Grilled Sandwich",
        "price": 220
      },
      {
        "name": "Paneer Paprika Sandwich",
        "price": 240,
        "isMostOrdered": true
      }
    ]
  },
  {
    "id": "burgers",
    "title": "Burgers",
    "items": [
      {
        "name": "Aloo Tikki Burger with Salted Fries",
        "price": 180
      },
      {
        "name": "Vegetable Burger with Peri Peri Fries",
        "price": 200
      },
      {
        "name": "Cheese Burst Burger with Parmesan Truffle Fries",
        "price": 220
      },
      {
        "name": "Chef's Cottage Cheese Burger with Peri Peri Fries",
        "price": 240
      },
      {
        "name": "9:50 Signature Burger with Potato Wedges",
        "price": 250,
        "description": "Our very own specialty, loaded with onion and garlic flavors with a subtle kick of Schezwan.",
        "isSignature": true
      }
    ]
  },
  {
    "id": "pasta",
    "title": "Pasta",
    "items": [
      {
        "name": "Spaghetti Aglio E Olio",
        "price": 300,
        "description": "A golden swirl of garlic-kissed spaghetti with olives, cherry tomatoes, and a graceful dusting of Parmesan."
      },
      {
        "name": "Fettuccine Basil Pesto",
        "price": 340,
        "description": "Silky fettuccine draped in vibrant pesto sauce with olives and a bright finish of basil and Parmesan.",
        "isMostOrdered": true
      },
      {
        "name": "Penne Arrabbiata",
        "price": 320,
        "description": "Fiery, tangy penne tossed with peppers and olives, lifted by fresh parsley and a snowfall of Parmesan."
      },
      {
        "name": "Fettuccine Creamy Mushroom",
        "price": 360,
        "description": "A lush mushroom-cream-coated fettuccine crowned with chili warmth and delicate Parmesan."
      },
      {
        "name": "Traditional Lasagna",
        "price": 380,
        "description": "Layers of tender pasta, rich in house sauce, seasonal vegetables, and mozzarella on top, baked to golden perfection",
        "customTag": "chiefs choice"
      },
      {
        "name": "Three Cheese Ravioli",
        "price": 390,
        "description": "A decadent trio of ricotta, bocconcini, and cheddar folded into delicate pasta pillows, finished with a silky house-blend sauce"
      },
      {
        "name": "Exotic Pink Penne",
        "price": 350
      },
      {
        "name": "9:50 Mac & Cheese",
        "price": 370,
        "description": "A creamy, golden bake of butter-garlic macaroni with broccoli, paprika, sweet corn, and molten mozzarella on top.",
        "isSignature": true
      }
    ]
  },
  {
    "id": "pizza",
    "title": "Pizza Station",
    "preheader": "STRAIGHT FROM WOOD FIRE OVEN!",
    "items": [
      {
        "name": "Classic Margherita Pizza",
        "prices": {
          "ny": 400,
          "neap": 450
        },
        "description": "A timeless pizza with mozzarella, bocconcini, and fresh basil leaves on top."
      },
      {
        "name": "Cheese Corn Pizza",
        "prices": {
          "ny": 400,
          "neap": 450
        },
        "description": "Creamy mozzarella and bocconcini paired with sweet, golden corn."
      },
      {
        "name": "Farmville Pizza",
        "prices": {
          "ny": 480,
          "neap": 530
        },
        "description": "A garden medley of broccoli, corn, bell pepper, paprika, olives, jalapeño, and cherry tomato."
      },
      {
        "name": "Four Cheese Pizza",
        "prices": {
          "ny": 450,
          "neap": 500
        },
        "description": "Mozzarella, bocconcini, cheddar, and ricotta with sprinkle of Parmesan on top.",
        "isMostOrdered": true
      },
      {
        "name": "Exotic Pizza",
        "prices": {
          "ny": 460,
          "neap": 510
        },
        "description": "Golden corn, bell peppers, black olives, red paprika, jalapeño, and mushroom come together for a vibrant, flavorful pizza experience."
      },
      {
        "name": "Paneer Tikka Pizza",
        "prices": {
          "ny": 470,
          "neap": 520
        },
        "description": "Spiced paneer, bell pepper, onion, paprika, and jalapeño on tangy paneer tikka sauce."
      },
      {
        "name": "Pestomania Pizza",
        "prices": {
          "ny": 440,
          "neap": 490
        },
        "description": "Fresh bocconcini cheese over a vibrant pesto sauce."
      },
      {
        "name": "Love in the Forest Pizza",
        "prices": {
          "ny": 500,
          "neap": 550
        },
        "description": "A rich garlic cream base topped with paprika and mushrooms, baby burrata at the heart, and a fragrant swirl of pesto sauce, giving perfect valentine vibes",
        "customTag": "trending"
      },
      {
        "name": "9:50 Signature Pizza",
        "prices": {
          "ny": 490,
          "neap": 540
        },
        "description": "Garlic cream base with mozzarella, bocconcini, red paprika, jalapeño, black olives, pickle onion, finished with fried garlic.",
        "isSignature": true
      }
    ]
  },
  {
    "id": "garlic-bread",
    "title": "Garlic Bread",
    "items": [
      {
        "name": "Classic Garlic Bread",
        "price": 240,
        "description": "Stuffed with Butter and garlic, brushed with olive oil, sprinkled with oregano, and served with a jalapeño dip."
      },
      {
        "name": "Chilly Cheese Garlic Bread",
        "price": 250,
        "description": "Stuffed with green chili, melted mozzarella, and a sprinkle of chili and parsley.",
        "isMostOrdered": true
      },
      {
        "name": "9:50 Signature Garlic Bread",
        "price": 300,
        "description": "Stuffed with Schezwan-spiced garlic sauce, bell pepper, cherry tomato, jalapeño, and sweet corn, finished with herbs.",
        "isSignature": true
      }
    ]
  },
  {
    "id": "calzone",
    "title": "Calzone",
    "subtitle": "Hand-folded pocket, stuffed with creamy fillings, baked till perfectly crisp outside and soft inside.",
    "items": [
      {
        "name": "Veg Calzone",
        "price": 320,
        "description": "A golden fold of garlic-sauced veggies, mushrooms, mozzarella, and a sprinkle of oregano and parsley."
      },
      {
        "name": "Pesto Mushroom Calzone",
        "price": 340,
        "description": "Pesto, mushrooms, cherry tomato, lettuce, and bocconcini tucked inside a warm, cheesy fold, served with pesto dip.",
        "isMostOrdered": true
      },
      {
        "name": "Creamy Paneer Calzone",
        "price": 360,
        "description": "Paneer, bell pepper, sweet corn, olives, and cherry tomato wrapped in a cheesy calzone, finished with oregano, parsley, and served with sweet chili sauce."
      }
    ]
  },
  {
    "id": "meal-bowls",
    "title": "Meal Bowls",
    "items": [
      {
        "name": "Burnt Garlic Fried Rice",
        "price": 250
      },
      {
        "name": "Schezwan Fried Rice",
        "price": 250
      },
      {
        "name": "Burrito Rice Bowl",
        "price": 350,
        "description": "Wholesome mix of garlic rice, rajma, salad, nachos, salsa, corn, curd, and peri peri paneer on top.",
        "isMostOrdered": true
      },
      {
        "name": "Peri Peri Paneer Rice Bowl",
        "price": 340
      },
      {
        "name": "Buddha Bowl",
        "price": 380,
        "description": "Protein-packed bowl loaded with brown rice, fresh paneer, greens, avocado, and creamy peanut dressing."
      },
      {
        "name": "9:50 Signature Meal Bowl",
        "price": 350,
        "description": "Your comforting pizza flavours but in a rice bowl.",
        "isSignature": true
      }
    ]
  },
  {
    "id": "ramen-tales",
    "title": "Ramen Tales",
    "subtitle": "ラーメン物語 • Comforting bowls of warmth, crafted with care and tradition.",
    "items": [
      {
        "name": "Tan Tan Ramen",
        "price": 280,
        "description": "Comforting ramen noodles coated in a creamy sesame-peanut sauce, stir-fried with fresh vegetables, and balanced with savory, tangy, and mildly spicy flavors."
      },
      {
        "name": "Shoyu Ramen",
        "price": 320,
        "description": "Savory soy-glazed ramen with garlic, vegetables, and mushrooms, delivering deep umami flavors and a satisfying spicy finish.",
        "isMostOrdered": true
      }
    ]
  },
  {
    "id": "meal-combos",
    "title": "Meal Combos",
    "items": [
      {
        "name": "Pav Bhaji",
        "price": 200
      },
      {
        "name": "Butter Khichdi",
        "price": 220
      },
      {
        "name": "Chole Chawal / Rajma Chawal",
        "price": 220
      },
      {
        "name": "Sev Tamatar with Laccha Paratha",
        "price": 250
      },
      {
        "name": "Paneer Bhurji with Pav",
        "price": 250
      }
    ]
  },
  {
    "id": "dessert",
    "title": "Desserts",
    "items": [
      {
        "name": "Classic Homemade Brownie",
        "price": 220
      },
      {
        "name": "Nutella Waffle",
        "price": 240
      },
      {
        "name": "Biscoff Waffle",
        "price": 240
      },
      {
        "name": "Oreo Waffle",
        "price": 240
      },
      {
        "name": "Sizzling Brownie",
        "price": 260
      },
      {
        "name": "Classic Tiramisu",
        "price": 250,
        "isMostOrdered": true
      },
      {
        "name": "Red Velvet Tiramisu",
        "price": 280
      },
      {
        "name": "Blueberry Cheese Cake",
        "price": 250
      },
      {
        "name": "Lotus Biscoff Cheese Cake",
        "price": 250
      },
      {
        "name": "Nutella Cheese Cake",
        "price": 250
      },
      {
        "name": "Strawberry Cheese Cake",
        "price": 250,
        "isMostOrdered": true
      },
      {
        "name": "Mango Cheesecake",
        "price": 280
      },
      {
        "name": "Blueberry Tiramisu",
        "price": 280,
        "customTag": "trending"
      }
    ]
  }
];

function getPriceValue(item: MenuItem): number {
  if (typeof item.price === 'number') {
    return item.price;
  }
  if (typeof item.price === 'string') {
    const parsed = parseFloat(item.price.split('/')[0]);
    return isNaN(parsed) ? 9999 : parsed;
  }
  if (item.prices) {
    return Math.min(item.prices.ny, item.prices.neap);
  }
  return 9999;
}

export const menuSections: MenuSection[] = rawMenuSections.map(section => ({
  ...section,
  items: [...section.items].sort((a, b) => getPriceValue(a) - getPriceValue(b))
}));
