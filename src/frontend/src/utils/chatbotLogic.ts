import { ProductCategory } from "../backend";

export type ChatMessage = {
  role: "user" | "bot";
  content: string;
};

type ConversationState = {
  stage:
    | "initial"
    | "collecting_age"
    | "collecting_lifestyle"
    | "collecting_goals"
    | "complete";
  ageGroup?: "18-30" | "30-50" | "50+";
  lifestyle?: "active" | "moderate" | "sedentary";
  goals?: string[];
};

let conversationState: ConversationState = { stage: "initial" };

const faqResponses: Record<string, string> = {
  safe: "All revAlife products undergo rigorous quality testing and are manufactured in GMP-certified facilities. We test for purity, potency, and contaminants to ensure safety. However, we recommend consulting with a healthcare professional before starting any new supplement.",
  natural:
    "We use a combination of natural and scientifically-formulated ingredients. Many of our products contain herbal extracts, vitamins, and minerals sourced from natural sources. Complete ingredient lists are provided on each product page.",
  ingredients:
    "Our ingredients are carefully selected based on scientific research and safety profiles. We prioritize ingredients with strong scientific backing and proven efficacy.",
  usage:
    "Usage instructions are provided on each product page. Generally, supplements should be taken as directed on the label. Always follow the recommended dosage and consult a healthcare professional if you have questions.",
  delivery:
    "Orders are typically delivered within 3-7 business days across India. You will receive tracking information once your order is shipped.",
  shipping:
    "We offer free shipping on orders above ₹500. For orders below ₹500, a flat shipping charge of ₹50 applies.",
  return:
    "We offer a 7-day return policy from the date of delivery. Products must be unopened, in original packaging, and not consumed.",
  payment:
    "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD). All online payments are processed securely.",
};

function detectFAQ(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("safe") || lowerMessage.includes("safety"))
    return faqResponses.safe;
  if (lowerMessage.includes("natural") || lowerMessage.includes("organic"))
    return faqResponses.natural;
  if (lowerMessage.includes("ingredient")) return faqResponses.ingredients;
  if (
    lowerMessage.includes("how to use") ||
    lowerMessage.includes("usage") ||
    lowerMessage.includes("take")
  )
    return faqResponses.usage;
  if (
    lowerMessage.includes("delivery") ||
    lowerMessage.includes("shipping time")
  )
    return faqResponses.delivery;
  if (lowerMessage.includes("shipping") || lowerMessage.includes("charges"))
    return faqResponses.shipping;
  if (lowerMessage.includes("return") || lowerMessage.includes("refund"))
    return faqResponses.return;
  if (lowerMessage.includes("payment") || lowerMessage.includes("pay"))
    return faqResponses.payment;

  return null;
}

function getCategoryRecommendations(
  state: ConversationState,
): ProductCategory[] {
  const categories: ProductCategory[] = [];

  // Age-based recommendations
  if (state.ageGroup === "18-30") {
    categories.push(ProductCategory.multivitamins, ProductCategory.fitness);
  } else if (state.ageGroup === "30-50") {
    categories.push(ProductCategory.immunity, ProductCategory.ayurvedicCare);
  } else if (state.ageGroup === "50+") {
    categories.push(
      ProductCategory.ayurvedicCare,
      ProductCategory.digestiveHealth,
    );
  }

  // Lifestyle-based recommendations
  if (state.lifestyle === "active") {
    if (!categories.includes(ProductCategory.fitness))
      categories.push(ProductCategory.fitness);
  } else if (state.lifestyle === "moderate") {
    if (!categories.includes(ProductCategory.multivitamins))
      categories.push(ProductCategory.multivitamins);
  } else if (state.lifestyle === "sedentary") {
    if (!categories.includes(ProductCategory.digestiveHealth))
      categories.push(ProductCategory.digestiveHealth);
  }

  // Goal-based recommendations
  if (state.goals) {
    // biome-ignore lint/complexity/noForEach: simple array iteration
    state.goals.forEach((goal) => {
      const lowerGoal = goal.toLowerCase();
      if (
        lowerGoal.includes("immunity") &&
        !categories.includes(ProductCategory.immunity)
      ) {
        categories.push(ProductCategory.immunity);
      }
      if (
        lowerGoal.includes("energy") &&
        !categories.includes(ProductCategory.multivitamins)
      ) {
        categories.push(ProductCategory.multivitamins);
      }
      if (
        lowerGoal.includes("digestion") &&
        !categories.includes(ProductCategory.digestiveHealth)
      ) {
        categories.push(ProductCategory.digestiveHealth);
      }
      if (
        lowerGoal.includes("fitness") &&
        !categories.includes(ProductCategory.fitness)
      ) {
        categories.push(ProductCategory.fitness);
      }
      if (
        (lowerGoal.includes("stress") || lowerGoal.includes("calm")) &&
        !categories.includes(ProductCategory.ayurvedicCare)
      ) {
        categories.push(ProductCategory.ayurvedicCare);
      }
    });
  }

  return categories.slice(0, 3);
}

function generateRecommendationMessage(state: ConversationState): string {
  const categories = getCategoryRecommendations(state);

  const categoryNames: Record<ProductCategory, string> = {
    [ProductCategory.multivitamins]: "Multivitamins",
    [ProductCategory.herbalSupplements]: "Herbal Supplements",
    [ProductCategory.fitness]: "Protein & Fitness",
    [ProductCategory.immunity]: "Immunity Boosters",
    [ProductCategory.ayurvedicCare]: "Ayurvedic Care",
    [ProductCategory.digestiveHealth]: "Digestive Health",
  };

  let message =
    "Based on your profile, I recommend exploring these categories:\n\n";

  categories.forEach((cat, index) => {
    message += `${index + 1}. ${categoryNames[cat]}\n`;
  });

  message += "\nThese products are selected to support your wellness goals. ";

  if (state.ageGroup === "18-30") {
    message +=
      "For your age group, focus on building a strong foundation with essential nutrients and supporting an active lifestyle.";
  } else if (state.ageGroup === "30-50") {
    message +=
      "For your age group, maintaining immunity and overall wellness becomes increasingly important.";
  } else if (state.ageGroup === "50+") {
    message +=
      "For your age group, supporting digestive health and traditional wellness practices can be beneficial.";
  }

  message +=
    "\n\nYou can browse our products page to see specific recommendations in these categories. Would you like to know more about any specific product category?";

  return message;
}

export async function processMessage(
  userMessage: string,
  _history: ChatMessage[],
): Promise<ChatMessage> {
  const lowerMessage = userMessage.toLowerCase();

  // Check for FAQ
  const faqResponse = detectFAQ(userMessage);
  if (faqResponse) {
    return { role: "bot", content: faqResponse };
  }

  // Handle recommendation flow
  if (conversationState.stage === "initial") {
    if (
      lowerMessage.includes("recommend") ||
      lowerMessage.includes("suggest") ||
      lowerMessage.includes("help")
    ) {
      conversationState.stage = "collecting_age";
      return {
        role: "bot",
        content:
          "I'd be happy to recommend products for you! Let me ask a few questions to personalize my suggestions.\n\nWhat is your age group?\n1. 18-30 years\n2. 30-50 years\n3. 50+ years",
      };
    }

    return {
      role: "bot",
      content:
        'I can help you find the right wellness products! You can ask me about:\n\n• Product safety and ingredients\n• Shipping and delivery\n• Returns and refunds\n• Payment methods\n\nOr say "recommend products" and I\'ll suggest products based on your needs.',
    };
  }

  if (conversationState.stage === "collecting_age") {
    if (
      lowerMessage.includes("18") ||
      lowerMessage.includes("20") ||
      lowerMessage.includes("1")
    ) {
      conversationState.ageGroup = "18-30";
    } else if (
      lowerMessage.includes("30") ||
      lowerMessage.includes("40") ||
      lowerMessage.includes("2")
    ) {
      conversationState.ageGroup = "30-50";
    } else if (
      lowerMessage.includes("50") ||
      lowerMessage.includes("60") ||
      lowerMessage.includes("3")
    ) {
      conversationState.ageGroup = "50+";
    } else {
      return {
        role: "bot",
        content:
          "Please select one of the age groups:\n1. 18-30 years\n2. 30-50 years\n3. 50+ years",
      };
    }

    conversationState.stage = "collecting_lifestyle";
    return {
      role: "bot",
      content:
        "Great! How would you describe your lifestyle?\n1. Active (regular exercise, sports)\n2. Moderate (some physical activity)\n3. Sedentary (mostly desk work)",
    };
  }

  if (conversationState.stage === "collecting_lifestyle") {
    if (
      lowerMessage.includes("active") ||
      lowerMessage.includes("exercise") ||
      lowerMessage.includes("1")
    ) {
      conversationState.lifestyle = "active";
    } else if (
      lowerMessage.includes("moderate") ||
      lowerMessage.includes("some") ||
      lowerMessage.includes("2")
    ) {
      conversationState.lifestyle = "moderate";
    } else if (
      lowerMessage.includes("sedentary") ||
      lowerMessage.includes("desk") ||
      lowerMessage.includes("3")
    ) {
      conversationState.lifestyle = "sedentary";
    } else {
      return {
        role: "bot",
        content:
          "Please select one of the lifestyle options:\n1. Active\n2. Moderate\n3. Sedentary",
      };
    }

    conversationState.stage = "collecting_goals";
    return {
      role: "bot",
      content:
        "Perfect! What are your main wellness goals? (You can mention multiple)\n\n• Boost immunity\n• Increase energy\n• Improve digestion\n• Support fitness\n• Reduce stress",
    };
  }

  if (conversationState.stage === "collecting_goals") {
    conversationState.goals = [userMessage];
    conversationState.stage = "complete";

    const recommendation = generateRecommendationMessage(conversationState);

    // Reset for next conversation
    conversationState = { stage: "initial" };

    return { role: "bot", content: recommendation };
  }

  // Default response
  return {
    role: "bot",
    content:
      'I\'m here to help! You can ask me about product safety, shipping, returns, or say "recommend products" for personalized suggestions.',
  };
}
