import Ajv from 'ajv';

// Function to fetch and validate Lottie JSON
export const validateLottieJson = async (data: any): Promise<boolean> => {
  try {
    // Fetch schema from the public folder
    const response = await fetch('/lottie-schema.json');
    if (!response.ok) throw new Error('Failed to fetch schema');
    
    // Parse schema
    const schema = await response.json();
    
    // Create AJV instance and compile schema
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    
    // Validate data against schema
    const valid = validate(data);
    if (!valid) {
      console.error('Invalid Lottie JSON:', validate.errors);
    }
    
    return valid;
  } catch (error) {
    console.error('Error validating Lottie JSON:', error);
    return false;
  }
};

  
  