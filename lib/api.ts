// // API client for interacting with the backend services

// // Types for image generation requests and responses
// export interface ImageGenerationRequest {
//   prompt: string;
//   negative_prompt?: string;
//   num_inference_steps?: number;
//   guidance_scale?: number;
//   width?: number;
//   height?: number;
//   seed?: number;
// }

// export interface ImageGenerationResponse {
//   cloudinary_url: string;
//   prompt: string;
// }

// export interface ImageBatchGenerationRequest {
//   prompts: string[];
//   negative_prompt?: string;
//   num_inference_steps?: number;
//   guidance_scale?: number;
//   width?: number;
//   height?: number;
//   seed?: number;
// }

// export interface ImageBatchGenerationResponse {
//   images: ImageGenerationResponse[];
// }

// // Base URL for the Modal backend
// // This will be replaced with the actual deployed URL
// const MODAL_BASE_URL = process.env.NEXT_PUBLIC_MODAL_API_URL || '';

// /**
//  * Generate a single image using the backend service
//  * @param request The image generation request parameters
//  * @returns Promise with the generated image data
//  */
// // Modal Proxy Auth Token credentials
// const MODAL_KEY = process.env.NEXT_PUBLIC_MODAL_KEY || '';
// const MODAL_SECRET = process.env.NEXT_PUBLIC_MODAL_SECRET || '';

// export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
//   const response = await fetch(`${MODAL_BASE_URL}/generate_image_endpoint`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Modal-Key': MODAL_KEY,
//       'Modal-Secret': MODAL_SECRET,
//     },
//     body: JSON.stringify(request),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to generate image: ${errorText}`);
//   }

//   return response.json();
// }

// /**
//  * Generate multiple images in a batch
//  * @param request The batch image generation request
//  * @returns Promise with the generated images data
//  */
// export async function generateImageBatch(request: ImageBatchGenerationRequest): Promise<ImageBatchGenerationResponse> {
//   const response = await fetch(`${MODAL_BASE_URL}/generate_image_batch`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Modal-Key': MODAL_KEY,
//       'Modal-Secret': MODAL_SECRET,
//     },
//     body: JSON.stringify(request),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to generate image batch: ${errorText}`);
//   }

//   return response.json();
// }

// /**
//  * Generate an image and get the base64 data directly
//  * @param request The image generation request parameters
//  * @returns Promise with the base64 image data
//  */
// export async function generateImageBase64(request: ImageGenerationRequest): Promise<{image_data: string; prompt: string}> {
//   const response = await fetch(`${MODAL_BASE_URL}/generate_image_base64`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Modal-Key': MODAL_KEY,
//       'Modal-Secret': MODAL_SECRET,
//     },
//     body: JSON.stringify(request),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to generate base64 image: ${errorText}`);
//   }

//   return response.json();
// }


// lib/api.ts
// API client for interacting with the Modal backend services

// Types for image generation requests and responses
export interface ImageGenerationRequest {
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
  width?: number;
  height?: number;
  seed?: number;
}

export interface ImageGenerationResponse {
  cloudinary_url: string;
  prompt: string;
}

export interface ImageBatchGenerationRequest {
  prompts: string[];
  negative_prompt?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
  width?: number;
  height?: number;
  seed?: number;
}

export interface ImageBatchGenerationResponse {
  images: ImageGenerationResponse[];
}

// Modal endpoint URLs - Use the exact URLs from your deployment
const ENDPOINTS = {
  generateImage: 'https://akashmore83386--image-generator-imagegenserver-generate--228f5a.modal.run',
  generateImageBase64: 'https://akashmore83386--image-generator-imagegenserver-generate--461b77.modal.run',
  generateImageBatch: 'https://akashmore83386--image-generator-imagegenserver-generate--9fb909.modal.run',
  uploadToCloudinary: 'https://akashmore83386--image-generator-imagegenserver-upload-to-ee66a6.modal.run'
};

/**
 * Generate a single image using the backend service
 * @param request The image generation request parameters
 * @returns Promise with the generated image data
 */
export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    console.log('Sending request to Modal:', ENDPOINTS.generateImage);
    console.log('Request payload:', request);

    const response = await fetch(ENDPOINTS.generateImage, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Remove Modal-Key and Modal-Secret headers as they're not needed for web endpoints
      },
      body: JSON.stringify(request),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to generate image (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('Success response:', result);
    return result;
  } catch (error) {
    console.error('Generate image error:', error);
    throw error;
  }
}

/**
 * Generate multiple images in a batch
 * @param request The batch image generation request
 * @returns Promise with the generated images data
 */
export async function generateImageBatch(request: ImageBatchGenerationRequest): Promise<ImageBatchGenerationResponse> {
  try {
    console.log('Sending batch request to Modal:', ENDPOINTS.generateImageBatch);
    
    const response = await fetch(ENDPOINTS.generateImageBatch, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Batch error response:', errorText);
      throw new Error(`Failed to generate image batch (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Generate image batch error:', error);
    throw error;
  }
}

/**
 * Generate an image and get the base64 data directly
 * @param request The image generation request parameters
 * @returns Promise with the base64 image data
 */
export async function generateImageBase64(request: ImageGenerationRequest): Promise<{image_data: string; prompt: string}> {
  try {
    console.log('Sending base64 request to Modal:', ENDPOINTS.generateImageBase64);
    
    const response = await fetch(ENDPOINTS.generateImageBase64, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Base64 error response:', errorText);
      throw new Error(`Failed to generate base64 image (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Generate image base64 error:', error);
    throw error;
  }
}

// Test function to check if the API is working
export async function testConnection(): Promise<boolean> {
  try {
    const testRequest: ImageGenerationRequest = {
      prompt: "test image",
      width: 512,
      height: 512,
      num_inference_steps: 10,
      guidance_scale: 7.5
    };

    await generateImage(testRequest);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}