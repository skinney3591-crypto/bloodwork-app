import { useState } from 'react'
import { UtensilsCrossed, RefreshCw, Save, Check, Trash2, ChefHat, Sparkles, Send, Bot } from 'lucide-react'

// API-ready interfaces
export interface Meal {
  id: string
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  description: string
  ingredients: string[]
  prepTime: string
  healthBenefits: string[]
  dietTags: string[]
  imageUrl?: string
}

interface MealsViewProps {
  bloodworkIssues?: string[]
  onSaveMeal?: (meal: Meal) => void
}

const dietOptions = [
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'dairy-free', label: 'Dairy-Free' },
]

// Mock meal data - replace with API
const mockMeals: Record<string, Meal[]> = {
  breakfast: [
    {
      id: 'b1',
      name: 'Avocado & Egg Toast',
      type: 'breakfast',
      description: 'Whole grain toast topped with mashed avocado and poached eggs',
      ingredients: ['2 eggs', '1/2 avocado', '2 slices whole grain bread', 'Cherry tomatoes', 'Olive oil'],
      prepTime: '15 min',
      healthBenefits: [
        'High in omega-3s for cholesterol management',
        'Rich in fiber to help regulate blood sugar',
        'Good source of vitamin D'
      ],
      dietTags: ['vegetarian', 'gluten-free-option'],
    },
    {
      id: 'b2',
      name: 'Berry Protein Smoothie',
      type: 'breakfast',
      description: 'Antioxidant-rich smoothie with protein powder',
      ingredients: ['1 cup mixed berries', '1 banana', 'Greek yogurt', 'Protein powder', 'Spinach'],
      prepTime: '5 min',
      healthBenefits: [
        'Antioxidants support heart health',
        'Protein helps stabilize blood sugar',
        'Low in saturated fat'
      ],
      dietTags: ['vegetarian', 'gluten-free'],
    },
    {
      id: 'b3',
      name: 'Keto Breakfast Bowl',
      type: 'breakfast',
      description: 'Scrambled eggs with bacon, avocado, and cheese',
      ingredients: ['3 eggs', '2 strips bacon', '1/2 avocado', 'Cheddar cheese', 'Butter'],
      prepTime: '12 min',
      healthBenefits: [
        'High fat, low carb for ketosis',
        'Sustained energy without blood sugar spikes',
        'Protein keeps you full longer'
      ],
      dietTags: ['keto', 'gluten-free'],
    },
    {
      id: 'b4',
      name: 'Chia Pudding Parfait',
      type: 'breakfast',
      description: 'Chia seeds soaked in almond milk with berries and nuts',
      ingredients: ['3 tbsp chia seeds', 'Almond milk', 'Mixed berries', 'Walnuts', 'Maple syrup'],
      prepTime: '5 min + overnight',
      healthBenefits: [
        'High in omega-3s and fiber',
        'Helps regulate blood sugar',
        'Plant-based protein and calcium'
      ],
      dietTags: ['vegan', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'b5',
      name: 'Veggie Egg White Omelet',
      type: 'breakfast',
      description: 'Fluffy egg white omelet with spinach, mushrooms, and tomatoes',
      ingredients: ['4 egg whites', 'Spinach', 'Mushrooms', 'Tomatoes', 'Bell peppers'],
      prepTime: '10 min',
      healthBenefits: [
        'Low fat, high protein for weight management',
        'Packed with vegetables and antioxidants',
        'Supports healthy cholesterol levels'
      ],
      dietTags: ['vegetarian', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'b6',
      name: 'Paleo Breakfast Hash',
      type: 'breakfast',
      description: 'Sweet potato hash with ground turkey and vegetables',
      ingredients: ['Ground turkey', 'Sweet potato', 'Bell peppers', 'Onion', 'Herbs', '2 eggs'],
      prepTime: '25 min',
      healthBenefits: [
        'Whole foods, no processed ingredients',
        'Balanced protein and complex carbs',
        'Anti-inflammatory nutrients'
      ],
      dietTags: ['paleo', 'gluten-free', 'dairy-free'],
    },
  ],
  lunch: [
    {
      id: 'l1',
      name: 'Grilled Salmon Salad',
      type: 'lunch',
      description: 'Fresh greens with omega-3 rich salmon and lemon dressing',
      ingredients: ['6oz salmon', 'Mixed greens', 'Cucumber', 'Red onion', 'Lemon', 'Olive oil'],
      prepTime: '20 min',
      healthBenefits: [
        'Omega-3 fatty acids lower LDL cholesterol',
        'Anti-inflammatory properties',
        'High protein, low carb for blood sugar control'
      ],
      dietTags: ['paleo', 'keto', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'l2',
      name: 'Quinoa Buddha Bowl',
      type: 'lunch',
      description: 'Colorful bowl with quinoa, roasted vegetables, and tahini',
      ingredients: ['1 cup quinoa', 'Chickpeas', 'Sweet potato', 'Kale', 'Tahini dressing'],
      prepTime: '30 min',
      healthBenefits: [
        'Plant-based protein and fiber',
        'Rich in magnesium for heart health',
        'Complex carbs for sustained energy'
      ],
      dietTags: ['vegan', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'l3',
      name: 'Keto Cobb Salad',
      type: 'lunch',
      description: 'Loaded salad with chicken, bacon, eggs, avocado, and blue cheese',
      ingredients: ['Grilled chicken', 'Bacon', 'Hard-boiled eggs', 'Avocado', 'Blue cheese', 'Ranch dressing'],
      prepTime: '15 min',
      healthBenefits: [
        'High fat, low carb keeps you in ketosis',
        'Complete protein from multiple sources',
        'Satisfying and nutrient-dense'
      ],
      dietTags: ['keto', 'gluten-free'],
    },
    {
      id: 'l4',
      name: 'Mediterranean Wrap',
      type: 'lunch',
      description: 'Whole wheat wrap with hummus, vegetables, and feta',
      ingredients: ['Whole wheat tortilla', 'Hummus', 'Cucumber', 'Tomatoes', 'Feta cheese', 'Olives', 'Spinach'],
      prepTime: '8 min',
      healthBenefits: [
        'Mediterranean diet supports heart health',
        'Fiber-rich for blood sugar control',
        'Plant-based proteins and healthy fats'
      ],
      dietTags: ['vegetarian'],
    },
    {
      id: 'l5',
      name: 'Vegan Lentil Soup',
      type: 'lunch',
      description: 'Hearty soup with lentils, vegetables, and warming spices',
      ingredients: ['Red lentils', 'Carrots', 'Celery', 'Tomatoes', 'Turmeric', 'Cumin', 'Vegetable broth'],
      prepTime: '35 min',
      healthBenefits: [
        'High in fiber and plant-based protein',
        'Anti-inflammatory spices',
        'Helps lower cholesterol naturally'
      ],
      dietTags: ['vegan', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'l6',
      name: 'Paleo Chicken & Sweet Potato',
      type: 'lunch',
      description: 'Grilled chicken breast with roasted sweet potato and broccoli',
      ingredients: ['Chicken breast', 'Sweet potato', 'Broccoli', 'Olive oil', 'Herbs', 'Garlic'],
      prepTime: '30 min',
      healthBenefits: [
        'Clean protein and complex carbs',
        'No processed ingredients',
        'Rich in vitamins A and C'
      ],
      dietTags: ['paleo', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'l7',
      name: 'Zoodle Primavera',
      type: 'lunch',
      description: 'Zucchini noodles with colorful vegetables in light tomato sauce',
      ingredients: ['Zucchini noodles', 'Cherry tomatoes', 'Bell peppers', 'Garlic', 'Basil', 'Olive oil'],
      prepTime: '18 min',
      healthBenefits: [
        'Low carb vegetable noodles',
        'Packed with antioxidants',
        'Light and satisfying'
      ],
      dietTags: ['vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free'],
    },
  ],
  dinner: [
    {
      id: 'd1',
      name: 'Mediterranean Chicken',
      type: 'dinner',
      description: 'Herb-crusted chicken with roasted vegetables',
      ingredients: ['Chicken breast', 'Zucchini', 'Bell peppers', 'Tomatoes', 'Garlic', 'Herbs'],
      prepTime: '35 min',
      healthBenefits: [
        'Lean protein supports muscle health',
        'Mediterranean diet proven to reduce cholesterol',
        'Rich in vitamins and minerals'
      ],
      dietTags: ['paleo', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'd2',
      name: 'Cauliflower Steak with Chimichurri',
      type: 'dinner',
      description: 'Roasted cauliflower with herb sauce and quinoa',
      ingredients: ['Cauliflower head', 'Quinoa', 'Parsley', 'Garlic', 'Olive oil', 'Vinegar'],
      prepTime: '40 min',
      healthBenefits: [
        'Low-carb, nutrient-dense option',
        'Supports healthy cholesterol levels',
        'High in fiber and antioxidants'
      ],
      dietTags: ['vegan', 'gluten-free', 'dairy-free', 'keto'],
    },
    {
      id: 'd3',
      name: 'Keto Ribeye with Butter Asparagus',
      type: 'dinner',
      description: 'Grass-fed ribeye steak with garlic butter asparagus',
      ingredients: ['8oz ribeye steak', 'Asparagus', 'Grass-fed butter', 'Garlic', 'Sea salt', 'Black pepper'],
      prepTime: '20 min',
      healthBenefits: [
        'High quality protein and healthy fats',
        'Zero carbs for ketogenic diet',
        'Rich in B vitamins and iron'
      ],
      dietTags: ['keto', 'paleo', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'd4',
      name: 'Vegetarian Stuffed Peppers',
      type: 'dinner',
      description: 'Bell peppers stuffed with brown rice, black beans, and cheese',
      ingredients: ['Bell peppers', 'Brown rice', 'Black beans', 'Corn', 'Cheddar cheese', 'Tomato sauce'],
      prepTime: '45 min',
      healthBenefits: [
        'Complete protein from beans and rice',
        'High in fiber for blood sugar control',
        'Loaded with vitamins and minerals'
      ],
      dietTags: ['vegetarian', 'gluten-free'],
    },
    {
      id: 'd5',
      name: 'Vegan Thai Curry',
      type: 'dinner',
      description: 'Coconut curry with tofu, vegetables, and jasmine rice',
      ingredients: ['Firm tofu', 'Coconut milk', 'Curry paste', 'Bell peppers', 'Broccoli', 'Jasmine rice'],
      prepTime: '30 min',
      healthBenefits: [
        'Plant-based protein from tofu',
        'Anti-inflammatory turmeric and ginger',
        'Heart-healthy coconut fats'
      ],
      dietTags: ['vegan', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'd6',
      name: 'Baked Wild Salmon',
      type: 'dinner',
      description: 'Wild-caught salmon with lemon dill sauce and green beans',
      ingredients: ['Wild salmon fillet', 'Green beans', 'Lemon', 'Fresh dill', 'Olive oil', 'Garlic'],
      prepTime: '25 min',
      healthBenefits: [
        'Omega-3s reduce inflammation and cholesterol',
        'High quality protein',
        'Supports heart and brain health'
      ],
      dietTags: ['paleo', 'keto', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'd7',
      name: 'Paleo Beef Stir-Fry',
      type: 'dinner',
      description: 'Grass-fed beef with mixed vegetables in coconut aminos',
      ingredients: ['Grass-fed beef strips', 'Broccoli', 'Carrots', 'Snow peas', 'Coconut aminos', 'Ginger'],
      prepTime: '22 min',
      healthBenefits: [
        'Clean protein and vegetables only',
        'No grains or processed ingredients',
        'Quick and nutrient-dense'
      ],
      dietTags: ['paleo', 'gluten-free', 'dairy-free'],
    },
    {
      id: 'd8',
      name: 'Eggplant Parmesan (GF)',
      type: 'dinner',
      description: 'Breaded eggplant with marinara and mozzarella, gluten-free',
      ingredients: ['Eggplant', 'Gluten-free breadcrumbs', 'Marinara sauce', 'Mozzarella', 'Parmesan', 'Basil'],
      prepTime: '50 min',
      healthBenefits: [
        'Lower carb than traditional pasta',
        'Rich in antioxidants',
        'Satisfying comfort food made healthier'
      ],
      dietTags: ['vegetarian', 'gluten-free'],
    },
  ],
}

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function MealsView({ bloodworkIssues = ['High cholesterol', 'Prediabetic'] }: MealsViewProps) {
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [currentMeals, setCurrentMeals] = useState<{ breakfast: Meal; lunch: Meal; dinner: Meal }>({
    breakfast: mockMeals.breakfast[0],
    lunch: mockMeals.lunch[0],
    dinner: mockMeals.dinner[0],
  })
  const [savedMeals, setSavedMeals] = useState<Meal[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hi! I'm your nutrition AI assistant. Tell me what foods you're craving or thinking about, and I'll generate personalized meal ideas based on your health goals!",
      timestamp: new Date()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isChatGenerating, setIsChatGenerating] = useState(false)

  const toggleDiet = (dietId: string) => {
    setSelectedDiets(prev =>
      prev.includes(dietId) ? prev.filter(d => d !== dietId) : [...prev, dietId]
    )
  }

  const filterMealsByDiet = (meals: Meal[]) => {
    if (selectedDiets.length === 0) {
      return meals
    }
    return meals.filter(meal =>
      selectedDiets.every(diet => meal.dietTags.includes(diet))
    )
  }

  const generateMeals = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      const breakfastOptions = filterMealsByDiet(mockMeals.breakfast)
      const lunchOptions = filterMealsByDiet(mockMeals.lunch)
      const dinnerOptions = filterMealsByDiet(mockMeals.dinner)

      setCurrentMeals({
        breakfast: breakfastOptions.length > 0
          ? breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)]
          : mockMeals.breakfast[0],
        lunch: lunchOptions.length > 0
          ? lunchOptions[Math.floor(Math.random() * lunchOptions.length)]
          : mockMeals.lunch[0],
        dinner: dinnerOptions.length > 0
          ? dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)]
          : mockMeals.dinner[0],
      })
      setIsGenerating(false)
    }, 1000)
  }

  const refreshMeal = (type: 'breakfast' | 'lunch' | 'dinner') => {
    const filteredOptions = filterMealsByDiet(mockMeals[type])
    const options = filteredOptions.length > 0 ? filteredOptions : mockMeals[type]
    const newMeal = options[Math.floor(Math.random() * options.length)]
    setCurrentMeals(prev => ({ ...prev, [type]: newMeal }))
  }

  const saveMeal = (meal: Meal) => {
    if (!savedMeals.find(m => m.id === meal.id)) {
      setSavedMeals(prev => [...prev, meal])
    }
  }

  const removeSavedMeal = (mealId: string) => {
    setSavedMeals(prev => prev.filter(m => m.id !== mealId))
  }

  const isSaved = (mealId: string) => savedMeals.some(m => m.id === mealId)

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isChatGenerating) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatGenerating(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `Great choice! Based on your craving for "${chatInput}" and your health goals (${bloodworkIssues.join(', ')}), I can help you create a healthier version. Let me generate some meal ideas that incorporate those flavors while supporting your ${bloodworkIssues[0].toLowerCase()} management. Click "Generate Meals" below to see custom recipes!`,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiMessage])
      setIsChatGenerating(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <UtensilsCrossed className="h-7 w-7 mr-3 text-markr-blue" />
              Personalized Meal Ideas
            </h2>
            <p className="text-sm text-gray-600 mt-1">Meals tailored to your health goals</p>
          </div>
        </div>
      </div>

      {/* AI Chat Interface */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-markr-blue to-blue-600 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Meal Generator</h3>
              <p className="text-sm text-blue-100">Tell me what sounds good to you</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="p-4 bg-gray-50 max-h-80 overflow-y-auto space-y-3">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-markr-blue text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                {message.role === 'ai' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="h-4 w-4 text-markr-blue" />
                    <span className="text-xs font-semibold text-markr-blue">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isChatGenerating && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-markr-blue" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-markr-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-markr-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-markr-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g., I'm craving pasta, something spicy, tacos..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-markr-blue focus:border-transparent"
              disabled={isChatGenerating}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatGenerating}
              className="px-6 py-3 bg-markr-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>

      {/* Health Context */}
      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
        <div className="flex items-start space-x-3">
          <Sparkles className="h-5 w-5 text-markr-blue mt-0.5" />
          <div>
            <p className="font-semibold text-deep-ink">Your meals are optimized for:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {bloodworkIssues.map((issue, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-markr-blue text-sm rounded-full">
                  {issue}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Diet Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Dietary Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {dietOptions.map(diet => (
            <button
              key={diet.id}
              onClick={() => toggleDiet(diet.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedDiets.includes(diet.id)
                  ? 'bg-blue-100 text-markr-blue border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              {selectedDiets.includes(diet.id) && <Check className="h-4 w-4 inline mr-1" />}
              {diet.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateMeals}
        disabled={isGenerating}
        className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            Generating Your Meals...
          </>
        ) : (
          <>
            <ChefHat className="h-5 w-5 mr-2" />
            Generate Today's Meal Ideas
          </>
        )}
      </button>

      {/* Meal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(['breakfast', 'lunch', 'dinner'] as const).map(type => {
          const meal = currentMeals[type]
          return (
            <div key={type} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {/* Meal Type Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
                <h3 className="text-white font-bold text-xl capitalize">{type}</h3>
              </div>

              {/* Meal Content */}
              <div className="p-5">
                <h4 className="font-bold text-gray-900 text-lg mb-2">{meal.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{meal.description}</p>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Prep Time</p>
                  <p className="text-sm text-gray-900">{meal.prepTime}</p>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Ingredients</p>
                  <ul className="text-sm text-gray-700 space-y-0.5">
                    {meal.ingredients.slice(0, 3).map((ing, idx) => (
                      <li key={idx}>• {ing}</li>
                    ))}
                    {meal.ingredients.length > 3 && (
                      <li className="text-gray-500">+{meal.ingredients.length - 3} more</li>
                    )}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Why This Helps</p>
                  <ul className="text-xs text-success-green space-y-1">
                    {meal.healthBenefits.slice(0, 2).map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-1">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveMeal(meal)}
                    disabled={isSaved(meal.id)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      isSaved(meal.id)
                        ? 'bg-green-100 text-success-green cursor-default'
                        : 'bg-markr-blue text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSaved(meal.id) ? (
                      <>
                        <Check className="h-4 w-4 inline mr-1" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 inline mr-1" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => refreshMeal(type)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Generate new meal"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Saved Meals */}
      {savedMeals.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Save className="h-5 w-5 mr-2 text-markr-blue" />
            My Saved Meals ({savedMeals.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedMeals.map(meal => (
              <div key={meal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{meal.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{meal.type}</p>
                  </div>
                  <button
                    onClick={() => removeSavedMeal(meal.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
