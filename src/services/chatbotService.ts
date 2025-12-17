// Chatbot service for handling AI conversations
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface ChatbotResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
}

// API call to search drugs
export const searchDrugs = async (query: string): Promise<any> => {
  try {
    const response = await fetch(`/api/drugs/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching drugs:", error);
    return { drugs: [], message: "Could not search database" };
  }
};

// API call to search by condition
export const searchDrugsByCondition = async (condition: string): Promise<any> => {
  try {
    const response = await fetch(`/api/drugs/condition?condition=${encodeURIComponent(condition)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching by condition:", error);
    return { drugs: [], message: "Could not search database" };
  }
};

// API call to search Indian medicines
export const searchIndianMedicines = async (query: string): Promise<any> => {
  try {
    const response = await fetch(`/api/medicines-india/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching medicines:", error);
    return { medicines: [], message: "Could not search database" };
  }
};

// AI response engine
const getAIResponse = async (userMessage: string): Promise<string> => {
  const message = userMessage.toLowerCase().trim();

  // Greeting responses
  if (message.match(/^(hello|hi|hey|greetings)/)) {
    return "👋 Welcome to Pharmacy AI Assistant! I can help you find information about drugs and medicines. You can:\n• Ask about a specific drug (e.g., 'What is Aspirin?')\n• Search by medical condition (e.g., 'What drugs treat headache?')\n• Ask for top rated medications\n• Search Indian medicines\n• Get information about pharmaceutical companies\n\nWhat would you like to know?";
  }

  // Search for specific drug or medicine
  if (message.includes("drug") || message.includes("medicine") || message.includes("what is")) {
    // Extract drug name
    const drugMatch = message.match(/(?:drug|medicine|what is)\s+([a-z0-9]+)/i);
    if (drugMatch) {
      const drugName = drugMatch[1];
      const results = await searchDrugs(drugName);
      
      if (results.drugs && results.drugs.length > 0) {
        const drug = results.drugs[0];
        return `Found: **${drug.drug_name}**\n\n💊 Condition: ${drug.medical_condition}\n⭐ Rating: ${drug.rating || 'N/A'}\n📋 Type: ${drug.rx_otc}\n👶 Pregnancy: ${drug.pregnancy_category}\n\n${drug.medical_condition_description ? drug.medical_condition_description.substring(0, 200) + '...' : 'No description available'}\n\n🔗 More info: ${drug.drug_link || 'N/A'}`;
      } else {
        return `I couldn't find information about "${drugName}" in our database. Try searching for a medical condition instead!`;
      }
    }
  }

  // Search by condition
  if (message.includes("treat") || message.includes("condition") || message.includes("helps with")) {
    const conditionMatch = message.match(/(?:treat|condition|helps with)\s+(.+?)(?:\?|$)/i);
    if (conditionMatch) {
      const condition = conditionMatch[1];
      const results = await searchDrugsByCondition(condition);
      
      if (results.drugs && results.drugs.length > 0) {
        const drugs = results.drugs.slice(0, 5);
        let response = `💊 Drugs for treating **${condition}**:\n\n`;
        drugs.forEach((drug: any, idx: number) => {
          response += `${idx + 1}. **${drug.drug_name}** ⭐ ${drug.rating || 'N/A'} (${drug.no_of_reviews} reviews)\n`;
        });
        response += `\nFound ${results.count} total drugs for this condition. Ask for a specific drug name to learn more!`;
        return response;
      }
    }
  }

  // Top rated drugs
  if (message.includes("top") || message.includes("best") || message.includes("popular")) {
    try {
      const response = await fetch("/api/drugs/top-rated?limit=5");
      const results = await response.json();
      
      if (results.drugs && results.drugs.length > 0) {
        let responseText = "⭐ **Top Rated Drugs:**\n\n";
        results.drugs.forEach((drug: any, idx: number) => {
          responseText += `${idx + 1}. **${drug.drug_name}** - Rating: ${drug.rating}/10 (${drug.no_of_reviews} reviews)\n   For: ${drug.medical_condition}\n`;
        });
        return responseText;
      }
    } catch (error) {
      console.error("Error fetching top drugs:", error);
    }
  }

  // Search Indian medicines
  if (message.includes("india") || message.includes("indian medicine")) {
    const medicineMatch = message.match(/(?:india|indian).*?(?:medicine|drug)\s+([a-z0-9]+)/i);
    if (medicineMatch) {
      const medicineName = medicineMatch[1];
      const results = await searchIndianMedicines(medicineName);
      
      if (results.medicines && results.medicines.length > 0) {
        const med = results.medicines[0];
        return `Found Indian Medicine: **${med.name}**\n\n💰 Price: ₹${med.price}\n🏭 Manufacturer: ${med.manufacturer_name}\n📦 Type: ${med.type}\n🔬 Composition: ${med.composition || 'N/A'}\n\nFound ${results.count} medicine(s) matching your search.`;
      }
    }
  }

  // About the platform
  if (message.match(/^(about|what|this|platform|service)/)) {
    return "This is an AI Pharmacy Research Platform with comprehensive drug and medicine databases including:\n• Drugs for common treatments (with medical descriptions)\n• Indian pharmaceutical medicines (with pricing)\n• Global drug reviews and ratings\n• Pharma company information\n\nI can help you search for any drug, medicine, or medical condition!";
  }

  // Help/FAQ
  if (message.includes("help") || message.includes("how") || message.includes("can you")) {
    return "I can help you with:\n\n🔍 **Search Functions:**\n• Search any drug by name\n• Find drugs for a medical condition\n• Get top-rated medications\n• Search Indian medicines by name\n• Look up pharmaceutical companies\n\n📊 **Information Available:**\n• Drug ratings and reviews\n• Medical condition descriptions\n• Prescription vs OTC status\n• Pregnancy category\n• Manufacturer details\n• Drug composition\n• Pricing (for Indian medicines)\n\nJust ask me anything! Example: 'What drugs treat fever?' or 'Tell me about Aspirin'";
  }

  // Default response with suggestions
  return "I'm here to help with pharmaceutical information! 💊\n\nYou can ask me:\n• 'What is [drug name]?'\n• 'What drugs treat [condition]?'\n• 'Show me top rated drugs'\n• 'Search Indian medicines'\n• 'Tell me about [medicine name]'\n\nWhat would you like to search for?";
};

export const sendMessage = async (message: string): Promise<ChatbotResponse> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = await getAIResponse(message);
    return {
      success: true,
      message: response,
    };
  } catch (error) {
    console.error("Error in chatbot:", error);
    return {
      success: false,
      message: "",
      error: "Failed to process your request. Please try again.",
    };
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
