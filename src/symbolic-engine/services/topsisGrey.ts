
// Implementation of TOPSIS with Grey Relations for decision making

export interface TopAlternative {
  index: number;
  score: number;
}

export interface TopsisResult {
  topAlternative: TopAlternative;
  allScores: number[];
}

/**
 * Run the TOPSIS algorithm with Grey Relational Analysis
 * @param matrix Decision matrix (alternatives × criteria)
 * @param weights Array of weights for each criterion
 * @param criteriaTypes Array specifying whether each criterion is 'benefit' or 'cost'
 * @returns Object with top alternative and all scores
 */
export function runTopsisWithGrey(
  matrix: number[][],
  weights: number[],
  criteriaTypes: ('benefit' | 'cost')[]
): TopsisResult {
  const m = matrix.length;    // Number of alternatives
  const n = matrix[0]?.length || 0; // Number of criteria
  
  if (m === 0 || n === 0) {
    return {
      topAlternative: { index: -1, score: 0 },
      allScores: []
    };
  }

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
  
  // Find the top alternative
  let topIdx = 0;
  let topScore = finalScores[0] || 0;
  
  finalScores.forEach((score, idx) => {
    if (score > topScore) {
      topScore = score;
      topIdx = idx;
    }
  });
  
  return {
    topAlternative: {
      index: topIdx,
      score: topScore
    },
    allScores: finalScores
  };
}

/**
 * Normalize a decision matrix based on criteria types
 */
function normalizeMatrix(matrix: number[][], criteriaTypes: ('benefit' | 'cost')[]): number[][] {
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
 */
function findIdealSolution(matrix: number[][], criteriaTypes: ('benefit' | 'cost')[]): number[] {
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
 */
function findAntiIdealSolution(matrix: number[][], criteriaTypes: ('benefit' | 'cost')[]): number[] {
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
