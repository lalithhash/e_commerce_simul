import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data in correct order (respecting foreign keys)
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // ── USERS ──
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@shopnest.com',
      role: 'ADMIN',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
  });

  const john = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'CUSTOMER',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'CUSTOMER',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
  });

  console.log('👤 Created 3 users');

  // ── CATEGORIES ──
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    },
  });

  const fashion = await prisma.category.create({
    data: {
      name: 'Fashion',
      slug: 'fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    },
  });

  const homeKitchen = await prisma.category.create({
    data: {
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    },
  });

  const books = await prisma.category.create({
    data: {
      name: 'Books',
      slug: 'books',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
    },
  });

  const sportsFitness = await prisma.category.create({
    data: {
      name: 'Sports & Fitness',
      slug: 'sports-fitness',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    },
  });

  console.log('📂 Created 5 categories');

  // ── PRODUCTS ──
  const productsData = [
    // Electronics
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'The iPhone 15 Pro features a titanium design, A17 Pro chip, and a 48MP camera system. Experience the most powerful iPhone ever with USB-C connectivity, customizable Action button, and all-day battery life. Perfect for photography enthusiasts and power users alike.',
      price: 89999,
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
      ],
      rating: 4.7,
      reviewCount: 3,
      categoryId: electronics.id,
    },
    {
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Samsung Galaxy S24 brings Galaxy AI to your hands. With a stunning 6.2-inch Dynamic AMOLED display, Snapdragon 8 Gen 3 processor, and 50MP triple camera setup. Enjoy AI-powered features like Circle to Search and Live Translate.',
      price: 74999,
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80',
      ],
      rating: 4.5,
      reviewCount: 3,
      categoryId: electronics.id,
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise cancelling headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours of battery life. Features multipoint connection, speak-to-chat, and premium comfort with lightweight design.',
      price: 24999,
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
        'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80',
      ],
      rating: 4.8,
      reviewCount: 3,
      categoryId: electronics.id,
    },
    {
      name: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      description: 'Supercharged by the M2 chip, MacBook Air delivers incredible performance in an impossibly thin design. With up to 18 hours of battery life, a stunning 13.6-inch Liquid Retina display, MagSafe charging, and a silent, fanless design.',
      price: 114999,
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
      ],
      rating: 4.9,
      reviewCount: 3,
      categoryId: electronics.id,
    },
    {
      name: 'iPad Pro 11"',
      slug: 'ipad-pro-11',
      description: 'iPad Pro with the M2 chip is the ultimate iPad experience. With an 11-inch Liquid Retina display, ProMotion technology, Apple Pencil hover, and stage manager for powerful multitasking. Perfect for creative professionals.',
      price: 79999,
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
      ],
      rating: 4.6,
      reviewCount: 3,
      categoryId: electronics.id,
    },
    // Fashion
    {
      name: "Men's Slim Fit Jacket",
      slug: 'mens-slim-fit-jacket',
      description: 'A classic slim fit jacket crafted from premium cotton blend fabric. Features a modern tailored cut, button-front closure, and interior pockets. Perfect for both casual and semi-formal occasions. Machine washable and wrinkle-resistant.',
      price: 2499,
      stock: 100,
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      ],
      rating: 4.3,
      reviewCount: 3,
      categoryId: fashion.id,
    },
    {
      name: "Women's Floral Dress",
      slug: 'womens-floral-dress',
      description: 'Elegant floral print dress featuring a flattering A-line silhouette, V-neckline, and flutter sleeves. Made from breathable chiffon fabric perfect for summer. Available in multiple sizes with an adjustable waist tie.',
      price: 1799,
      stock: 80,
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
        'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      ],
      rating: 4.4,
      reviewCount: 3,
      categoryId: fashion.id,
    },
    {
      name: 'Nike Air Max Sneakers',
      slug: 'nike-air-max-sneakers',
      description: 'Iconic Nike Air Max sneakers with visible Air cushioning for maximum comfort. Features a breathable mesh upper, rubber outsole for traction, and classic Nike styling. Perfect for everyday wear and light workouts.',
      price: 8999,
      stock: 60,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
      ],
      rating: 4.6,
      reviewCount: 3,
      categoryId: fashion.id,
    },
    {
      name: 'Classic Denim Jeans',
      slug: 'classic-denim-jeans',
      description: 'Timeless straight-fit denim jeans made from premium stretch denim. Features a classic five-pocket design, button fly closure, and comfortable mid-rise waist. Versatile enough for casual and smart-casual looks.',
      price: 1999,
      stock: 120,
      images: [
        'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
        'https://images.unsplash.com/photo-1475178626620-a4d074967571?w=800&q=80',
      ],
      rating: 4.2,
      reviewCount: 3,
      categoryId: fashion.id,
    },
    {
      name: 'Leather Handbag',
      slug: 'leather-handbag',
      description: 'Luxurious genuine leather handbag with a spacious interior and multiple compartments. Features adjustable shoulder strap, gold-tone hardware, and magnetic snap closure. A timeless accessory for any outfit.',
      price: 3499,
      stock: 45,
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
        'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
      ],
      rating: 4.5,
      reviewCount: 3,
      categoryId: fashion.id,
    },
    // Home & Kitchen
    {
      name: 'Instant Pot Duo 7-in-1',
      slug: 'instant-pot-duo-7-in-1',
      description: 'The bestselling multi-cooker that replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. With 13 one-touch programs and a 6-quart capacity.',
      price: 6999,
      stock: 35,
      images: [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&q=80',
        'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80',
      ],
      rating: 4.7,
      reviewCount: 3,
      categoryId: homeKitchen.id,
    },
    {
      name: 'Bosch Stand Mixer',
      slug: 'bosch-stand-mixer',
      description: 'Professional-grade stand mixer with a powerful 800W motor and planetary mixing action. Includes dough hook, flat beater, and wire whisk attachments. 5-liter stainless steel bowl with ergonomic handle.',
      price: 12999,
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
        'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&q=80',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
      ],
      rating: 4.5,
      reviewCount: 3,
      categoryId: homeKitchen.id,
    },
    {
      name: 'Philips Air Fryer',
      slug: 'philips-air-fryer',
      description: 'Cook healthier meals with up to 90% less fat. Features Rapid Air technology for crispy results, digital touchscreen with 7 presets, and a 4.1L capacity. Dishwasher-safe parts for easy cleaning.',
      price: 8499,
      stock: 40,
      images: [
        'https://images.unsplash.com/photo-1624365168968-f283d506c6b6?w=800&q=80',
        'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
        'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800&q=80',
      ],
      rating: 4.6,
      reviewCount: 3,
      categoryId: homeKitchen.id,
    },
    {
      name: 'Bamboo Cutting Board Set',
      slug: 'bamboo-cutting-board-set',
      description: 'Set of 3 premium bamboo cutting boards in different sizes. Made from sustainable organic bamboo with juice grooves and easy-grip handles. Naturally antimicrobial and knife-friendly.',
      price: 999,
      stock: 200,
      images: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80',
        'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
      ],
      rating: 4.3,
      reviewCount: 3,
      categoryId: homeKitchen.id,
    },
    {
      name: 'Ceramic Dinner Set (12pc)',
      slug: 'ceramic-dinner-set-12pc',
      description: 'Elegant 12-piece ceramic dinner set including 4 dinner plates, 4 side plates, and 4 bowls. Made from premium stoneware with a beautiful glazed finish. Microwave and dishwasher safe.',
      price: 3299,
      stock: 55,
      images: [
        'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800&q=80',
        'https://images.unsplash.com/photo-1580991983455-b3afdbd4569c?w=800&q=80',
        'https://images.unsplash.com/photo-1595981234058-a9302fb97229?w=800&q=80',
      ],
      rating: 4.4,
      reviewCount: 3,
      categoryId: homeKitchen.id,
    },
    // Books
    {
      name: 'Atomic Habits',
      slug: 'atomic-habits',
      description: 'By James Clear. An Easy & Proven Way to Build Good Habits & Break Bad Ones. This breakthrough book reveals how tiny changes in behavior can lead to remarkable results. Learn the science of habits and how to reshape your life.',
      price: 499,
      stock: 500,
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
      ],
      rating: 4.8,
      reviewCount: 3,
      categoryId: books.id,
    },
    {
      name: 'The Alchemist',
      slug: 'the-alchemist',
      description: 'By Paulo Coelho. A magical fable about following your dreams. Santiago, a shepherd boy, travels from Spain to Egypt in search of treasure buried near the Pyramids. A timeless tale of self-discovery and destiny.',
      price: 349,
      stock: 400,
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80',
      ],
      rating: 4.6,
      reviewCount: 3,
      categoryId: books.id,
    },
    {
      name: 'Clean Code',
      slug: 'clean-code',
      description: 'By Robert C. Martin. A handbook of Agile Software Craftsmanship. Learn the principles, patterns, and best practices for writing clean, readable, and maintainable code. Essential reading for every developer.',
      price: 799,
      stock: 200,
      images: [
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&q=80',
      ],
      rating: 4.7,
      reviewCount: 3,
      categoryId: books.id,
    },
    {
      name: 'Deep Work',
      slug: 'deep-work',
      description: 'By Cal Newport. Rules for Focused Success in a Distracted World. Learn strategies for achieving deep concentration and producing higher quality work in less time. A guide to thriving in the modern knowledge economy.',
      price: 549,
      stock: 300,
      images: [
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
        'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&q=80',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      ],
      rating: 4.5,
      reviewCount: 3,
      categoryId: books.id,
    },
    {
      name: 'Zero to One',
      slug: 'zero-to-one',
      description: 'By Peter Thiel. Notes on Startups, or How to Build the Future. Learn contrarian thinking about innovation and entrepreneurship from the co-founder of PayPal and Palantir. A must-read for aspiring founders.',
      price: 449,
      stock: 350,
      images: [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
        'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800&q=80',
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80',
      ],
      rating: 4.4,
      reviewCount: 3,
      categoryId: books.id,
    },
    // Sports & Fitness
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Extra thick 6mm yoga mat with superior grip and cushioning. Made from eco-friendly TPE material with dual-layer construction. Non-slip surface on both sides with alignment markers. Includes carry strap.',
      price: 1299,
      stock: 150,
      images: [
        'https://images.unsplash.com/photo-1601925228439-a4d42c8b0eb8?w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80',
      ],
      rating: 4.5,
      reviewCount: 3,
      categoryId: sportsFitness.id,
    },
    {
      name: 'Adjustable Dumbbell Set',
      slug: 'adjustable-dumbbell-set',
      description: 'Versatile adjustable dumbbell set ranging from 2.5kg to 24kg per dumbbell. Quick-change weight selector dial, compact design replaces 15 sets of weights. Perfect for home gym workouts.',
      price: 4999,
      stock: 60,
      images: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
        'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&q=80',
      ],
      rating: 4.7,
      reviewCount: 3,
      categoryId: sportsFitness.id,
    },
    {
      name: 'Resistance Bands Set',
      slug: 'resistance-bands-set',
      description: 'Complete set of 5 resistance bands with varying resistance levels (5-50 lbs). Made from natural latex with reinforced seams. Includes door anchor, ankle straps, handles, and carry bag.',
      price: 799,
      stock: 200,
      images: [
        'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=800&q=80',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
      ],
      rating: 4.3,
      reviewCount: 3,
      categoryId: sportsFitness.id,
    },
    {
      name: 'Protein Whey Powder 1kg',
      slug: 'protein-whey-powder-1kg',
      description: 'Premium whey protein concentrate with 24g protein per serving. Available in chocolate flavor with low sugar and carbs. Contains essential amino acids and BCAAs for muscle recovery and growth.',
      price: 2199,
      stock: 90,
      images: [
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80',
        'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80',
        'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=80',
      ],
      rating: 4.4,
      reviewCount: 3,
      categoryId: sportsFitness.id,
    },
    {
      name: 'Cycling Helmet',
      slug: 'cycling-helmet',
      description: 'Lightweight aerodynamic cycling helmet with 25 ventilation channels. Features adjustable fit system, removable visor, and EPS foam core for impact protection. Meets safety standards EN 1078.',
      price: 1899,
      stock: 70,
      images: [
        'https://images.unsplash.com/photo-1557803175-b5a5bf03890b?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
        'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80',
      ],
      rating: 4.2,
      reviewCount: 3,
      categoryId: sportsFitness.id,
    },
  ];

  const makeSlug = (base: string) => base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const categoryImagePools: Record<string, string[]> = {
    electronics: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80',
    ],
    fashion: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    ],
    homeKitchen: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80',
      'https://images.unsplash.com/photo-1585515656883-6f8f4a5cc95b?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=800&q=80',
    ],
    books: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
      'https://images.unsplash.com/photo-1455885666463-9f50aee3a6fb?w=800&q=80',
      'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=800&q=80',
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80',
    ],
    sportsFitness: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80',
    ],
  };

  const categoryNamePools: Record<string, string[]> = {
    electronics: ['Pro', 'Lite', 'Max', 'Ultra', 'Prime', 'Core', 'Edge', 'Neo', 'Smart', 'Vision'],
    fashion: ['Classic', 'Street', 'Urban', 'Premium', 'Slim', 'Relaxed', 'Vintage', 'Modern', 'Signature', 'Essentials'],
    homeKitchen: ['Compact', 'Deluxe', 'Stainless', 'Eco', 'Smart', 'Everyday', 'Chef', 'Premium', 'Quick', 'Family'],
    books: ['Beginner', 'Advanced', 'Essential', 'Complete', 'Practical', 'Visual', 'Mastery', 'Guide', 'Handbook', 'Deep Dive'],
    sportsFitness: ['Active', 'Power', 'Flex', 'Elite', 'Pro', 'Compact', 'Endurance', 'Core', 'Performance', 'Recovery'],
  };

  const addExtraProducts = (opts: {
    categoryId: string;
    categoryLabel: string;
    count: number;
    priceFrom: number;
    priceStep: number;
    stockFrom: number;
    categoryKey: 'electronics' | 'fashion' | 'homeKitchen' | 'books' | 'sportsFitness';
  }) => {
    const pool = categoryImagePools[opts.categoryKey];
    const namePool = categoryNamePools[opts.categoryKey];
    const priceFactors = [1, 1.35, 0.8, 1.75, 0.65, 2.2, 1.15];

    for (let i = 1; i <= opts.count; i++) {
      const prefix = namePool[(i - 1) % namePool.length];
      const name = `${prefix} ${opts.categoryLabel} Item ${i}`;
      const slug = makeSlug(`${opts.categoryLabel}-${i}`);
      const image1 = pool[(i - 1) % pool.length];
      const image2 = pool[(i + 1) % pool.length];
      const image3 = `https://picsum.photos/seed/${opts.categoryKey}-${i}/800/800`;
      const factor = priceFactors[(i - 1) % priceFactors.length];

      productsData.push({
        name,
        slug,
        description: `High-quality ${opts.categoryLabel.toLowerCase()} product. Great value, reliable performance, and a clean modern design.`,
        price: Math.round((opts.priceFrom + (i - 1) * opts.priceStep) * factor),
        stock: opts.stockFrom + (i % 20),
        images: [image1, image2, image3],
        rating: 4.0 + ((i % 10) / 20),
        reviewCount: 0,
        categoryId: opts.categoryId,
      });
    }
  };

  // Add more dummy products so every category feels populated.
  addExtraProducts({ categoryId: electronics.id, categoryLabel: 'Electronics', count: 18, priceFrom: 1499, priceStep: 950, stockFrom: 20, categoryKey: 'electronics' });
  addExtraProducts({ categoryId: fashion.id, categoryLabel: 'Fashion', count: 18, priceFrom: 399, priceStep: 180, stockFrom: 40, categoryKey: 'fashion' });
  addExtraProducts({ categoryId: homeKitchen.id, categoryLabel: 'Home Kitchen', count: 18, priceFrom: 249, priceStep: 240, stockFrom: 30, categoryKey: 'homeKitchen' });
  addExtraProducts({ categoryId: books.id, categoryLabel: 'Book', count: 18, priceFrom: 149, priceStep: 40, stockFrom: 100, categoryKey: 'books' });
  addExtraProducts({ categoryId: sportsFitness.id, categoryLabel: 'Sports Fitness', count: 18, priceFrom: 349, priceStep: 220, stockFrom: 35, categoryKey: 'sportsFitness' });

  const products = [];
  for (const productData of productsData) {
    const product = await prisma.product.create({ 
      data: {
        ...productData,
      } 
    });
    products.push(product);
  }

  console.log(`📦 Created ${products.length} products`);

  // ── REVIEWS ──
  const reviewers = [john, priya, adminUser];
  const reviewComments: Record<string, string[][]> = {
    'iphone-15-pro': [
      ['Amazing phone! The camera quality is absolutely stunning. Best iPhone I have ever used.', '5'],
      ['Great performance and battery life. The titanium build feels premium.', '4'],
      ['Excellent device but a bit pricey. The Action button is very useful.', '4'],
    ],
    'samsung-galaxy-s24': [
      ['Galaxy AI features are game-changing. Love the Circle to Search feature!', '5'],
      ['Beautiful display and smooth performance. Camera is top-notch.', '4'],
      ['Good phone overall. Battery could be better for heavy gaming.', '4'],
    ],
    'sony-wh-1000xm5': [
      ['Best noise cancelling I have ever experienced. Worth every penny!', '5'],
      ['Incredibly comfortable for long listening sessions. Sound quality is superb.', '5'],
      ['Great headphones but the touch controls take some getting used to.', '4'],
    ],
    'macbook-air-m2': [
      ['Blazing fast! The M2 chip handles everything I throw at it effortlessly.', '5'],
      ['Love the silent operation and all-day battery life. Perfect for work.', '5'],
      ['Fantastic laptop. The display is gorgeous and the build quality is impeccable.', '5'],
    ],
    'ipad-pro-11': [
      ['Perfect for digital art and note-taking. Apple Pencil hover is magical.', '5'],
      ['Great for productivity with Stage Manager. Replaced my laptop.', '4'],
      ['Powerful tablet but iPadOS still feels limited compared to macOS.', '4'],
    ],
    'mens-slim-fit-jacket': [
      ['Perfect fit and great quality fabric. Looks very stylish.', '4'],
      ['Comfortable to wear all day. Great for office and casual outings.', '4'],
      ['Good jacket for the price. Stitching and material quality impressed me.', '5'],
    ],
    'womens-floral-dress': [
      ['Beautiful print and very comfortable fabric. Got many compliments!', '5'],
      ['Perfect summer dress. The fit is flattering and the material breathes well.', '4'],
      ['Lovely dress but runs slightly large. Order one size down.', '3'],
    ],
    'nike-air-max-sneakers': [
      ['Super comfortable right out of the box. Classic Nike quality!', '5'],
      ['Great for walking and casual wear. The Air cushioning is amazing.', '4'],
      ['Stylish and durable. Have been wearing daily for 3 months with no issues.', '5'],
    ],
    'classic-denim-jeans': [
      ['Perfect everyday jeans. Comfortable fit with good stretch.', '4'],
      ['Great value for the price. Color does not fade after multiple washes.', '4'],
      ['Nice quality denim. Could use a bit more variety in colors.', '3'],
    ],
    'leather-handbag': [
      ['Beautiful craftsmanship. The leather has a luxurious feel.', '5'],
      ['Spacious and well-organized compartments. My new everyday bag!', '4'],
      ['Gorgeous bag. Hardware quality is excellent. Worth the price.', '5'],
    ],
    'instant-pot-duo-7-in-1': [
      ['Life-changing kitchen appliance! Makes cooking so much easier.', '5'],
      ['The pressure cooker function saves so much time. Great for busy families.', '5'],
      ['Good multi-cooker but takes time to learn all the functions.', '4'],
    ],
    'bosch-stand-mixer': [
      ['Powerful motor handles heavy dough effortlessly. Professional quality!', '5'],
      ['Makes baking so much fun. The attachments are high quality.', '4'],
      ['Excellent mixer but takes up counter space. Performance is outstanding.', '4'],
    ],
    'philips-air-fryer': [
      ['Crispy fries with barely any oil! This air fryer is fantastic.', '5'],
      ['Easy to use and clean. Food comes out perfectly cooked every time.', '5'],
      ['Great appliance for healthier cooking. The presets are very convenient.', '4'],
    ],
    'bamboo-cutting-board-set': [
      ['Beautiful bamboo boards. Great quality for an incredible price.', '5'],
      ['Love the different sizes. Eco-friendly and knife-gentle.', '4'],
      ['Nice set but the smallest board could be a bit bigger.', '3'],
    ],
    'ceramic-dinner-set-12pc': [
      ['Elegant design and great quality. Perfect for dinner parties.', '5'],
      ['Beautiful glazed finish. Microwave safe which is very convenient.', '4'],
      ['Nice dinner set. One plate had a minor chip on arrival though.', '3'],
    ],
    'atomic-habits': [
      ['Transformed my daily routines! Practical and actionable advice.', '5'],
      ['One of the best self-improvement books I have ever read.', '5'],
      ['Great concepts but some chapters feel repetitive. Still highly recommended.', '4'],
    ],
    'the-alchemist': [
      ['A beautiful story about following your dreams. Read it in one sitting!', '5'],
      ['Inspiring and thought-provoking. A timeless classic everyone should read.', '5'],
      ['Nice story but overly simplistic philosophy. Good for a quick read.', '3'],
    ],
    'clean-code': [
      ['Essential reading for every software developer. Changed how I write code.', '5'],
      ['Great principles that apply regardless of programming language.', '4'],
      ['Excellent book though some examples feel dated. Still very relevant.', '4'],
    ],
    'deep-work': [
      ['Helped me become much more productive. Practical strategies that work.', '5'],
      ['Great insights on focus in the age of distraction.', '4'],
      ['Good concepts but could be more concise. Some parts drag on.', '3'],
    ],
    'zero-to-one': [
      ['Fascinating insights on innovation and startups. Made me think differently.', '5'],
      ['Peter Thiel is brilliant. Every aspiring entrepreneur should read this.', '5'],
      ['Thought-provoking but very opinionated. Some arguments feel one-sided.', '4'],
    ],
    'yoga-mat-premium': [
      ['Excellent grip and perfect thickness. Best yoga mat I have owned.', '5'],
      ['Eco-friendly material and the alignment markers are very helpful.', '4'],
      ['Good mat but the material has a slight smell initially. Goes away after a week.', '4'],
    ],
    'adjustable-dumbbell-set': [
      ['Replaced my entire weight rack. Quick to adjust and very sturdy.', '5'],
      ['Perfect for home workouts. Saves so much space compared to individual dumbbells.', '5'],
      ['Great quality but the weight selector can be finicky sometimes.', '4'],
    ],
    'resistance-bands-set': [
      ['Great for travel workouts. The variety of resistance levels is perfect.', '4'],
      ['Sturdy bands that have not snapped despite heavy use. Good value.', '4'],
      ['Nice starter set. The door anchor and handles are useful additions.', '4'],
    ],
    'protein-whey-powder-1kg': [
      ['Mixes smoothly and tastes great. No chalky aftertaste!', '5'],
      ['Good protein content per serving. Chocolate flavor is delicious.', '4'],
      ['Decent protein powder. Would prefer more flavor options.', '3'],
    ],
    'cycling-helmet': [
      ['Lightweight and well-ventilated. Comfortable even on long rides.', '4'],
      ['Good safety features at a reasonable price. Adjustable fit is great.', '4'],
      ['Decent helmet but the visor attachment could be more secure.', '3'],
    ],
  };

  let reviewCount = 0;
  for (const product of products) {
    const comments = reviewComments[product.slug];
    if (comments) {
      for (let i = 0; i < comments.length; i++) {
        await prisma.review.create({
          data: {
            userId: reviewers[i].id,
            productId: product.id,
            rating: parseInt(comments[i][1]),
            comment: comments[i][0],
          },
        });
        reviewCount++;
      }
    }
  }

  console.log(`⭐ Created ${reviewCount} reviews`);

  // ── SAMPLE CART + ORDERS ──
  // Create a couple of realistic orders so Orders/Admin pages aren't empty.
  const bySlug = (slug: string) => products.find((p) => p.slug === slug);
  const sample1 = bySlug('iphone-15-pro');
  const sample2 = bySlug('sony-wh-1000xm5');
  const sample3 = bySlug('atomic-habits');

  if (sample1 && sample2 && sample3) {
    await prisma.$transaction(async (tx) => {
      // John's cart + order
      await tx.cartItem.createMany({
        data: [
          { userId: john.id, productId: sample1.id, quantity: 1 },
          { userId: john.id, productId: sample3.id, quantity: 2 },
        ],
      });

      const johnSubtotal = sample1.price * 1 + sample3.price * 2;
      const johnTax = johnSubtotal * 0.18;
      const johnShipping = johnSubtotal > 500 ? 0 : 99;
      const johnTotal = johnSubtotal + johnTax + johnShipping;

      await tx.order.create({
        data: {
          userId: john.id,
          total: johnTotal,
          status: 'DELIVERED',
          address: '221B Baker Street, Bengaluru, Karnataka, India',
          items: {
            create: [
              { productId: sample1.id, quantity: 1, price: sample1.price },
              { productId: sample3.id, quantity: 2, price: sample3.price },
            ],
          },
        },
      });

      await tx.product.update({ where: { id: sample1.id }, data: { stock: { decrement: 1 } } });
      await tx.product.update({ where: { id: sample3.id }, data: { stock: { decrement: 2 } } });
      await tx.cartItem.deleteMany({ where: { userId: john.id } });

      // Priya's cart + order
      await tx.cartItem.createMany({
        data: [
          { userId: priya.id, productId: sample2.id, quantity: 1 },
          { userId: priya.id, productId: sample3.id, quantity: 1 },
        ],
      });

      const priyaSubtotal = sample2.price * 1 + sample3.price * 1;
      const priyaTax = priyaSubtotal * 0.18;
      const priyaShipping = priyaSubtotal > 500 ? 0 : 99;
      const priyaTotal = priyaSubtotal + priyaTax + priyaShipping;

      await tx.order.create({
        data: {
          userId: priya.id,
          total: priyaTotal,
          status: 'SHIPPED',
          address: 'MG Road, Bengaluru, Karnataka, India',
          items: {
            create: [
              { productId: sample2.id, quantity: 1, price: sample2.price },
              { productId: sample3.id, quantity: 1, price: sample3.price },
            ],
          },
        },
      });

      await tx.product.update({ where: { id: sample2.id }, data: { stock: { decrement: 1 } } });
      await tx.product.update({ where: { id: sample3.id }, data: { stock: { decrement: 1 } } });
      await tx.cartItem.deleteMany({ where: { userId: priya.id } });
    });

    console.log('🧾 Created sample orders (2)');
  } else {
    console.log('🧾 Skipped sample orders (missing sample products)');
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
