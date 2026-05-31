import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin user
  const adminHash = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@freshmart.com" },
    update: {},
    create: {
      email: "admin@freshmart.com",
      passwordHash: adminHash,
      fullName: "Admin User",
      role: "ADMIN",
    },
  });

  // Categories
  const categories = [
    { name: "Fruits & Vegetables", description: "Fresh fruits and vegetables", imageUrl: "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg" },
    { name: "Dairy & Eggs", description: "Milk, cheese, eggs and more", imageUrl: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg" },
    { name: "Meat & Poultry", description: "Fresh meat and poultry", imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg" },
    { name: "Bakery", description: "Fresh baked goods", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg" },
    { name: "Beverages", description: "Drinks and juices", imageUrl: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg" },
    { name: "Pantry", description: "Dry goods and pantry staples", imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map((c) => [c.name, c.id]));

  const products = [
    // ── Fruits & Vegetables (30) ──────────────────────────────
    { name: "Organic Bananas", description: "Sweet organic bananas, perfect for snacking", price: 1.49, stock: 150, unit: "bunch", imageUrl: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Red Apples", description: "Crisp and juicy red apples", price: 2.99, stock: 120, unit: "kg", imageUrl: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Fresh Strawberries", description: "Sweet and fresh strawberries", price: 3.49, stock: 80, unit: "punnet", imageUrl: "https://images.pexels.com/photos/89778/strawberries-frisch-ripe-sweet-89778.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Broccoli", description: "Fresh green broccoli heads", price: 1.99, stock: 90, unit: "head", imageUrl: "https://images.pexels.com/photos/1359326/pexels-photo-1359326.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Carrots", description: "Crunchy fresh carrots", price: 1.29, stock: 200, unit: "kg", imageUrl: "https://images.pexels.com/photos/1306559/pexels-photo-1306559.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Baby Spinach", description: "Tender baby spinach leaves", price: 2.49, stock: 60, unit: "bag", imageUrl: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Mangoes", description: "Ripe and juicy Alphonso mangoes", price: 3.99, stock: 70, unit: "kg", imageUrl: "https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Oranges", description: "Navel oranges, full of vitamin C", price: 2.49, stock: 110, unit: "kg", imageUrl: "https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Grapes (Red)", description: "Seedless red table grapes", price: 4.49, stock: 65, unit: "kg", imageUrl: "https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Watermelon", description: "Sweet and refreshing watermelon", price: 5.99, stock: 30, unit: "whole", imageUrl: "https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Pineapple", description: "Fresh tropical pineapple", price: 2.99, stock: 45, unit: "whole", imageUrl: "https://images.pexels.com/photos/947879/pexels-photo-947879.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Avocado", description: "Creamy ripe avocados", price: 1.99, stock: 85, unit: "each", imageUrl: "https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Cherry Tomatoes", description: "Sweet bite-sized cherry tomatoes", price: 2.29, stock: 95, unit: "punnet", imageUrl: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Cucumber", description: "Cool and crisp English cucumber", price: 0.99, stock: 130, unit: "each", imageUrl: "https://images.pexels.com/photos/37528/cucumber-salad-food-healthy-37528.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Bell Peppers Mix", description: "Colorful red, yellow and green peppers", price: 3.49, stock: 75, unit: "pack", imageUrl: "https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Zucchini", description: "Fresh green zucchini courgettes", price: 1.79, stock: 80, unit: "kg", imageUrl: "https://images.pexels.com/photos/1437315/pexels-photo-1437315.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Sweet Corn", description: "Golden sweet corn on the cob", price: 0.79, stock: 100, unit: "each", imageUrl: "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Garlic", description: "Fresh whole garlic bulbs", price: 0.99, stock: 160, unit: "bulb", imageUrl: "https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Ginger Root", description: "Fresh ginger root knob", price: 1.49, stock: 120, unit: "piece", imageUrl: "https://images.pexels.com/photos/1191670/pexels-photo-1191670.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Lemons", description: "Bright and zesty lemons", price: 1.99, stock: 140, unit: "bag of 4", imageUrl: "https://images.pexels.com/photos/1414110/pexels-photo-1414110.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Blueberries", description: "Plump antioxidant-rich blueberries", price: 4.99, stock: 55, unit: "punnet", imageUrl: "https://images.pexels.com/photos/4443/food-healthy-sweet-fruit.jpg", categoryName: "Fruits & Vegetables" },
    { name: "Kiwi Fruit", description: "Tangy green kiwi fruits", price: 2.49, stock: 90, unit: "bag of 4", imageUrl: "https://images.pexels.com/photos/51312/kiwi-fruit-vitamins-healthy-eating-51312.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Cauliflower", description: "Fresh white cauliflower head", price: 2.29, stock: 70, unit: "head", imageUrl: "https://images.pexels.com/photos/1328911/pexels-photo-1328911.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Sweet Potatoes", description: "Nutritious orange sweet potatoes", price: 2.49, stock: 100, unit: "kg", imageUrl: "https://images.pexels.com/photos/89247/pexels-photo-89247.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Mushrooms", description: "Fresh button mushrooms", price: 2.99, stock: 75, unit: "250g", imageUrl: "https://images.pexels.com/photos/97068/pexels-photo-97068.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Celery", description: "Crisp celery stalks", price: 1.49, stock: 85, unit: "bunch", imageUrl: "https://images.pexels.com/photos/1453502/pexels-photo-1453502.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Asparagus", description: "Tender green asparagus spears", price: 3.99, stock: 50, unit: "bunch", imageUrl: "https://images.pexels.com/photos/537679/pexels-photo-537679.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Red Onions", description: "Mild and sweet red onions", price: 1.29, stock: 150, unit: "kg", imageUrl: "https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Pears", description: "Juicy ripe Conference pears", price: 2.79, stock: 90, unit: "kg", imageUrl: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg", categoryName: "Fruits & Vegetables" },
    { name: "Pomegranate", description: "Ruby red pomegranates", price: 2.99, stock: 45, unit: "each", imageUrl: "https://images.pexels.com/photos/1320557/pexels-photo-1320557.jpeg", categoryName: "Fruits & Vegetables" },

    // ── Dairy & Eggs (30) ──────────────────────────────────────
    { name: "Whole Milk", description: "Fresh full-cream whole milk", price: 1.89, stock: 100, unit: "litre", imageUrl: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Free Range Eggs", description: "Farm fresh free range eggs", price: 3.99, stock: 75, unit: "dozen", imageUrl: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Mature Cheddar", description: "Aged mature cheddar block", price: 4.49, stock: 50, unit: "250g", imageUrl: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Greek Yogurt", description: "Thick and creamy Greek yogurt", price: 2.99, stock: 65, unit: "500g", imageUrl: "https://images.pexels.com/photos/373882/pexels-photo-373882.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Skimmed Milk", description: "Low-fat skimmed milk", price: 1.69, stock: 90, unit: "litre", imageUrl: "https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Unsalted Butter", description: "Creamy unsalted butter block", price: 2.99, stock: 80, unit: "250g", imageUrl: "https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Mozzarella", description: "Fresh buffalo mozzarella ball", price: 3.49, stock: 55, unit: "125g", imageUrl: "https://images.pexels.com/photos/4193868/pexels-photo-4193868.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Sour Cream", description: "Rich and tangy sour cream", price: 1.99, stock: 70, unit: "300ml", imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Cream Cheese", description: "Smooth full-fat cream cheese", price: 2.49, stock: 60, unit: "200g", imageUrl: "https://images.pexels.com/photos/4046718/pexels-photo-4046718.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Heavy Cream", description: "Double cream for cooking and whipping", price: 2.29, stock: 65, unit: "300ml", imageUrl: "https://images.pexels.com/photos/3682293/pexels-photo-3682293.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Parmesan", description: "Finely grated Italian Parmesan", price: 3.99, stock: 45, unit: "100g", imageUrl: "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Feta Cheese", description: "Crumbly Greek feta in brine", price: 3.29, stock: 50, unit: "200g", imageUrl: "https://images.pexels.com/photos/4193873/pexels-photo-4193873.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Almond Milk", description: "Unsweetened almond milk", price: 2.49, stock: 80, unit: "litre", imageUrl: "https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Oat Milk", description: "Barista oat milk for coffee", price: 2.79, stock: 75, unit: "litre", imageUrl: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Natural Yogurt", description: "Plain full-fat natural yogurt", price: 1.99, stock: 85, unit: "500g", imageUrl: "https://images.pexels.com/photos/373882/pexels-photo-373882.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Quark", description: "Low-fat fresh curd cheese", price: 2.29, stock: 40, unit: "250g", imageUrl: "https://images.pexels.com/photos/4046718/pexels-photo-4046718.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Cottage Cheese", description: "Light and fresh cottage cheese", price: 2.49, stock: 55, unit: "300g", imageUrl: "https://images.pexels.com/photos/4193868/pexels-photo-4193868.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Gouda", description: "Mild and creamy Gouda slices", price: 3.99, stock: 45, unit: "200g", imageUrl: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Brie", description: "Soft creamy French Brie wheel", price: 4.99, stock: 30, unit: "200g", imageUrl: "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Salted Butter", description: "Lightly salted dairy butter", price: 2.79, stock: 90, unit: "250g", imageUrl: "https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Mascarpone", description: "Italian mascarpone for tiramisu", price: 3.49, stock: 35, unit: "250g", imageUrl: "https://images.pexels.com/photos/3682293/pexels-photo-3682293.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Kefir", description: "Probiotic fermented milk drink", price: 2.99, stock: 45, unit: "500ml", imageUrl: "https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Duck Eggs", description: "Rich and large duck eggs", price: 4.99, stock: 25, unit: "6 pack", imageUrl: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Clotted Cream", description: "Thick Devonshire clotted cream", price: 3.29, stock: 30, unit: "227g", imageUrl: "https://images.pexels.com/photos/3682293/pexels-photo-3682293.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Ricotta", description: "Soft Italian ricotta cheese", price: 2.99, stock: 40, unit: "250g", imageUrl: "https://images.pexels.com/photos/4193868/pexels-photo-4193868.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Coconut Milk", description: "Creamy full-fat coconut milk", price: 1.99, stock: 90, unit: "400ml", imageUrl: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Blue Cheese", description: "Pungent and creamy blue cheese", price: 4.49, stock: 30, unit: "150g", imageUrl: "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Halloumi", description: "Firm grilling cheese from Cyprus", price: 4.99, stock: 40, unit: "225g", imageUrl: "https://images.pexels.com/photos/4193873/pexels-photo-4193873.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Creme Fraiche", description: "Tangy French cultured cream", price: 2.49, stock: 50, unit: "300ml", imageUrl: "https://images.pexels.com/photos/3682293/pexels-photo-3682293.jpeg", categoryName: "Dairy & Eggs" },
    { name: "Skyr", description: "Icelandic high-protein skyr", price: 3.29, stock: 45, unit: "450g", imageUrl: "https://images.pexels.com/photos/373882/pexels-photo-373882.jpeg", categoryName: "Dairy & Eggs" },

    // ── Meat & Poultry (30) ────────────────────────────────────
    { name: "Chicken Breast", description: "Boneless skinless chicken breasts", price: 7.99, stock: 40, unit: "kg", imageUrl: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg", categoryName: "Meat & Poultry" },
    { name: "Beef Mince", description: "Lean ground beef mince", price: 8.99, stock: 35, unit: "500g", imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", categoryName: "Meat & Poultry" },
    { name: "Salmon Fillet", description: "Fresh Atlantic salmon fillets", price: 12.99, stock: 25, unit: "kg", imageUrl: "https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg", categoryName: "Meat & Poultry" },
    { name: "Beef Sirloin Steak", description: "Premium sirloin steak", price: 14.99, stock: 20, unit: "300g", imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", categoryName: "Meat & Poultry" },
    { name: "Chicken Thighs", description: "Juicy bone-in chicken thighs", price: 5.99, stock: 50, unit: "kg", imageUrl: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg", categoryName: "Meat & Poultry" },
    { name: "Lamb Chops", description: "Tender rack of lamb chops", price: 16.99, stock: 15, unit: "pack", imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", categoryName: "Meat & Poultry" },
    { name: "Pork Sausages", description: "Thick pork breakfast sausages", price: 4.99, stock: 55, unit: "pack of 6", imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", categoryName: "Meat & Poultry" },
    { name: "Turkey Mince", description: "Lean ground turkey breast", price: 6.49, stock: 35, unit: "500g", imageUrl: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg", categoryName: "Meat & Poultry" },
    { name: "Cod Fillet", description: "Fresh skinless cod fillets", price: 10.99, stock: 30, unit: "kg", imageUrl: "https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg", categoryName: "Meat & Poultry" },
    { name: "Bacon Rashers", description: "Smoked back bacon rashers", price: 3.99, stock: 60, unit: "pack", imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", categoryName: "Meat & Poultry" },
    { name: "Whole Chicken", description: "Free range whole chicken", price: 9.99, stock: 20, unit: "each", imageUrl: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg", categoryName: "Meat & Poultry" },
    { name: "Pork Belly", description: "Slow-roast pork belly slices", price: 7.49, stock: 25, unit: "500g", imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", categoryName: "Meat & Poultry" },
    { name: "Tiger Prawns", description: "Raw shell-on tiger prawns", price: 9.99, stock: 30, unit: "400g", imageUrl: "https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg", categoryName: "Meat & Poultry" },
    { name: "Beef Ribeye", description: "Marbled ribeye steak", price: 18.99, stock: 15, unit: "350g", imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", categoryName: "Meat & Poultry" },
    { name: "Duck Breast", description: "Boneless duck breast fillet", price: 11.99, stock: 20, unit: "300g", imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", categoryName: "Meat & Poultry" },
    { name: "Tuna Steak", description: "Fresh yellowfin tuna steak", price: 13.99, stock: 20, unit: "200g", imageUrl: "https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg", categoryName: "Meat & Poultry" },
    { name: "Chicken Wings", description: "Party-size chicken wings", price: 5.49, stock: 45, unit: "kg", imageUrl: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg", categoryName: "Meat & Poultry" },
    { name: "Pork Chops", description: "Thick-cut pork loin chops", price: 7.99, stock: 30, unit: "pack of 2", imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", categoryName: "Meat & Poultry" },
    { name: "Lamb Mince", description: "Freshly minced lamb shoulder", price: 8.49, stock: 25, unit: "500g", imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", categoryName: "Meat & Poultry" },
    { name: "Sea Bass Fillet", description: "Delicate sea bass fillets", price: 11.49, stock: 20, unit: "300g", imageUrl: "https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg", categoryName: "Meat & Poultry" },
    { name: "Venison Steak", description: "Lean wild venison haunch steak", price: 15.99, stock: 15, unit: "250g", imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", categoryName: "Meat & Poultry" },
    { name: "Chicken Drumsticks", description: "Meaty chicken drumsticks", price: 4.99, stock: 55, unit: "kg", imageUrl: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg", categoryName: "Meat & Poultry" },
    { name: "Beef Short Ribs", description: "Slow-cook beef short ribs", price: 12.49, stock: 20, unit: "kg", imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", categoryName: "Meat & Poultry" },
    { name: "Smoked Salmon", description: "Scottish cold-smoked salmon", price: 6.99, stock: 35, unit: "100g", imageUrl: "https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg", categoryName: "Meat & Poultry" },
    { name: "Chorizo", description: "Spicy cured Spanish chorizo", price: 3.99, stock: 40, unit: "200g", imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", categoryName: "Meat & Poultry" },
    { name: "Pancetta", description: "Italian cured pork pancetta cubes", price: 3.49, stock: 40, unit: "150g", imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", categoryName: "Meat & Poultry" },
    { name: "Mackerel Fillet", description: "Oily fresh mackerel fillets", price: 5.99, stock: 30, unit: "pack of 2", imageUrl: "https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg", categoryName: "Meat & Poultry" },
    { name: "Beef Brisket", description: "Slow-cook beef brisket joint", price: 11.99, stock: 20, unit: "kg", imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", categoryName: "Meat & Poultry" },
    { name: "Scallops", description: "Hand-dived king scallops", price: 14.99, stock: 15, unit: "pack of 6", imageUrl: "https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg", categoryName: "Meat & Poultry" },
    { name: "Pepperoni", description: "Sliced spicy pepperoni", price: 2.99, stock: 50, unit: "100g", imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", categoryName: "Meat & Poultry" },

    // ── Bakery (30) ────────────────────────────────────────────
    { name: "Sourdough Loaf", description: "Artisan sourdough with crispy crust", price: 3.99, stock: 30, unit: "loaf", imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", categoryName: "Bakery" },
    { name: "Butter Croissants", description: "Classic flaky butter croissants", price: 2.49, stock: 40, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Whole Wheat Bread", description: "Nutritious whole wheat sliced bread", price: 2.99, stock: 55, unit: "loaf", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },
    { name: "Bagels", description: "New York style plain bagels", price: 3.29, stock: 35, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", categoryName: "Bakery" },
    { name: "Cinnamon Rolls", description: "Warm cinnamon rolls with icing", price: 4.49, stock: 25, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Baguette", description: "Classic French baguette", price: 1.49, stock: 50, unit: "each", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },
    { name: "Rye Bread", description: "Dense and hearty rye bread loaf", price: 3.49, stock: 30, unit: "loaf", imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", categoryName: "Bakery" },
    { name: "Blueberry Muffins", description: "Moist blueberry muffins", price: 3.99, stock: 30, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Focaccia", description: "Italian focaccia with rosemary", price: 3.29, stock: 25, unit: "loaf", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },
    { name: "Chocolate Brownies", description: "Rich fudgy chocolate brownies", price: 4.99, stock: 25, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Pita Bread", description: "Soft wholemeal pita breads", price: 1.99, stock: 50, unit: "pack of 6", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },
    { name: "Pain au Chocolat", description: "Chocolate-filled pastry", price: 2.99, stock: 30, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Ciabatta", description: "Italian ciabatta rolls", price: 2.49, stock: 35, unit: "pack of 2", imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", categoryName: "Bakery" },
    { name: "Banana Bread", description: "Moist homestyle banana bread", price: 3.99, stock: 20, unit: "loaf", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },
    { name: "Dinner Rolls", description: "Soft fluffy dinner rolls", price: 2.49, stock: 40, unit: "pack of 6", imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", categoryName: "Bakery" },
    { name: "Lemon Drizzle Cake", description: "Zesty lemon drizzle loaf cake", price: 5.49, stock: 20, unit: "loaf", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Brioche Buns", description: "Soft golden brioche burger buns", price: 2.99, stock: 35, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },
    { name: "Scones", description: "Traditional plain scones", price: 2.99, stock: 30, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Naan Bread", description: "Garlic and butter naan", price: 1.99, stock: 45, unit: "pack of 2", imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", categoryName: "Bakery" },
    { name: "Carrot Cake", description: "Moist carrot cake with cream cheese", price: 5.99, stock: 15, unit: "slice", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },
    { name: "English Muffins", description: "Soft English breakfast muffins", price: 2.29, stock: 40, unit: "pack of 6", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Pretzel Rolls", description: "Chewy German pretzel rolls", price: 2.79, stock: 30, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", categoryName: "Bakery" },
    { name: "Victoria Sponge", description: "Classic Victoria sponge cake", price: 7.99, stock: 10, unit: "whole", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Tortilla Wraps", description: "Soft flour tortilla wraps", price: 1.99, stock: 60, unit: "pack of 8", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },
    { name: "Doughnuts", description: "Ring doughnuts with sugar glaze", price: 3.49, stock: 25, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Pumpernickel", description: "Dark German pumpernickel bread", price: 3.29, stock: 20, unit: "loaf", imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", categoryName: "Bakery" },
    { name: "Crumpets", description: "Thick and spongy crumpets", price: 1.79, stock: 45, unit: "pack of 6", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },
    { name: "Almond Croissant", description: "Croissant filled with almond cream", price: 3.49, stock: 20, unit: "each", imageUrl: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg", categoryName: "Bakery" },
    { name: "Seeded Loaf", description: "Mixed seed and grain bread loaf", price: 3.49, stock: 30, unit: "loaf", imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", categoryName: "Bakery" },
    { name: "Waffles", description: "Belgian-style buttermilk waffles", price: 3.99, stock: 30, unit: "pack of 4", imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg", categoryName: "Bakery" },

    // ── Beverages (30) ─────────────────────────────────────────
    { name: "Orange Juice", description: "Freshly squeezed orange juice", price: 3.49, stock: 70, unit: "litre", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Sparkling Water", description: "Natural sparkling mineral water", price: 1.29, stock: 120, unit: "1.5L", imageUrl: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg", categoryName: "Beverages" },
    { name: "Green Tea", description: "Organic green tea bags", price: 4.99, stock: 85, unit: "box of 20", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Apple Juice", description: "Pressed cloudy apple juice", price: 2.99, stock: 80, unit: "litre", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Still Water", description: "Natural still spring water", price: 0.89, stock: 150, unit: "1.5L", imageUrl: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg", categoryName: "Beverages" },
    { name: "Black Coffee Beans", description: "Arabica whole bean coffee", price: 8.99, stock: 50, unit: "250g", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Mango Juice", description: "Tropical mango nectar drink", price: 2.49, stock: 70, unit: "litre", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Chamomile Tea", description: "Soothing chamomile tea bags", price: 3.99, stock: 65, unit: "box of 20", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Coconut Water", description: "Pure natural coconut water", price: 2.29, stock: 80, unit: "330ml", imageUrl: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg", categoryName: "Beverages" },
    { name: "Lemonade", description: "Freshly made still lemonade", price: 2.49, stock: 75, unit: "litre", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Peppermint Tea", description: "Refreshing peppermint herbal tea", price: 3.49, stock: 70, unit: "box of 20", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Pomegranate Juice", description: "Pure pomegranate juice drink", price: 3.99, stock: 55, unit: "litre", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Instant Coffee", description: "Rich roast instant coffee granules", price: 5.99, stock: 60, unit: "200g", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Grape Juice", description: "Dark red grape juice", price: 2.79, stock: 65, unit: "litre", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Elderflower Cordial", description: "Premium elderflower cordial", price: 4.49, stock: 45, unit: "500ml", imageUrl: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg", categoryName: "Beverages" },
    { name: "Tomato Juice", description: "Chilled tomato juice drink", price: 2.29, stock: 60, unit: "litre", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Chai Latte Mix", description: "Spiced masala chai latte powder", price: 6.99, stock: 40, unit: "250g", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Cranberry Juice", description: "Pure cranberry juice drink", price: 3.29, stock: 60, unit: "litre", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Tonic Water", description: "Classic Indian tonic water", price: 1.49, stock: 90, unit: "4 pack", imageUrl: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg", categoryName: "Beverages" },
    { name: "Pineapple Juice", description: "Sweet tropical pineapple juice", price: 2.49, stock: 70, unit: "litre", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Turmeric Latte Mix", description: "Golden milk turmeric blend", price: 7.49, stock: 35, unit: "200g", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Ginger Beer", description: "Fiery non-alcoholic ginger beer", price: 1.99, stock: 80, unit: "500ml", imageUrl: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg", categoryName: "Beverages" },
    { name: "Black Tea Bags", description: "English breakfast tea bags", price: 3.49, stock: 90, unit: "box of 40", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Watermelon Juice", description: "Fresh cold-pressed watermelon juice", price: 3.49, stock: 45, unit: "500ml", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Aloe Vera Drink", description: "Refreshing aloe vera juice", price: 2.99, stock: 55, unit: "500ml", imageUrl: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg", categoryName: "Beverages" },
    { name: "Espresso Pods", description: "Nespresso compatible espresso pods", price: 6.49, stock: 50, unit: "box of 10", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Kombucha", description: "Raw fermented kombucha tea", price: 3.99, stock: 40, unit: "330ml", imageUrl: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg", categoryName: "Beverages" },
    { name: "Peach Iced Tea", description: "Chilled peach flavoured iced tea", price: 1.99, stock: 70, unit: "500ml", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },
    { name: "Rooibos Tea", description: "Caffeine-free South African rooibos", price: 4.29, stock: 55, unit: "box of 20", imageUrl: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg", categoryName: "Beverages" },
    { name: "Smoothie Mix", description: "Frozen berry smoothie blend", price: 4.99, stock: 45, unit: "400g", imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg", categoryName: "Beverages" },

    // ── Pantry (30) ────────────────────────────────────────────
    { name: "Basmati Rice", description: "Premium long grain basmati rice", price: 5.99, stock: 90, unit: "2kg", imageUrl: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg", categoryName: "Pantry" },
    { name: "Extra Virgin Olive Oil", description: "Cold pressed extra virgin olive oil", price: 8.99, stock: 45, unit: "500ml", imageUrl: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg", categoryName: "Pantry" },
    { name: "Spaghetti", description: "Italian durum wheat spaghetti", price: 1.99, stock: 110, unit: "500g", imageUrl: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg", categoryName: "Pantry" },
    { name: "Canned Tomatoes", description: "Whole peeled plum tomatoes", price: 1.49, stock: 130, unit: "400g", imageUrl: "https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg", categoryName: "Pantry" },
    { name: "Wildflower Honey", description: "Pure raw wildflower honey", price: 6.99, stock: 40, unit: "jar", imageUrl: "https://images.pexels.com/photos/33260/honey-sweet-syrup-organic.jpg", categoryName: "Pantry" },
    { name: "Quinoa", description: "Organic white quinoa grain", price: 4.99, stock: 60, unit: "500g", imageUrl: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg", categoryName: "Pantry" },
    { name: "Chickpeas", description: "Canned organic chickpeas", price: 1.29, stock: 120, unit: "400g", imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", categoryName: "Pantry" },
    { name: "Red Lentils", description: "Dried split red lentils", price: 1.99, stock: 100, unit: "500g", imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", categoryName: "Pantry" },
    { name: "Peanut Butter", description: "Smooth natural peanut butter", price: 3.49, stock: 75, unit: "340g", imageUrl: "https://images.pexels.com/photos/33260/honey-sweet-syrup-organic.jpg", categoryName: "Pantry" },
    { name: "Rolled Oats", description: "Jumbo whole rolled oats", price: 2.49, stock: 90, unit: "1kg", imageUrl: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg", categoryName: "Pantry" },
    { name: "Coconut Oil", description: "Raw virgin coconut oil", price: 5.99, stock: 50, unit: "500ml", imageUrl: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg", categoryName: "Pantry" },
    { name: "Black Beans", description: "Canned black turtle beans", price: 1.29, stock: 110, unit: "400g", imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", categoryName: "Pantry" },
    { name: "Penne Pasta", description: "Ridged penne rigate pasta", price: 1.99, stock: 100, unit: "500g", imageUrl: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg", categoryName: "Pantry" },
    { name: "Tomato Pasta Sauce", description: "Classic Italian tomato basil sauce", price: 2.49, stock: 85, unit: "350g", imageUrl: "https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg", categoryName: "Pantry" },
    { name: "Almond Butter", description: "Smooth roasted almond butter", price: 5.49, stock: 40, unit: "340g", imageUrl: "https://images.pexels.com/photos/33260/honey-sweet-syrup-organic.jpg", categoryName: "Pantry" },
    { name: "Brown Rice", description: "Wholegrain long grain brown rice", price: 3.99, stock: 80, unit: "1kg", imageUrl: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg", categoryName: "Pantry" },
    { name: "Apple Cider Vinegar", description: "Raw unfiltered apple cider vinegar", price: 4.49, stock: 55, unit: "500ml", imageUrl: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg", categoryName: "Pantry" },
    { name: "Dark Chocolate", description: "70% dark chocolate bar", price: 2.99, stock: 70, unit: "100g", imageUrl: "https://images.pexels.com/photos/33260/honey-sweet-syrup-organic.jpg", categoryName: "Pantry" },
    { name: "Balsamic Vinegar", description: "Aged Italian balsamic vinegar", price: 5.99, stock: 40, unit: "250ml", imageUrl: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg", categoryName: "Pantry" },
    { name: "Kidney Beans", description: "Canned red kidney beans", price: 1.29, stock: 120, unit: "400g", imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", categoryName: "Pantry" },
    { name: "Fusilli Pasta", description: "Spiral fusilli pasta", price: 1.99, stock: 95, unit: "500g", imageUrl: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg", categoryName: "Pantry" },
    { name: "Maple Syrup", description: "Pure Canadian maple syrup", price: 7.99, stock: 35, unit: "250ml", imageUrl: "https://images.pexels.com/photos/33260/honey-sweet-syrup-organic.jpg", categoryName: "Pantry" },
    { name: "Sunflower Oil", description: "Light sunflower cooking oil", price: 3.49, stock: 65, unit: "litre", imageUrl: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg", categoryName: "Pantry" },
    { name: "Couscous", description: "Quick-cook giant couscous", price: 2.49, stock: 75, unit: "500g", imageUrl: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg", categoryName: "Pantry" },
    { name: "Soy Sauce", description: "Naturally brewed dark soy sauce", price: 2.99, stock: 70, unit: "150ml", imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", categoryName: "Pantry" },
    { name: "Mixed Nuts", description: "Roasted salted mixed nuts", price: 5.99, stock: 55, unit: "200g", imageUrl: "https://images.pexels.com/photos/33260/honey-sweet-syrup-organic.jpg", categoryName: "Pantry" },
    { name: "Tahini", description: "Smooth sesame seed tahini paste", price: 4.99, stock: 40, unit: "300g", imageUrl: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg", categoryName: "Pantry" },
    { name: "Self-Raising Flour", description: "Fine self-raising white flour", price: 1.99, stock: 80, unit: "1.5kg", imageUrl: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg", categoryName: "Pantry" },
    { name: "Caster Sugar", description: "Fine white caster sugar", price: 2.49, stock: 85, unit: "1kg", imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", categoryName: "Pantry" },
    { name: "Vegetable Stock", description: "Rich vegetable stock cubes", price: 1.99, stock: 100, unit: "pack of 8", imageUrl: "https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg", categoryName: "Pantry" },
  ];

  // Clear existing products and re-seed cleanly
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    const { categoryName, ...data } = p;
    await prisma.product.create({
      data: { ...data, price: data.price, categoryId: catMap[categoryName] },
    });
  }

  console.log(`Seed complete: admin user, 6 categories, ${products.length} products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
