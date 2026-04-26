import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";
import Principal "mo:core/Principal";

actor {
  include MixinObjectStorage();

  // Local result type (Result.Result is deprecated for Caffeine)
  public type CafResult<T> = { #ok : T; #err : Text };

  // Product Types & State
  public type ProductCategory = {
    #multivitamins;
    #herbalSupplements;
    #fitness;
    #immunity;
    #ayurvedicCare;
    #digestiveHealth;
  };

  public type Product = {
    id : Text;
    name : Text;
    category : ProductCategory;
    shortDescription : Text;
    fullDescription : Text;
    ingredients : [Text];
    benefits : [Text];
    howToUse : Text;
    safetyInfo : Text;
    price : Nat;
    imageUrl : Text;
    inStock : Bool;
    featured : Bool;
  };

  let products = Map.empty<Text, Product>();

  // Cart Types & State
  public type CartItem = {
    userId : Principal;
    productId : Text;
    quantity : Nat;
    addedAt : Time.Time;
  };

  let carts = Map.empty<Principal, List.List<CartItem>>();

  // Order Types & State
  public type Address = {
    line1 : Text;
    line2 : Text;
    city : Text;
    state : Text;
    pincode : Text;
  };

  public type CustomerDetails = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type ProductWithQuantity = {
    product : Product;
    quantity : Nat;
    price : Nat;
  };

  public type PaymentMethod = {
    #upi;
    #card;
    #netbanking;
    #cod;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    orderId : Text;
    userId : Principal;
    items : [ProductWithQuantity];
    totalAmount : Nat;
    customerDetails : CustomerDetails;
    shippingAddress : Address;
    paymentMethod : PaymentMethod;
    orderStatus : OrderStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  let orders = Map.empty<Text, Order>();

  // User Profile Types & State
  public type UserProfile = {
    userId : Principal;
    name : Text;
    email : Text;
    phone : Text;
    savedAddresses : [Address];
    createdAt : Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Role-Based Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ProductInput type for admin create/update
  public type ProductInput = {
    name : Text;
    category : ProductCategory;
    description : Text;
    ingredients : Text;
    benefits : Text;
    price : Nat;
    imageUrl : Text;
    stock : Nat;
    isFeatured : Bool;
    howToUse : Text;
    safetyInfo : Text;
  };

  // Seed tracking
  var seedDone : Bool = false;

  // Helper Functions
  func convertProduct(product : Product) : Product { product };

  func nextProductId() : Text {
    Time.now().toText();
  };

  func buildProduct(id : Text, input : ProductInput) : Product {
    {
      id;
      name = input.name;
      category = input.category;
      shortDescription = input.description;
      fullDescription = input.description;
      ingredients = input.ingredients.split(#char '|').toArray();
      benefits = input.benefits.split(#char '|').toArray();
      howToUse = input.howToUse;
      safetyInfo = input.safetyInfo;
      price = input.price;
      imageUrl = input.imageUrl;
      inStock = input.stock > 0;
      featured = input.isFeatured;
    };
  };

  func seedProducts() {
    if (seedDone or not products.isEmpty()) { return };
    seedDone := true;

    let seed : [(Text, ProductInput)] = [
      ("p-ashwagandha", {
        name = "Ashwagandha KSM-66 Extract";
        category = #immunity;
        description = "Premium KSM-66 Ashwagandha root extract standardised to 5% withanolides. Clinically studied adaptogen to reduce stress, support cortisol balance, and boost natural immunity. Trusted by athletes and working professionals across India.";
        ingredients = "KSM-66 Ashwagandha Root Extract (600 mg), Microcrystalline Cellulose, Magnesium Stearate";
        benefits = "Reduces stress and anxiety | Supports adrenal health | Boosts immunity | Improves stamina and endurance | Promotes restful sleep";
        price = 799;
        imageUrl = "https://images.unsplash.com/photo-1611072172377-0cabc3addb42?w=600&q=80";
        stock = 150;
        isFeatured = true;
        howToUse = "Take 1 capsule twice daily with warm milk or water after meals. Best results seen after 4–8 weeks of regular use.";
        safetyInfo = "Not recommended for pregnant or lactating women. Consult your doctor if you are on medication. Keep out of reach of children.";
      }),
      ("p-moringa", {
        name = "Moringa Superfood Powder";
        category = #immunity;
        description = "100% pure Moringa oleifera leaf powder — the 'Miracle Tree' of Ayurveda. Packed with 90+ nutrients, antioxidants, and 9 essential amino acids. Supports energy, immunity, and overall vitality. Sourced from organic farms in Rajasthan.";
        ingredients = "Organic Moringa Leaf Powder (500 mg per serving), No additives or fillers";
        benefits = "Rich in iron and Vitamin C | Boosts natural immunity | Supports healthy skin and hair | Anti-inflammatory properties | Natural energy booster";
        price = 549;
        imageUrl = "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80";
        stock = 200;
        isFeatured = true;
        howToUse = "Mix 1 teaspoon (3 g) in warm water, smoothie, or juice daily. Can also be added to dal or soups.";
        safetyInfo = "Consult physician before use if pregnant. May interact with blood-thinning medications. Store in a cool, dry place.";
      }),
      ("p-triphala", {
        name = "Triphala Gut Health Capsules";
        category = #digestiveHealth;
        description = "Classic Ayurvedic tridosha formula combining Amalaki, Bibhitaki, and Haritaki in balanced proportion. Supports healthy digestion, gentle detoxification, and regular bowel movement. Gentle enough for daily, long-term use.";
        ingredients = "Amalaki (Emblica officinalis) 167 mg, Bibhitaki (Terminalia bellirica) 167 mg, Haritaki (Terminalia chebula) 166 mg";
        benefits = "Promotes healthy digestion | Gentle daily detox | Relieves constipation naturally | Rich in Vitamin C | Balances all three doshas";
        price = 449;
        imageUrl = "https://images.unsplash.com/photo-1559181567-c3190ca9d877?w=600&q=80";
        stock = 180;
        isFeatured = false;
        howToUse = "Take 2 capsules with warm water at bedtime. For detox, take on empty stomach in morning. Adjust dosage as needed.";
        safetyInfo = "Avoid during pregnancy. May cause loose stools initially as gut adjusts. Not a substitute for medical treatment.";
      }),
      ("p-curcumin", {
        name = "Curcumin 95% + BioPerine";
        category = #herbalSupplements;
        description = "High-potency Curcumin extract standardised to 95% curcuminoids, enhanced with BioPerine (black pepper extract) for 20x superior absorption. India's most researched anti-inflammatory herb, now in bioavailable form.";
        ingredients = "Curcumin Extract (500 mg, 95% curcuminoids), BioPerine Black Pepper Extract (5 mg), HPMC Capsule";
        benefits = "Powerful anti-inflammatory | Supports joint health | Antioxidant protection | Liver support | Enhanced absorption with BioPerine";
        price = 699;
        imageUrl = "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80";
        stock = 120;
        isFeatured = true;
        howToUse = "Take 1 capsule twice daily with meals. For joint support, take consistently for at least 6–8 weeks.";
        safetyInfo = "May interact with blood thinners. Consult doctor if you have gallbladder disease. Avoid high doses during pregnancy.";
      }),
      ("p-protein", {
        name = "Plant Protein Powder — Vanilla";
        category = #fitness;
        description = "Clean, multi-source plant protein blend from pea, brown rice, and hemp. 24 g protein per serving with all essential amino acids. No artificial sweeteners, no fillers — just pure nutrition. Perfect for post-workout recovery and daily protein goals.";
        ingredients = "Pea Protein Isolate, Brown Rice Protein, Hemp Protein, Natural Vanilla Flavour, Stevia, Sunflower Lecithin";
        benefits = "24 g protein per serving | Complete amino acid profile | Easy to digest | No bloating | Suitable for lactose intolerant";
        price = 1299;
        imageUrl = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80";
        stock = 90;
        isFeatured = true;
        howToUse = "Mix 1 scoop (30 g) with 250 ml water or plant milk. Use post-workout or between meals as a protein supplement.";
        safetyInfo = "Consult nutritionist for specific fitness goals. Not intended for children under 15 years.";
      }),
      ("p-multivitamin", {
        name = "Multivitamin Daily Pack — Men & Women";
        category = #multivitamins;
        description = "Comprehensive daily multivitamin formulated for Indian nutritional needs. Contains 23 vitamins and minerals including Vitamin D3, B12, Iron, Zinc, and Folate — nutrients commonly deficient in Indian diets. One daily sachet, complete nutrition.";
        ingredients = "Vitamin A, Vitamin C, Vitamin D3, Vitamin E, Vitamin B-Complex, Iron, Zinc, Magnesium, Selenium, Folate, Biotin, Iodine";
        benefits = "Fills nutritional gaps | Boosts energy levels | Supports immunity | Healthy hair and skin | Improves focus and cognition";
        price = 899;
        imageUrl = "https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=80";
        stock = 250;
        isFeatured = true;
        howToUse = "Take 1 tablet daily with breakfast or as directed by your healthcare professional.";
        safetyInfo = "Do not exceed recommended dosage. Keep away from children. Store below 30°C in dry conditions.";
      }),
      ("p-shilajit", {
        name = "Shilajit Pure Himalayan Resin";
        category = #herbalSupplements;
        description = "Authentic Himalayan Shilajit resin harvested from high-altitude rocks at 16,000 ft. Standardised to 50% fulvic acid — nature's most powerful mineral compound. Supports testosterone levels, energy, and cognitive performance in men and women.";
        ingredients = "Pure Himalayan Shilajit Resin 500 mg, Standardised to 50% Fulvic Acid";
        benefits = "Boosts testosterone naturally | Enhances stamina and strength | Supports cognitive function | Rich in 84+ trace minerals | Anti-aging properties";
        price = 1199;
        imageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";
        stock = 75;
        isFeatured = false;
        howToUse = "Dissolve pea-sized amount (300–500 mg) in warm water or milk. Take on empty stomach in the morning for best results.";
        safetyInfo = "Not suitable for people with high uric acid. Consult doctor if on iron supplements. Not for children.";
      }),
      ("p-hairskin", {
        name = "Hair & Skin Nourisher Capsules";
        category = #multivitamins;
        description = "Advanced beauty-from-within formula with Biotin, Collagen Peptides, Hyaluronic Acid, and Plant Keratin. Targets hair fall reduction, nail strength, and skin elasticity. Clinically tested ingredients backed by dermatologist endorsement.";
        ingredients = "Biotin 10,000 mcg, Marine Collagen Peptides 500 mg, Hyaluronic Acid 100 mg, Plant Keratin 200 mg, Vitamin C, Zinc";
        benefits = "Reduces hair fall within 8 weeks | Strengthens nails | Improves skin hydration | Boosts collagen production | Promotes scalp health";
        price = 999;
        imageUrl = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80";
        stock = 140;
        isFeatured = true;
        howToUse = "Take 2 capsules daily after breakfast with water. Consistent use for 3 months recommended for best results.";
        safetyInfo = "Consult dermatologist for severe hair loss conditions. Not a substitute for medical hair treatment.";
      }),
      ("p-amla", {
        name = "Amla Vitamin C — 500 mg Natural";
        category = #immunity;
        description = "Natural Vitamin C from Indian Gooseberry (Amla) — 10x more bioavailable than synthetic ascorbic acid. Each capsule delivers 500 mg of natural Amla extract, equivalent to 20 fresh amlas. Supports immunity, collagen synthesis, and iron absorption.";
        ingredients = "Amla Fruit Extract (500 mg), standardised to 45% Vitamin C, HPMC Capsule";
        benefits = "10x more bioavailable than synthetic C | Powerful antioxidant | Boosts white blood cell count | Collagen synthesis support | Enhances iron absorption";
        price = 399;
        imageUrl = "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80";
        stock = 300;
        isFeatured = false;
        howToUse = "Take 1–2 capsules daily with meals. Can be taken year-round for immune support or during seasonal changes.";
        safetyInfo = "Generally safe for all. High doses may cause mild acidity in sensitive individuals. Take with food to minimise.";
      }),
      ("p-brahmi", {
        name = "Brahmi Brain Booster — Memory & Focus";
        category = #herbalSupplements;
        description = "Premium Brahmi (Bacopa monnieri) extract standardised to 20% bacosides — the Ayurvedic herb for sharp memory and mental clarity. Used for thousands of years by students and scholars. Supports neurotransmitter synthesis and reduces mental fatigue.";
        ingredients = "Bacopa Monnieri Extract 300 mg (20% bacosides), Shankhpushpi 100 mg, Gotu Kola Extract 50 mg";
        benefits = "Enhances memory and recall | Reduces exam stress | Improves concentration | Supports ADHD management | Slows cognitive decline";
        price = 649;
        imageUrl = "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80";
        stock = 110;
        isFeatured = false;
        howToUse = "Take 1 capsule twice daily with warm milk, preferably in the morning and evening. Best results after 6–12 weeks.";
        safetyInfo = "May cause mild nausea initially — take with food. Not for children below 12 without medical supervision.";
      }),
    ];

    for ((id, input) in seed.vals()) {
      if (products.get(id) == null) {
        products.add(id, buildProduct(id, input));
      };
    };
  };

  // Run seed on first canister init
  seedProducts();

  // Product Operations
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public query func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query func listProducts(category : ?ProductCategory) : async [Product] {
    let result = products.values().toArray().map(
      convertProduct
    );

    switch (category) {
      case (null) { result };
      case (?cat) {
        result.filter(func(p) { p.category == cat });
      };
    };
  };

  public query func getFeaturedProducts() : async [Product] {
    products.values().toArray().map(convertProduct).filter(func(p) { p.featured });
  };

  public shared ({ caller }) func updateProductStock(productId : Text, inStock : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update stock");
    };

    switch (products.get(productId)) {
      case (?prod) {
        products.add(productId, {
          id = prod.id;
          name = prod.name;
          category = prod.category;
          shortDescription = prod.shortDescription;
          fullDescription = prod.fullDescription;
          ingredients = prod.ingredients;
          benefits = prod.benefits;
          howToUse = prod.howToUse;
          safetyInfo = prod.safetyInfo;
          price = prod.price;
          imageUrl = prod.imageUrl;
          inStock;
          featured = prod.featured;
        });
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  // Admin Product CRUD

  public shared ({ caller }) func createProduct(input : ProductInput) : async CafResult<Product> {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only admins can create products");
    };
    let id = nextProductId();
    let product = buildProduct(id, input);
    products.add(id, product);
    #ok(product);
  };

  public shared ({ caller }) func updateProduct(id : Text, input : ProductInput) : async CafResult<Product> {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { #err("Product not found") };
      case (?_) {
        let updated = buildProduct(id, input);
        products.add(id, updated);
        #ok(updated);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async CafResult<()> {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only admins can delete products");
    };
    switch (products.get(id)) {
      case (null) { #err("Product not found") };
      case (?_) {
        products.remove(id);
        #ok(());
      };
    };
  };

  public query ({ caller }) func listAllProductsAdmin() : async [Product] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list all products");
    };
    products.values().toArray();
  };

  public shared ({ caller }) func setFeatured(id : Text, featured : Bool) : async CafResult<()> {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only admins can set featured status");
    };
    switch (products.get(id)) {
      case (null) { #err("Product not found") };
      case (?prod) {
        products.add(id, { prod with featured });
        #ok(());
      };
    };
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Cart Operations
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?_) {
        let newItem = {
          userId = caller;
          productId;
          quantity;
          addedAt = Time.now();
        };

        let existingCart = switch (carts.get(caller)) {
          case (null) { List.empty<CartItem>() };
          case (?cart) { cart };
        };

        let updatedCart = existingCart.filter(func(item) { item.productId != productId });
        updatedCart.add(newItem);

        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func updateCartItemQuantity(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart items");
    };

    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) {
        Runtime.trap("Cart is empty. Use addToCart to add items.");
      };
      case (?cart) { cart };
    };

    let updatedCart = existingCart.map<CartItem, CartItem>(
      func(item) {
        if (item.productId == productId) {
          { item with quantity };
        } else {
          item;
        };
      }
    );

    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };

    let updatedCart = existingCart.filter(func(item) { item.productId != productId });
    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async {
    items : [ProductWithQuantity];
    subtotal : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    let items = cart.toArray().map(
      func(item) {
        switch (products.get(item.productId)) {
          case (?prod) {
            { product = prod; quantity = item.quantity; price = prod.price * item.quantity };
          };
          case (null) {
            Runtime.trap("Product not found for cart item: " # item.productId);
          };
        };
      }
    );

    let subtotal = items.values().foldLeft(0, func(acc, item) { acc + item.price });

    { items; subtotal };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };

    carts.remove(caller);
  };

  // Order Operations
  public shared ({ caller }) func createOrder(customerDetails : CustomerDetails, shippingAddress : Address, paymentMethod : PaymentMethod) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    if (cart.isEmpty()) {
      Runtime.trap("Cart is empty");
    };

    let items = cart.toArray().map(
      func(item) {
        switch (products.get(item.productId)) {
          case (?prod) {
            { product = prod; quantity = item.quantity; price = prod.price * item.quantity };
          };
          case (null) { Runtime.trap("Product not found: " # item.productId) };
        };
      }
    );

    let totalAmount = items.values().foldLeft(0, func(acc, item) { acc + item.price });
    let orderId = Time.now().toText();

    let order : Order = {
      orderId;
      userId = caller;
      items;
      totalAmount;
      customerDetails;
      shippingAddress;
      paymentMethod;
      orderStatus = #pending;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    orders.add(orderId, order);
    carts.remove(caller);
    orderId;
  };

  public query ({ caller }) func getOrderById(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (?order) {
        if (caller != order.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };

    let userOrders = orders.values().toArray().filter(func(order) { order.userId == caller });
    userOrders;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, newStatus : OrderStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (?order) {
        if (order.orderStatus == #cancelled) {
          Runtime.trap("Cannot update status of cancelled order");
        };

        let updatedOrder : Order = {
          order with
          orderStatus = newStatus;
          updatedAt = Time.now();
        };

        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  // User Profile Operations
  public shared ({ caller }) func createOrUpdateProfile(name : Text, email : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update profiles");
    };

    let profile : UserProfile = {
      userId = caller;
      name;
      email;
      phone;
      savedAddresses = [];
      createdAt = Time.now();
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func addSavedAddress(address : Address) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add saved addresses");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    let updatedAddresses = profile.savedAddresses.concat([address]);
    let updatedProfile = { profile with savedAddresses = updatedAddresses };

    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func updateSavedAddress(index : Nat, address : Address) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update saved addresses");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    if (index >= profile.savedAddresses.size()) {
      Runtime.trap("Invalid address index");
    };

    let updatedAddresses = profile.savedAddresses.values().enumerate().map(
      func((i, addr)) {
        if (i == index) { address } else { addr };
      }
    ).toArray();

    let updatedProfile = { profile with savedAddresses = updatedAddresses };
    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func deleteSavedAddress(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete saved addresses");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    if (index >= profile.savedAddresses.size()) {
      Runtime.trap("Invalid address index");
    };

    let n = profile.savedAddresses.size();
    let filtered = Array.tabulate(
      n - 1,
      func(i) {
        if (i < index) { profile.savedAddresses[i] } else { profile.savedAddresses[i + 1] }
      }
    );

    let updatedProfile = { profile with savedAddresses = filtered };
    userProfiles.add(caller, updatedProfile);
  };
};
