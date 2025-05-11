
/**
 * DeepCAL Engine TypeScript Implementation
 * 
 * This module implements the core DeepCAL decision-making algorithm using:
 * - Neutrosophic AHP (Analytic Hierarchy Process) for weights calculation
 * - TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) for ranking
 * - Grey Relational Analysis for uncertainty handling
 */

import { ForwarderScore, WeightFactors } from '@/components/deepcal/types';
import { traceCalculation } from './debugCalculations';

// Define the types for our input data
type ForwarderData = {
  forwarder: string;
  costScore: number;     // normalized cost performance (higher is better)
  timeScore: number;     // normalized time performance (higher is better)
  reliabilityScore: number;  // normalized reliability performance (higher is better)
};

/**
 * Main function to evaluate and rank forwarders based on weighted criteria
 * @param forwarderData Array of forwarder performance data
 * @param weights User preference weights for each criterion
 * @returns Array of ranked forwarders with calculated scores
 */
export function evaluateForwarders(
  forwarderData: ForwarderData[],
  weights: WeightFactors
): ForwarderScore[] {
  // Trace the calculation for debugging
  traceCalculation('evaluateForwarders', {
    inputData: forwarderData,
    weights: weights
  });

  // 1. Extract the criteria weights
  const criteriaWeights = {
    cost: weights.cost,
    time: weights.time,
    reliability: weights.reliability
  };
  
  // 2. Prepare decision matrix for TOPSIS
  const decisionMatrix = forwarderData.map(forwarder => [
    forwarder.costScore,  
    forwarder.timeScore,
    forwarder.reliabilityScore
  ]);
  
  // 3. Define benefit/cost type for each criterion (in our case, all are benefit - higher is better)
  const criteriaTypes = ['benefit', 'benefit', 'benefit'];
  
  // 4. Compute pairwise matrix from weights for AHP validation
  const pairwiseMatrix = generatePairwiseMatrix([
    criteriaWeights.cost, 
    criteriaWeights.time, 
    criteriaWeights.reliability
  ]);
  
  // 5. Validate consistency of weights using AHP
  const isConsistent = checkConsistencyRatio(pairwiseMatrix);
  
  // 6. Run TOPSIS algorithm with Grey relation analysis
  const { allScores, greyGrades } = runTopsisWithGrey(
    decisionMatrix, 
    [criteriaWeights.cost, criteriaWeights.time, criteriaWeights.reliability],
    criteriaTypes
  );
  
  // 7. Create the resulting ForwarderScore array
  const result: ForwarderScore[] = forwarderData.map((forwarder, index) => ({
    forwarder: forwarder.forwarder,
    score: allScores[index],
    closeness: allScores[index],  // closeness coefficient from TOPSIS
    costPerformance: forwarder.costScore,
    timePerformance: forwarder.timeScore,
    reliabilityPerformance: forwarder.reliabilityScore,
    greyGrade: greyGrades[index]  // additional metric from Grey analysis
  }));
  
  // 8. Sort by score in descending order
  result.sort((a, b) => b.score - a.score);
  
  // Trace the calculation output for debugging
  traceCalculation('evaluateForwarders', {
    inputData: forwarderData, 
    weights: weights
  }, result);
  
  return result;
}

/**
 * Generate a pairwise comparison matrix from a weight vector
 * @param weights Array of weights for each criterion
 * @returns Matrix of pairwise comparisons
 */
function generatePairwiseMatrix(weights: number[]): number[][] {
  const n = weights.length;
  const matrix = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Calculate the ratio of weights for each pair
      matrix[i][j] = weights[i] / weights[j];
    }
  }
  
  return matrix;
}

/**
 * Check the consistency ratio of a pairwise comparison matrix
 * @param matrix Pairwise comparison matrix
 * @param threshold Maximum acceptable consistency ratio (default: 0.1)
 * @returns True if the matrix is consistent, false otherwise
 */
function checkConsistencyRatio(matrix: number[][], threshold = 0.1): boolean {
  const n = matrix.length;
  
  // Calculate row sums and normalize to get the principal eigenvector
  const rowSums = matrix.map(row => row.reduce((sum, val) => sum + val, 0));
  const total = rowSums.reduce((sum, val) => sum + val, 0);
  const priorities = rowSums.map(sum => sum / total);
  
  // Compute the largest eigenvalue (lambda max)
  let lambdaMax = 0;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix[i][j] * priorities[j];
    }
    lambdaMax += sum / priorities[i];
  }
  lambdaMax /= n;
  
  // Calculate consistency index
  const CI = (lambdaMax - n) / (n - 1);
  
  // Random Consistency Index values (from Saaty's research)
  const RI = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
  
  // Calculate consistency ratio
  const CR = CI / (n < RI.length ? RI[n - 1] : 1.5);
  
  return CR < threshold;
}

/**
 * Run the TOPSIS algorithm with Grey Relational Analysis
 * @param matrix Decision matrix (alternatives × criteria)
 * @param weights Array of weights for each criterion
 * @param criteriaTypes Array specifying whether each criterion is 'benefit' or 'cost'
 * @returns Object with closeness coefficients and grey relational grades
 */
function runTopsisWithGrey(
  matrix: number[][],
  weights: number[],
  criteriaTypes: string[]
): { allScores: number[], greyGrades: number[] } {
  const m = matrix.length;    // Number of alternatives
  const n = matrix[0].length; // Number of criteria
  
  // 1. Normalize the decision matrix
  const normMatrix = normalizeMatrix(matrix, criteriaTypes);
  
  // 2. Apply weights to the normalized matrix
  const weightedMatrix = applyWeights(normMatrix, weights);
  
  // 3. Determine ideal and anti-ideal solutions
  const idealSolution = findIdealSolution(weightedMatrix, criteriaTypes);
  const antiIdealSolution = findAntiIdealSolution(weightedMatrix, criteriaTypes);
  
  // 4. Calculate distances to ideal and anti-ideal solutions
  const distances = calculateDistances(weightedMatrix, idealSolution, antiIdealSolution);
  
  // 5. Calculate closeness coefficients
  const closenessCoefficients = distances.map(d => 
    d.distanceToAntiIdeal / (d.distanceToIdeal + d.distanceToAntiIdeal)
  );
  
  // 6. Calculate Grey Relational Grades
  const greyGrades = calculateGreyRelationalGrades(normMatrix);
  
  // 7. Calculate the final scores as a weighted combination of TOPSIS and Grey
  const finalScores = closenessCoefficients.map((cc, idx) => 
    0.7 * cc + 0.3 * greyGrades[idx]
  );
  
  return {
    allScores: finalScores,
    greyGrades: greyGrades
  };
}

/**
 * Normalize a decision matrix based on criteria types
 * @param matrix Original decision matrix
 * @param criteriaTypes Array specifying whether each criterion is 'benefit' or 'cost'
 * @returns Normalized decision matrix
 */
function normalizeMatrix(matrix: number[][], criteriaTypes: string[]): number[][] {
  const m = matrix.length;    // Number of alternatives
  const n = matrix[0].length; // Number of criteria
  
  // Calculate the normalization factors (square root of sum of squares for each column)
  const normFactors = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sumOfSquares = 0;
    for (let i = 0; i < m; i++) {
      sumOfSquares += matrix[i][j] * matrix[i][j];
    }
    normFactors[j] = Math.sqrt(sumOfSquares);
  }
  
  // Normalize the matrix
  const normMatrix = Array(m).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (normFactors[j] === 0) {
        normMatrix[i][j] = 0;
      } else {
        // For cost criteria, higher values are worse, so we invert the normalization
        if (criteriaTypes[j] === 'cost') {
          normMatrix[i][j] = 1 - (matrix[i][j] / normFactors[j]);
        } else {
          normMatrix[i][j] = matrix[i][j] / normFactors[j];
        }
      }
    }
  }
  
  return normMatrix;
}

/**
 * Apply weights to a normalized decision matrix
 * @param matrix Normalized decision matrix
 * @param weights Array of weights for each criterion
 * @returns Weighted normalized decision matrix
 */
function applyWeights(matrix: number[][], weights: number[]): number[][] {
  const m = matrix.length;    // Number of alternatives
  const n = matrix[0].length; // Number of criteria
  
  const weightedMatrix = Array(m).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      weightedMatrix[i][j] = matrix[i][j] * weights[j];
    }
  }
  
  return weightedMatrix;
}

/**
 * Find the ideal solution (maximum for benefit criteria, minimum for cost criteria)
 * @param matrix Weighted normalized decision matrix
 * @param criteriaTypes Array specifying whether each criterion is 'benefit' or 'cost'
 * @returns Ideal solution array
 */
function findIdealSolution(matrix: number[][], criteriaTypes: string[]): number[] {
  const m = matrix.length;    // Number of alternatives
  const n = matrix[0].length; // Number of criteria
  
  const idealSolution = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const values = matrix.map(row => row[j]);
    // For benefit criteria, the ideal value is the maximum
    // For cost criteria, the ideal value is the minimum
    idealSolution[j] = criteriaTypes[j] === 'benefit' ? Math.max(...values) : Math.min(...values);
  }
  
  return idealSolution;
}

/**
 * Find the anti-ideal solution (minimum for benefit criteria, maximum for cost criteria)
 * @param matrix Weighted normalized decision matrix
 * @param criteriaTypes Array specifying whether each criterion is 'benefit' or 'cost'
 * @returns Anti-ideal solution array
 */
function findAntiIdealSolution(matrix: number[][], criteriaTypes: string[]): number[] {
  const m = matrix.length;    // Number of alternatives
  const n = matrix[0].length; // Number of criteria
  
  const antiIdealSolution = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const values = matrix.map(row => row[j]);
    // For benefit criteria, the anti-ideal value is the minimum
    // For cost criteria, the anti-ideal value is the maximum
    antiIdealSolution[j] = criteriaTypes[j] === 'benefit' ? Math.min(...values) : Math.max(...values);
  }
  
  return antiIdealSolution;
}

/**
 * Calculate distances to ideal and anti-ideal solutions
 * @param matrix Weighted normalized decision matrix
 * @param idealSolution Ideal solution array
 * @param antiIdealSolution Anti-ideal solution array
 * @returns Array of distances to ideal and anti-ideal solutions
 */
function calculateDistances(
  matrix: number[][],
  idealSolution: number[],
  antiIdealSolution: number[]
): { distanceToIdeal: number, distanceToAntiIdeal: number }[] {
  const m = matrix.length;    // Number of alternatives
  const n = matrix[0].length; // Number of criteria
  
  const distances = Array(m).fill(0).map(() => ({
    distanceToIdeal: 0,
    distanceToAntiIdeal: 0
  }));
  
  for (let i = 0; i < m; i++) {
    let sumIdeal = 0;
    let sumAntiIdeal = 0;
    
    for (let j = 0; j < n; j++) {
      sumIdeal += Math.pow(matrix[i][j] - idealSolution[j], 2);
      sumAntiIdeal += Math.pow(matrix[i][j] - antiIdealSolution[j], 2);
    }
    
    distances[i].distanceToIdeal = Math.sqrt(sumIdeal);
    distances[i].distanceToAntiIdeal = Math.sqrt(sumAntiIdeal);
  }
  
  return distances;
}

/**
 * Calculate Grey Relational Grades
 * @param matrix Normalized decision matrix
 * @returns Array of Grey Relational Grades
 */
function calculateGreyRelationalGrades(matrix: number[][]): number[] {
  const m = matrix.length;    // Number of alternatives
  const n = matrix[0].length; // Number of criteria
  
  // Reference series (ideal solution in Grey theory)
  const refSeries = Array(n).fill(1); // For normalized values, reference is always 1
  
  // Coefficient for Grey Relational Analysis
  const zeta = 0.5; // Typically used value
  
  // Calculate absolute differences
  const absDiffs = matrix.map(row => 
    row.map((val, j) => Math.abs(val - refSeries[j]))
  );
  
  // Find global min and max differences
  let minDiff = Infinity;
  let maxDiff = -Infinity;
  
  absDiffs.forEach(row => {
    row.forEach(diff => {
      if (diff < minDiff) minDiff = diff;
      if (diff > maxDiff) maxDiff = diff;
    });
  });
  
  // Calculate Grey Relational Coefficients
  const greyCoefficients = absDiffs.map(row => 
    row.map(diff => (minDiff + zeta * maxDiff) / (diff + zeta * maxDiff))
  );
  
  // Calculate Grey Relational Grades
  const greyGrades = greyCoefficients.map(row => 
    row.reduce((sum, val) => sum + val, 0) / n
  );
  
  return greyGrades;
}

/**
 * Create sample forwarder data for testing
 * @returns Array of sample forwarder data
 */
export function getSampleForwarderData(): ForwarderData[] {
  return [
    {
      forwarder: "DHL Express",
      costScore: 0.78, 
      timeScore: 0.90,
      reliabilityScore: 0.85
    },
    {
      forwarder: "FedEx",
      costScore: 0.75, 
      timeScore: 0.85,
      reliabilityScore: 0.90
    },
    {
      forwarder: "UPS",
      costScore: 0.70, 
      timeScore: 0.80,
      reliabilityScore: 0.85
    },
    {
      forwarder: "Kuehne + Nagel",
      costScore: 0.85, 
      timeScore: 0.76,
      reliabilityScore: 0.83
    },
    {
      forwarder: "DSV",
      costScore: 0.88, 
      timeScore: 0.72,
      reliabilityScore: 0.79
    }
  ];
}
