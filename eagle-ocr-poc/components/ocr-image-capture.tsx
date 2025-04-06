'use client';

import { useState, useRef, useCallback } from 'react';
import { createWorker                  } from 'tesseract.js';
import { Button                        } from "@heroui/button";
import { Card, CardBody, CardHeader    } from "@heroui/card";
import { Spinner                       } from "@heroui/spinner";
import Webcam                            from 'react-webcam';

const OcrImageCapture = () => {
  // WEB RELATED
  const webcamRef                             = useRef<Webcam>(null);            // Webcam reference
  const videoConstraints = {width: 1280,height: 720, facingMode: "environment"}; // Video constraints
  const [isCameraActive,   setIsCameraActive] = useState(false);                 // Camera active state
  // OCR RELATED
  const [capturedImage,    setCapturedImage]  = useState<string | null>(null);   // Captured image
  const [ocrResult,        setOcrResult]      = useState<string>('');            // OCR result
  const [ocrStatus,        setOcrStatus]      = useState<string>('');            // OCR status
  const [isProcessing,     setIsProcessing]   = useState(false);                 // Processing state

  // HANDLE CAMERA START/STOP
  const startCamera = () => {
    setIsCameraActive(true);
    setOcrResult('');//reset ocr result
    setOcrStatus('');//reset ocr status
  };
  const stopCamera = () => {
    setIsCameraActive(false);
  };

  // HANDLE IMAGE CAPTURE / RETAKE
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCameraActive(false);
    }
  }, [webcamRef]);
  const retake = () => {
    setCapturedImage(null);
    setOcrResult('');
    setOcrStatus('');
  };

  // HANDLE IMAGE TEXT EXTRACTION
  const readImageText = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    setOcrStatus('Processing...');
    const worker = await createWorker('eng', 1, {
      logger: m => console.log(m),
    });
    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const {data: { text },} = await worker.recognize(blob);
      setOcrResult(text);
      setOcrStatus('Completed');
    } catch (error) {
      console.error(error);
      setOcrStatus('Error occurred during processing.');
    } finally {
      await worker.terminate();
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Camera Capture Card */}
      <Card className="p-4">
        <CardHeader className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">OCR Camera Capture</h2>
          <p className="text-default-500">Capture an image using your camera to extract text using OCR</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="w-full">
            {isCameraActive ? (
              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <Button
                    onPress={stopCamera}
                    color="danger"
                    variant="shadow"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={capture}
                    color="primary"
                    variant="shadow"
                  >
                    Capture
                  </Button>
                </div>
              </div>
            ) : capturedImage ? (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured content"
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <Button
                    onPress={retake}
                    color="danger"
                    variant="shadow"
                  >
                    Retake
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video bg-default-100 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-default-400 flex flex-col items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                  <p>No image captured</p>
                </div>
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="w-full rounded-lg border-medium border-default-200 px-3 py-2 text-default-600">
              <div className="text-small text-default-500">Status</div>
              <div className="text-default-700">
                {!capturedImage
                  ? "Ready to capture"
                  : ocrStatus
                    ? ocrStatus
                    : "Pending text extraction"}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Camera Controls */}
      <div className="flex justify-center py-4 gap-4">
        {!isCameraActive && !capturedImage && (
          <Button
            onPress={startCamera}
            color="primary"
            variant="shadow"
            size="lg"
          >
            Start Camera
          </Button>
        )}
        {capturedImage && (
          <Button
            onPress={readImageText}
            isDisabled={isProcessing}
            color="primary"
            variant="shadow"
            size="lg"
            startContent={isProcessing ? <Spinner size="sm" /> : null}
          >
            {isProcessing ? 'Processing...' : 'Extract Text'}
          </Button>
        )}
      </div>

      {/* Text Extraction Result Card */}
      <Card className="p-4">
        <CardHeader className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Extracted Text</h2>
          <p className="text-default-500">Results from OCR processing will appear here</p>
        </CardHeader>
        <CardBody>
          {ocrResult ? (
            <div
              className="p-4 bg-default-100 rounded-lg min-h-[200px]"
              dangerouslySetInnerHTML={{
                __html: ocrResult
                  .replace(/\n/g, '<br />')
                  .replace(/[=,—,-,+]/g, ' '),
              }}
            />
          ) : (
            <div className="p-4 bg-default-100 rounded-lg text-default-500 italic min-h-[200px] flex items-center justify-center">
              {capturedImage
                ? "Click 'Extract Text' to process the image"
                : "Capture an image to begin text extraction"}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default OcrImageCapture;