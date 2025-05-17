
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, AlertTriangle, ShieldCheck, Upload } from 'lucide-react';
import { boot, initDecisionEngine } from '@/init/boot';
import { simpleHash } from '@/services/fileHasher';
import { useBaseDataStore } from '@/store/baseState';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ensureCompleteShipment } from '@/utils/typeAdapters';

const DataBootLoader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isDataLoaded, setShipmentData } = useBaseDataStore();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
  };
  
  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    // Check file type
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Read the file
      const text = await file.text();
      
      // Parse CSV (very basic parser, in a real app use a proper CSV parser)
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1)
        .filter(line => line.trim().length > 0)
        .map(line => {
          const values = line.split(',');
          const row: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            // Try to parse numbers
            const value = values[index]?.trim() || '';
            const numValue = parseFloat(value);
            row[header] = isNaN(numValue) ? value : numValue;
          });
          
          return row;
        });
      
      // Boot the system with the data
      const success = await boot({
        file: file.name,
        requireShape: [
          'request_reference', 'origin_country', 'destination_country', 
          'weight_kg', 'delivery_status'
        ],
        minRows: 1,
        onSuccess: initDecisionEngine,
        onFail: (err) => {
          setError(err.message);
          throw err;
        }
      }, data);
      
      if (success) {
        // Store the data
        const dataHash = simpleHash(text);
        const dataVersion = `v1.0.0-${new Date().toISOString()}`;
        
        // Process the data into Shipment objects with complete type safety
        const processedData = data.map(item => ensureCompleteShipment({
          id: item.request_reference || `gen-${Math.random().toString(36).substring(2, 10)}`,
          date_of_collection: item.date_of_collection || '',
          request_reference: item.request_reference || '',
          cargo_description: item.cargo_description || '',
          item_category: item.item_category || '',
          origin_country: item.origin_country || '',
          origin_longitude: parseFloat(String(item.origin_longitude)) || 0,
          origin_latitude: parseFloat(String(item.origin_latitude)) || 0,
          destination_country: item.destination_country || '',
          destination_longitude: parseFloat(String(item.destination_longitude)) || 0,
          destination_latitude: parseFloat(String(item.destination_latitude)) || 0,
          freight_carrier: item.freight_carrier || '',
          carrier: item.carrier || item.freight_carrier || '',
          weight_kg: item.weight_kg || 0,
          volume_cbm: item.volume_cbm || 0,
          initial_quote_awarded: item.initial_quote_awarded || '',
          final_quote_awarded_freight_forwader_Carrier: item.final_quote_awarded_freight_forwader_Carrier || '',
          comments: item.comments || '',
          date_of_arrival_destination: item.date_of_arrival_destination || '',
          delivery_status: item.delivery_status || '',
          mode_of_shipment: item.mode_of_shipment || '',
          forwarder_quotes: {
            'kenya_airways': item.kenya_airways || 0,
            'kuehne_nagel': item.kuehne_nagel || 0,
            'scan_global_logistics': item.scan_global_logistics || 0,
            'dhl_express': item.dhl_express || 0,
            'dhl_global': item.dhl_global || 0,
            'bwosi': item.bwosi || 0,
            'agl': item.agl || 0,
            'siginon': item.siginon || 0,
            'frieght_in_time': item.frieght_in_time || 0,
          }
        }));
        
        setShipmentData(
          processedData,
          file.name,
          dataVersion,
          dataHash
        );
        
        toast({
          title: "Data Loaded Successfully",
          description: `Processed ${data.length} records from ${file.name}`,
        });
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : String(err));
      
      toast({
        title: "Data Loading Failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [file, setShipmentData]);
  
  const handleMockData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the sample data from the engine
      const mockData = [
        {
          date_of_collection: "11-Jan-24",
          request_reference: "SR_24-001_NBO hub_Zimbabwe",
          cargo_description: "Cholera kits and Tents",
          item_category: "Emergency Health Kits",
          origin_country: "Kenya",
          origin_longitude: "1.2404475",
          origin_latitude: "36.990054",
          destination_country: "Zimbabwe",
          destination_longitude: "-17.80269125",
          destination_latitude: "31.08848075",
          freight_carrier: "Kenya Airways",
          carrier: "Kenya Airways",
          kenya_airways: 18681,
          kuehne_nagel: 18681,
          scan_global_logistics: 0,
          dhl_express: 0,
          dhl_global: 0,
          bwosi: 0,
          agl: 0,
          siginon: 0,
          frieght_in_time: 0,
          weight_kg: "7352.98",
          volume_cbm: "24.68",
          initial_quote_awarded: "Kuehne Nagel",
          final_quote_awarded_freight_forwader_Carrier: "Kenya Airways",
          comments: "Kenya Airways via Kuehne Nagel",
          date_of_arrival_destination: "17-Jan-24",
          delivery_status: "Delivered",
          mode_of_shipment: "Air"
        },
        // Add a few more sample records for variety
        {
          date_of_collection: "15-Jan-24",
          request_reference: "SR_24-002_NBO hub_South Sudan",
          cargo_description: "COVID-19 Test Kits",
          item_category: "Medical Supplies",
          origin_country: "Kenya",
          origin_longitude: "1.2404475",
          origin_latitude: "36.990054",
          destination_country: "South Sudan",
          destination_longitude: "6.8770",
          destination_latitude: "31.3070",
          freight_carrier: "DHL Express",
          carrier: "DHL Express",
          kenya_airways: 0,
          kuehne_nagel: 0,
          scan_global_logistics: 12500,
          dhl_express: 11800,
          dhl_global: 12000,
          bwosi: 0,
          agl: 0,
          siginon: 0,
          frieght_in_time: 0,
          weight_kg: "520.75",
          volume_cbm: "2.3",
          initial_quote_awarded: "DHL Express",
          final_quote_awarded_freight_forwader_Carrier: "DHL Express",
          comments: "Urgent medical supplies",
          date_of_arrival_destination: "18-Jan-24",
          delivery_status: "Delivered",
          mode_of_shipment: "Air"
        },
        {
          date_of_collection: "20-Jan-24",
          request_reference: "SR_24-003_NBO hub_Ethiopia",
          cargo_description: "Water purification tablets",
          item_category: "Water Supplies",
          origin_country: "Kenya",
          origin_longitude: "1.2404475",
          origin_latitude: "36.990054",
          destination_country: "Ethiopia",
          destination_longitude: "9.1450",
          destination_latitude: "40.4897",
          freight_carrier: "Freight In Time",
          carrier: "Freight In Time",
          kenya_airways: 0,
          kuehne_nagel: 8500,
          scan_global_logistics: 8200,
          dhl_express: 0,
          dhl_global: 0,
          bwosi: 0,
          agl: 0,
          siginon: 0,
          frieght_in_time: 7800,
          weight_kg: "3250.50",
          volume_cbm: "12.4",
          initial_quote_awarded: "Freight In Time",
          final_quote_awarded_freight_forwader_Carrier: "Freight In Time",
          comments: "Drought relief supplies",
          date_of_arrival_destination: "28-Jan-24",
          delivery_status: "Delivered",
          mode_of_shipment: "Road"
        }
      ];
      
      // Boot with the mock data
      const success = await boot({
        file: 'mock_data.csv',
        requireShape: [
          'request_reference', 'origin_country', 'destination_country', 
          'weight_kg', 'delivery_status'
        ],
        minRows: 1,
        onSuccess: initDecisionEngine,
        onFail: (err) => {
          setError(err.message);
          throw err;
        }
      }, mockData);
      
      if (success) {
        // Generate fake hash and version for mock data
        const dataHash = simpleHash(JSON.stringify(mockData));
        const dataVersion = `v1.0.0-mock-${new Date().toISOString()}`;
        
        // Store the data with complete type safety
        const processedData = mockData.map(item => ensureCompleteShipment({
          id: item.request_reference || `gen-${Math.random().toString(36).substring(2, 10)}`,
          date_of_collection: item.date_of_collection || '',
          request_reference: item.request_reference || '',
          cargo_description: item.cargo_description || '',
          item_category: item.item_category || '',
          origin_country: item.origin_country || '',
          origin_longitude: parseFloat(String(item.origin_longitude)) || 0,
          origin_latitude: parseFloat(String(item.origin_latitude)) || 0,
          destination_country: item.destination_country || '',
          destination_longitude: parseFloat(String(item.destination_longitude)) || 0,
          destination_latitude: parseFloat(String(item.destination_latitude)) || 0,
          freight_carrier: item.freight_carrier || '',
          carrier: item.carrier || item.freight_carrier || '',
          weight_kg: item.weight_kg || 0,
          volume_cbm: item.volume_cbm || 0,
          initial_quote_awarded: item.initial_quote_awarded || '',
          final_quote_awarded_freight_forwader_Carrier: item.final_quote_awarded_freight_forwader_Carrier || '',
          comments: item.comments || '',
          date_of_arrival_destination: item.date_of_arrival_destination || '',
          delivery_status: item.delivery_status || '',
          mode_of_shipment: item.mode_of_shipment || '',
          forwarder_quotes: {
            'kenya_airways': item.kenya_airways || 0,
            'kuehne_nagel': item.kuehne_nagel || 0,
            'scan_global_logistics': item.scan_global_logistics || 0,
            'dhl_express': item.dhl_express || 0,
            'dhl_global': item.dhl_global || 0,
            'bwosi': item.bwosi || 0,
            'agl': item.agl || 0,
            'siginon': item.siginon || 0,
            'frieght_in_time': item.frieght_in_time || 0,
          }
        }));
        
        setShipmentData(
          processedData,
          'mock_data.csv',
          dataVersion,
          dataHash
        );
        
        toast({
          title: "Demo Data Loaded",
          description: `Loaded ${mockData.length} sample records`,
        });
      }
    } catch (err) {
      console.error("Error loading demo data:", err);
      setError(err instanceof Error ? err.message : String(err));
      
      toast({
        title: "Demo Data Loading Failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setShipmentData]);
  
  if (isDataLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
            System Booted Successfully
          </CardTitle>
          <CardDescription>
            DeepCAL engine is running with verified data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The system has been successfully initialized with the canonical dataset.
            All features are now available.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          System Boot Required
        </CardTitle>
        <CardDescription>
          DeepCAL requires canonical data to operate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Following the "No Data, No Feature" doctrine, all features are locked until 
              verified canonical data is loaded. Please upload the required CSV file.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="csv-file">Upload deeptrack_2.csv</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleMockData}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Use Demo Data'
          )}
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Boot
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataBootLoader;
