# ============================================================================
# Nutrition Database for Food Items
# ============================================================================
# This file contains calorie and protein information for different food items
# These are approximate values based on standard serving sizes
# For production, consider using a real nutrition database API like USDA FoodData
# ============================================================================

NUTRITION_DATABASE = {
    # Italian dishes
    "pizza": {"calories": 285, "protein": 12, "fat": 10, "carbs": 36},
    "pasta": {"calories": 370, "protein": 13, "fat": 3, "carbs": 71},
    "ravioli": {"calories": 300, "protein": 15, "fat": 9, "carbs": 38},
    "risotto": {"calories": 430, "protein": 8, "fat": 18, "carbs": 55},
    "spaghetti": {"calories": 340, "protein": 12, "fat": 2, "carbs": 69},
    
    # American dishes
    "hamburger": {"calories": 398, "protein": 20, "fat": 25, "carbs": 28},
    "hotdog": {"calories": 280, "protein": 10, "fat": 16, "carbs": 27},
    "french_fries": {"calories": 365, "protein": 3, "fat": 15, "carbs": 48},
    "grilled_salmon": {"calories": 280, "protein": 35, "fat": 17, "carbs": 0},
    
    # Asian dishes
    "sushi": {"calories": 180, "protein": 8, "fat": 5, "carbs": 28},
    "ramen": {"calories": 380, "protein": 14, "fat": 17, "carbs": 52},
    "pad_thai": {"calories": 357, "protein": 14, "fat": 17, "carbs": 45},
    "spring_roll": {"calories": 113, "protein": 3, "fat": 5, "carbs": 14},
    "bibimbap": {"calories": 435, "protein": 17, "fat": 14, "carbs": 55},
    
    # Indian dishes
    "dosa": {"calories": 200, "protein": 8, "fat": 5, "carbs": 35},
    "idli": {"calories": 110, "protein": 2, "fat": 1, "carbs": 24},
    "samosa": {"calories": 262, "protein": 4, "fat": 14, "carbs": 32},
    "butter_chicken": {"calories": 405, "protein": 35, "fat": 22, "carbs": 8},
    "biryani": {"calories": 450, "protein": 12, "fat": 18, "carbs": 60},
    "naan": {"calories": 278, "protein": 7, "fat": 6, "carbs": 48},
    
    # Mexican dishes
    "tacos": {"calories": 240, "protein": 14, "fat": 12, "carbs": 24},
    "burrito": {"calories": 380, "protein": 15, "fat": 12, "carbs": 55},
    "nachos": {"calories": 470, "protein": 17, "fat": 20, "carbs": 54},
    "falafel": {"calories": 333, "protein": 11, "fat": 17, "carbs": 33},
    
    # Desserts
    "cake": {"calories": 432, "protein": 4, "fat": 25, "carbs": 48},
    "ice_cream": {"calories": 207, "protein": 4, "fat": 11, "carbs": 24},
    "donut": {"calories": 269, "protein": 3, "fat": 15, "carbs": 30},
    "french_toast": {"calories": 330, "protein": 8, "fat": 15, "carbs": 41},
    "waffle": {"calories": 291, "protein": 8, "fat": 11, "carbs": 41},
    
    # Sandwiches & Wraps
    "sandwich": {"calories": 320, "protein": 16, "fat": 10, "carbs": 42},
    "wraps": {"calories": 280, "protein": 12, "fat": 8, "carbs": 38},
    
    # Salads & Healthy options
    "caesar_salad": {"calories": 250, "protein": 12, "fat": 18, "carbs": 8},
    "greek_salad": {"calories": 230, "protein": 8, "fat": 15, "carbs": 18},
    "caprese_salad": {"calories": 220, "protein": 10, "fat": 16, "carbs": 10},
    
    # Breakfast
    "breakfast": {"calories": 400, "protein": 15, "fat": 18, "carbs": 48},
    "pancake": {"calories": 227, "protein": 5, "fat": 8, "carbs": 33},
    "waffle": {"calories": 291, "protein": 8, "fat": 11, "carbs": 41},
    "omelette": {"calories": 280, "protein": 20, "fat": 17, "carbs": 5},
    
    # Soups & Stews
    "beef_carpaccio": {"calories": 280, "protein": 35, "fat": 15, "carbs": 0},
    "beef_short_ribs": {"calories": 508, "protein": 56, "fat": 32, "carbs": 0},
    "beet_salad": {"calories": 120, "protein": 4, "fat": 6, "carbs": 15},
    "bruschetta": {"calories": 85, "protein": 3, "fat": 4, "carbs": 10},
    "cacio_e_pepe": {"calories": 410, "protein": 18, "fat": 25, "carbs": 38},
    "cannoli": {"calories": 280, "protein": 3, "fat": 15, "carbs": 34},
    "caprese": {"calories": 220, "protein": 10, "fat": 16, "carbs": 10},
    "carrot_cake": {"calories": 370, "protein": 5, "fat": 18, "carbs": 48},
    "caviar": {"calories": 264, "protein": 24, "fat": 17, "carbs": 0},
    
    # More Asian cuisines
    "ceviche": {"calories": 120, "protein": 20, "fat": 2, "carbs": 3},
    "cheese_plate": {"calories": 450, "protein": 22, "fat": 38, "carbs": 5},
    "chicken_curry": {"calories": 380, "protein": 28, "fat": 18, "carbs": 20},
    "chicken_quesadilla": {"calories": 450, "protein": 25, "fat": 22, "carbs": 42},
    "clam_chowder": {"calories": 380, "protein": 15, "fat": 22, "carbs": 32},
    "club_sandwich": {"calories": 580, "protein": 28, "fat": 32, "carbs": 48},
    "crab_cakes": {"calories": 320, "protein": 24, "fat": 18, "carbs": 14},
    "crab_soup": {"calories": 165, "protein": 12, "fat": 8, "carbs": 10},
    "croissant": {"calories": 406, "protein": 8, "fat": 20, "carbs": 45},
    "croque_madame": {"calories": 480, "protein": 25, "fat": 28, "carbs": 35},
    "croque_monsieur": {"calories": 420, "protein": 22, "fat": 24, "carbs": 32},
    "cruciferous_vegetables": {"calories": 55, "protein": 4, "fat": 1, "carbs": 10},
    "cupcake": {"calories": 305, "protein": 3, "fat": 16, "carbs": 37},
    "cured_salmon": {"calories": 195, "protein": 27, "fat": 11, "carbs": 0},
    "curry": {"calories": 380, "protein": 28, "fat": 18, "carbs": 20},
    
    # Fish dishes
    "deviled_eggs": {"calories": 155, "protein": 11, "fat": 12, "carbs": 1},
    "dim_sum": {"calories": 170, "protein": 6, "fat": 8, "carbs": 18},
    "donkatsu": {"calories": 380, "protein": 28, "fat": 18, "carbs": 28},
    "donut": {"calories": 269, "protein": 3, "fat": 15, "carbs": 30},
    "duck_confit": {"calories": 652, "protein": 32, "fat": 56, "carbs": 0},
    
    # More variety
    "dumplings": {"calories": 210, "protein": 8, "fat": 8, "carbs": 28},
    "edamame": {"calories": 95, "protein": 11, "fat": 4, "carbs": 7},
    "eggs_benedict": {"calories": 380, "protein": 16, "fat": 24, "carbs": 28},
    "escargot": {"calories": 100, "protein": 20, "fat": 2, "carbs": 0},
    "fajitas": {"calories": 350, "protein": 20, "fat": 14, "carbs": 40},
    "filet_mignon": {"calories": 280, "protein": 35, "fat": 15, "carbs": 0},
    "figs": {"calories": 74, "protein": 1, "fat": 0, "carbs": 19},
    "fish_and_chips": {"calories": 520, "protein": 28, "fat": 25, "carbs": 48},
    "fish_tacos": {"calories": 280, "protein": 22, "fat": 12, "carbs": 28},
    "foie_gras": {"calories": 460, "protein": 5, "fat": 48, "carbs": 2},
    "fondue": {"calories": 380, "protein": 18, "fat": 28, "carbs": 18},
    "food_colorant": {"calories": 0, "protein": 0, "fat": 0, "carbs": 0},
    "french_onion_soup": {"calories": 280, "protein": 8, "fat": 15, "carbs": 30},
    "fried_calamari": {"calories": 360, "protein": 22, "fat": 18, "carbs": 30},
    "fried_green_tomatoes": {"calories": 240, "protein": 6, "fat": 12, "carbs": 28},
    "fried_rice": {"calories": 300, "protein": 8, "fat": 10, "carbs": 45},
    "frittata": {"calories": 280, "protein": 16, "fat": 18, "carbs": 6},
    "fruit_salad": {"calories": 130, "protein": 2, "fat": 1, "carbs": 32},
    "garlic_bread": {"calories": 280, "protein": 7, "fat": 12, "carbs": 38},
    "goulash": {"calories": 380, "protein": 28, "fat": 16, "carbs": 35},
    "greek_coffee": {"calories": 2, "protein": 0, "fat": 0, "carbs": 0},
    "greek_salad": {"calories": 230, "protein": 8, "fat": 15, "carbs": 18},
    "green_beans": {"calories": 31, "protein": 2, "fat": 0, "carbs": 7},
    "green_curry": {"calories": 380, "protein": 22, "fat": 20, "carbs": 30},
    "grilled_cheese_sandwich": {"calories": 420, "protein": 18, "fat": 24, "carbs": 38},
    "grilled_eggplant": {"calories": 92, "protein": 4, "fat": 6, "carbs": 8},
    "grilled_salmon": {"calories": 280, "protein": 35, "fat": 17, "carbs": 0},
    "gyoza": {"calories": 156, "protein": 6, "fat": 7, "carbs": 18},
    "gyro": {"calories": 380, "protein": 28, "fat": 14, "carbs": 40},
    "halibut": {"calories": 110, "protein": 21, "fat": 2, "carbs": 0},
    "ham": {"calories": 145, "protein": 18, "fat": 7, "carbs": 0},
    "hamburger": {"calories": 398, "protein": 20, "fat": 25, "carbs": 28},
    "hand_rolls": {"calories": 200, "protein": 8, "fat": 5, "carbs": 32},
    "hash_browns": {"calories": 270, "protein": 3, "fat": 12, "carbs": 35},
    "head_cheese": {"calories": 215, "protein": 24, "fat": 12, "carbs": 0},
    "herb_salad": {"calories": 120, "protein": 4, "fat": 6, "carbs": 14},
    "herring": {"calories": 158, "protein": 18, "fat": 9, "carbs": 0},
    "hibachi": {"calories": 420, "protein": 30, "fat": 15, "carbs": 45},
    "home_made_guacamole": {"calories": 160, "protein": 2, "fat": 15, "carbs": 8},
    "hot_and_sour_soup": {"calories": 150, "protein": 12, "fat": 6, "carbs": 12},
    "hot_dog": {"calories": 280, "protein": 10, "fat": 16, "carbs": 27},
    "huevos_rancheros": {"calories": 380, "protein": 16, "fat": 18, "carbs": 42},
    "hummus": {"calories": 150, "protein": 5, "fat": 9, "carbs": 13},
    "humpback_whale": {"calories": 120, "protein": 24, "fat": 2, "carbs": 0},
    "ice_cream": {"calories": 207, "protein": 4, "fat": 11, "carbs": 24},
    "icecream_cone": {"calories": 240, "protein": 5, "fat": 12, "carbs": 32},
    "indian_bread": {"calories": 280, "protein": 7, "fat": 8, "carbs": 44},
    "irish_coffee": {"calories": 150, "protein": 0, "fat": 0, "carbs": 10},
    "italian_meatballs": {"calories": 280, "protein": 22, "fat": 16, "carbs": 10},
    "italian_parsley": {"calories": 36, "protein": 3, "fat": 1, "carbs": 6},
    "jalapeno_popper": {"calories": 180, "protein": 6, "fat": 12, "carbs": 12},
    "jambalaya": {"calories": 380, "protein": 18, "fat": 14, "carbs": 48},
    "japanese_noodles": {"calories": 340, "protein": 12, "fat": 2, "carbs": 70},
    "jelly_beans": {"calories": 354, "protein": 0, "fat": 1, "carbs": 88},
    "jerk_chicken": {"calories": 280, "protein": 28, "fat": 12, "carbs": 10},
    "jewel_yam": {"calories": 103, "protein": 2, "fat": 0, "carbs": 24},
    "jiffy_cornbread": {"calories": 180, "protein": 3, "fat": 6, "carbs": 28},
    
    # Default/fallback for unknown foods
    "default": {"calories": 300, "protein": 15, "fat": 10, "carbs": 35}
}

def get_nutrition(food_name):
    """
    Get nutrition information for a food item
    
    Args:
        food_name (str): Name of the food (should match Food-101 class names)
    
    Returns:
        dict: Nutrition information with calories, protein, fat, carbs
    """
    # Convert to lowercase and replace spaces with underscores to match keys
    normalized_name = food_name.lower().replace(" ", "_")
    
    # Return nutrition data if exists, otherwise return default
    if normalized_name in NUTRITION_DATABASE:
        return NUTRITION_DATABASE[normalized_name]
    else:
        return NUTRITION_DATABASE["default"]
