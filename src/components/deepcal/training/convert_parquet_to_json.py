#!/usr/bin/env python
"""
Ultra-Futuristic Data Converter for DeepCAL Training Pipeline
Converts Parquet files to JSON format for DeepCAL training integration
"""

import sys
import os
import json
import pandas as pd
import logging
from datetime import datetime

# Set up logging with ultra-modern formatting
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('data-converter')

def convert_parquet_to_json(input_file, output_file):
    """
    Convert a Parquet file to JSON with advanced error handling and progress tracking
    
    Args:
        input_file: Path to the Parquet file
        output_file: Path to save the JSON output
    """
    try:
        # Log start time for performance metrics
        start_time = datetime.now()
        logger.info(f"Starting conversion of {os.path.basename(input_file)}")
        
        # Load the Parquet file
        logger.info("Reading Parquet file...")
        df = pd.read_parquet(input_file)
        
        # Log data shape for verification
        rows, cols = df.shape
        logger.info(f"Loaded data with {rows:,} rows and {cols} columns")
        
        # Convert DataFrame to JSON
        logger.info("Converting to JSON format...")
        json_data = df.to_json(orient='records')
        
        # Save the JSON data to the output file
        logger.info(f"Writing output to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(json_data)
        
        # Calculate and log metrics
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        size_mb = os.path.getsize(output_file) / (1024 * 1024)
        
        logger.info(f"Conversion completed successfully in {duration:.2f} seconds")
        logger.info(f"Output file size: {size_mb:.2f} MB")
        
        return True
    
    except Exception as e:
        logger.error(f"Error converting file: {str(e)}")
        return False

def main():
    """Main entry point with argument validation and error handling"""
    # Check command line arguments
    if len(sys.argv) != 3:
        logger.error("Usage: python convert_parquet_to_json.py <input_parquet_file> <output_json_file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    # Validate input file exists
    if not os.path.exists(input_file):
        logger.error(f"Input file not found: {input_file}")
        sys.exit(1)
    
    # Ensure output directory exists
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        logger.info(f"Creating output directory: {output_dir}")
        os.makedirs(output_dir)
    
    # Run the conversion
    success = convert_parquet_to_json(input_file, output_file)
    
    if success:
        logger.info(f"🚀 Conversion completed successfully. Data ready for DeepCAL training.")
    else:
        logger.error("❌ Conversion failed. Check logs for details.")
        sys.exit(1)

if __name__ == "__main__":
    main()
