# DeepCAL Training Pipeline

This ultra-futuristic training pipeline integrates DeepCAL with the voice system for an immersive logistics experience.

## Data Conversion

The `convert_parquet_to_json.py` script transforms your Parquet data files into the JSON format required for DeepCAL training.

### Prerequisites

Install the required dependencies:

```bash
pip install pandas pyarrow
```

### Usage

Run the conversion script with your Parquet file as input:

```bash
python convert_parquet_to_json.py /path/to/part.000000.000000.parquet trained_data.json
```

Your `trained_data.json` will be written in the same directory you run the command from.

## Training Pipeline Integration

The conversion tool seamlessly connects with the DeepCAL agent and voice system through these steps:

1. **Data Conversion**: Transform your logistics data from Parquet to JSON
2. **Model Training**: Use the JSON data to train your DeepCAL model
3. **Voice Integration**: The trained model automatically connects with the voice system

## Training Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Parquet Data│ -> │ JSON Format │ -> │ DeepCAL     │ -> │ Voice System│
└─────────────┘    └─────────────┘    │ Training    │    └─────────────┘
                                      └─────────────┘
```

## Advanced Configuration

Edit the DeepCAL domain configuration in `freight_forwarder_domain.yml` to customize:

- Intents for logistics queries
- Entities for shipment tracking
- Custom responses for voice synthesis

## Training Status Monitoring

Training progress is visualized in the NodeGrid component which displays:
- Training node status
- Processing metrics
- Real-time completion indicators

## Voice System Integration

After training, your model will automatically connect with the voice system for natural language interactions.
