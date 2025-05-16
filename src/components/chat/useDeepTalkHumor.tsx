
import { useState, useCallback } from 'react';

// Import humor snippets from DeepCAL's oracle data
const humorQuips = [
  "Optimizing routes while you optimize your Netflix queue",
  "This algorithm runs smoother than your last Zoom presentation",
  "Risk assessment complete. Your life choices? Still questionable.",
  "Spending money like a crypto bro at a Lambo dealership",
  "Budget so tight it squeaks when you walk",
  "Riskier than a 'Hold My Beer' challenge at a fireworks factory",
  "More warning signs than a haunted house",
  "Service so good it makes your ex jealous",
  "Reliability higher than my last Uber rating",
  "As Einstein would say if he worked in logistics: E = MC² (Efficiency = Meticulous Calculations × Coffee²)",
  "I've analyzed your data using quantum algorithms and a dash of supply chain sorcery.",
  "This insight is 87% science, 12% math, and 1% logistics magic.",
  "Remember when logistics was just 'put thing in box, send box'? Those were simpler times."
];

// Technical jargon to sound impressive
const technicalPhrases = [
  "According to my neutrosophic AHP-TOPSIS analysis",
  "After applying Bayesian-Neural fusion optimization",
  "My Stochastic Dominance Analysis indicates",
  "Using Lambda-max eigenvalue decomposition (CR < 0.1)",
  "Based on the sigmoid transformation of reliability coefficients",
  "The M/G/k queueing model simulation suggests",
  "Our Data Envelopment Analysis with VRS assumption reveals"
];

export const useDeepCalHumor = (result: any, p0: string) => {
  const [usedQuips, setUsedQuips] = useState<Set<string>>(new Set());
  
  const getRandomQuip = useCallback(() => {
    // Filter out quips we've already used
    const availableQuips = humorQuips.filter(quip => !usedQuips.has(quip));
    
    // If we've used all quips, reset the used set
    if (availableQuips.length === 0) {
      setUsedQuips(new Set());
      return humorQuips[Math.floor(Math.random() * humorQuips.length)];
    }
    
    const selectedQuip = availableQuips[Math.floor(Math.random() * availableQuips.length)];
    setUsedQuips(prev => new Set([...prev, selectedQuip]));
    return selectedQuip;
  }, [usedQuips]);
  
  const getRandomTechnicalPhrase = useCallback(() => {
    return technicalPhrases[Math.floor(Math.random() * technicalPhrases.length)];
  }, []);
  
  return {
    getRandomQuip,
    getRandomTechnicalPhrase
  };
};

// Function to inject humor into responses
export const getHumorResponse = (text: string): string => {
  // Only inject humor 30% of the time to avoid being too weird
  if (Math.random() > 0.3) {
    return text;
  }
  
  // Don't add humor to short messages
  if (text.length < 50) {
    return text;
  }
  
  // Get a random humor quip
  const quipIndex = Math.floor(Math.random() * humorQuips.length);
  const quip = humorQuips[quipIndex];
  
  // Get a random technical phrase
  const phraseIndex = Math.floor(Math.random() * technicalPhrases.length);
  const phrase = technicalPhrases[phraseIndex];
  
  // Determine where to insert the humor
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  if (sentences.length <= 1) {
    return text;
  }
  
  // Choose a random position to insert our quip (not at the beginning or end)
  const position = Math.floor(Math.random() * (sentences.length - 1)) + 1;
  
  // Insert the quip with a technical phrase for extra flair
  if (Math.random() > 0.5) {
    sentences.splice(position, 0, `${phrase}, ${quip}`);
  } else {
    sentences.splice(position, 0, quip);
  }
  
  return sentences.join(' ');
};

export default useDeepCalHumor;
