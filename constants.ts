export const SUBJECTS: string[] = [
  'Eiffel Tower',
  'Golden Gate Bridge',
  'Statue of Liberty',
  'Pyramids of Giza',
  'Great Wall of China',
  'Lion',
  'Elephant',
  'Dolphin',
  'Eagle',
  'Panda',
  'Guitar',
  'Piano',
  'Laptop',
  'Smartphone',
  'Pizza',
  'Hamburger',
  'Bicycle',
  'Car',
  'Airplane',
  'Hot Air Balloon'
];

export const MAX_ATTEMPTS = 5;

export const INITIAL_IMAGE_PROMPT = "An abstract image of pure, vibrant, colorful static noise. A latent concept of a ${subject} is encoded deep within the noise pattern, making it utterly imperceptible to the human eye. The image should resemble random television static with no discernible form.";

export const REFINEMENT_PROMPTS: string[] = [
  // After 1 wrong guess
  "Analyze the latent concept hidden in this noisy image. Denoise it by only 10-15%, revealing a handful of structured pixels or a faint color shift that hints at a larger form, but the ${subject} must remain completely unrecognizable and abstract.",
  // After 2 wrong guesses
  "Denoise the image further, to about 30% clarity. A very vague, ghostly silhouette of the ${subject} should start to emerge from the noise, but with no details, like a heavily distorted shadow in a blizzard.",
  // After 3 wrong guesses
  "Significantly denoise the image to 60% clarity. The main shape of the ${subject} should be identifiable to a keen observer, but it is still covered in a heavy layer of digital grain, artifacts, and color distortion.",
  // After 4 wrong guesses (last chance)
  "Denoise the image to 90% clarity. The ${subject} should be sharp and clear, but with a fine layer of noise still present, similar to a high-ISO photograph, and slight color inaccuracies.",
  // Final reveal image for win/loss
  "Completely remove all noise and artifacts. Render the ${subject} as a perfectly clear, photorealistic, high-resolution photograph.",
];

const DIFFICULTY_MODIFIERS: { [level: number]: string } = {
  0: "", // Streak 0-1
  1: " Additionally, render the image in a slightly more abstract, impressionistic painterly style.", // Streak 2-3
  2: " Additionally, use a highly abstract, minimalist cubist style and obscure parts of the subject with thick digital fog.", // Streak 4-5
  3: " Additionally, represent the subject metaphorically in a surrealist style, and use a disorienting fisheye lens perspective." // Streak 6+
};

const getDifficultyLevel = (streak: number): number => {
  if (streak >= 6) return 3;
  if (streak >= 4) return 2;
  if (streak >= 2) return 1;
  return 0;
};

export const getDynamicPrompt = (basePrompt: string, streak: number): string => {
  const level = getDifficultyLevel(streak);
  const modifier = DIFFICULTY_MODIFIERS[level];
  return `${basePrompt}${modifier}`;
};