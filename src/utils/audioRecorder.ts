
/**
 * Cross-browser audio recording utility
 * 
 * This utility provides functions for recording audio in different browsers
 * with consistent output formats for speech-to-text processing.
 */

// Audio recording states
export enum RecordingState {
  INACTIVE = 'inactive',
  RECORDING = 'recording',
  PAUSED = 'paused',
  ERROR = 'error'
}

// Configuration options for the audio recorder
interface AudioRecorderOptions {
  onStateChange?: (state: RecordingState) => void;
  onDataAvailable?: (blob: Blob) => void;
  onError?: (error: Error) => void;
  mimeType?: string;
  audioBitsPerSecond?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private state: RecordingState = RecordingState.INACTIVE;
  private options: AudioRecorderOptions;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private requestAnimationId: number | null = null;

  constructor(options: AudioRecorderOptions = {}) {
    this.options = {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 128000,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      ...options
    };
  }

  /**
   * Check if the browser supports audio recording
   * @returns True if recording is supported
   */
  public static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Check if a specific mime type is supported
   * @param mimeType The mime type to check
   * @returns True if the mime type is supported
   */
  public static isMimeTypeSupported(mimeType: string): boolean {
    return MediaRecorder.isTypeSupported(mimeType);
  }

  /**
   * Get the best supported mime type for the current browser
   * @returns The best mime type or null if none supported
   */
  public static getBestMimeType(): string | null {
    const mimeTypes = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/wav',
      'audio/mp4'
    ];
    
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }
    
    return null;
  }

  /**
   * Start recording audio
   * @returns Promise that resolves when recording starts
   */
  public async start(): Promise<void> {
    if (this.state === RecordingState.RECORDING) {
      return;
    }

    try {
      this.audioChunks = [];
      
      // Request access to the microphone
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: this.options.echoCancellation,
          noiseSuppression: this.options.noiseSuppression,
          autoGainControl: this.options.autoGainControl
        }
      });
      
      // Set up audio context for visualization (if needed)
      this.setupAudioContext();

      // Get the best supported mime type if none provided
      const mimeType = this.options.mimeType || AudioRecorder.getBestMimeType() || '';
      
      // Create media recorder with options
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : '',
        audioBitsPerSecond: this.options.audioBitsPerSecond
      });
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          
          if (this.options.onDataAvailable) {
            this.options.onDataAvailable(event.data);
          }
        }
      };
      
      this.mediaRecorder.onstart = () => {
        this.setState(RecordingState.RECORDING);
        this.startVisualization();
      };
      
      this.mediaRecorder.onpause = () => {
        this.setState(RecordingState.PAUSED);
        this.stopVisualization();
      };
      
      this.mediaRecorder.onresume = () => {
        this.setState(RecordingState.RECORDING);
        this.startVisualization();
      };
      
      this.mediaRecorder.onstop = () => {
        this.setState(RecordingState.INACTIVE);
        this.stopVisualization();
      };
      
      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        this.setState(RecordingState.ERROR);
        this.stopVisualization();
        if (this.options.onError) {
          this.options.onError(new Error('MediaRecorder error'));
        }
      };
      
      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms for streaming capability
      
    } catch (error) {
      console.error('Error starting audio recording:', error);
      this.setState(RecordingState.ERROR);
      if (this.options.onError) {
        this.options.onError(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }

  /**
   * Pause the recording
   */
  public pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.stopVisualization();
    }
  }

  /**
   * Resume a paused recording
   */
  public resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.startVisualization();
    }
  }

  /**
   * Stop recording and get the recorded audio
   * @returns Promise that resolves with the audio blob
   */
  public async stop(): Promise<Blob> {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
      return new Blob();
    }
    
    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        this.setState(RecordingState.INACTIVE);
        this.stopVisualization();
        this.releaseResources();
        
        // Create final audio blob with all chunks
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder!.mimeType });
        resolve(audioBlob);
      };
      
      this.mediaRecorder!.stop();
    });
  }

  /**
   * Get the current recording state
   * @returns The current state
   */
  public getState(): RecordingState {
    return this.state;
  }

  /**
   * Release all resources used by the recorder
   */
  public releaseResources(): void {
    this.stopVisualization();
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
      this.dataArray = null;
    }
    
    this.mediaRecorder = null;
  }

  /**
   * Set up audio context for visualization
   */
  private setupAudioContext(): void {
    if (!this.stream) return;
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    
    const source = this.audioContext.createMediaStreamSource(this.stream);
    source.connect(this.analyser);
    
    // Create data array for visualization
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  /**
   * Start visualizing the audio data
   */
  private startVisualization(): void {
    if (!this.analyser || !this.dataArray) return;
    
    const updateVisualization = () => {
      if (!this.analyser || !this.dataArray) return;
      
      this.analyser.getByteFrequencyData(this.dataArray);
      // We're just getting the data here
      // To actually visualize it, provide the dataArray to a visualization component
      
      this.requestAnimationId = requestAnimationFrame(updateVisualization);
    };
    
    this.requestAnimationId = requestAnimationFrame(updateVisualization);
  }

  /**
   * Stop the visualization
   */
  private stopVisualization(): void {
    if (this.requestAnimationId !== null) {
      cancelAnimationFrame(this.requestAnimationId);
      this.requestAnimationId = null;
    }
  }

  /**
   * Update the current state and notify listeners
   * @param newState The new state
   */
  private setState(newState: RecordingState): void {
    this.state = newState;
    if (this.options.onStateChange) {
      this.options.onStateChange(newState);
    }
  }

  /**
   * Convert a recorded blob to a base64 string
   * @param blob Audio blob to convert
   * @returns Promise that resolves with the base64 string
   */
  public static async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1] || base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export default AudioRecorder;
