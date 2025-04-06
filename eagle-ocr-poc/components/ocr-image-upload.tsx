'use client';

import { useState                    } from 'react';
import { createWorker                } from 'tesseract.js';
import { Button                      } from "@heroui/button";
import { Input                       } from "@heroui/input";
import { Card, CardBody, CardHeader  } from "@heroui/card";
import { Spinner                     } from "@heroui/spinner";

const OcrImageUpload = () => {
  const [selectedImage,    setSelectedImage]   = useState<File | null>(null);    // Selected image file
  const [ocrResult,        setOcrResult]       = useState<string>('');           // OCR result
  const [ocrStatus,        setOcrStatus]       = useState<string>('');           // OCR status
  const [isProcessing,     setIsProcessing]    = useState(false);                // Processing state


  // HANDLE IMAGE CHANGE EVENT
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setOcrResult(''); // Reset OCR result
      setOcrStatus(''); // Reset status
    }
  };

  // READ IMAGE TEXT
  const readImageText = async () => {
    if (!selectedImage) return; //Handle edge case where no image is selected
    setIsProcessing(true); //Set processing state to true
    setOcrStatus('Processing...'); //Set status to processing
    const worker = await createWorker('eng', 1, {logger: m => console.log(m),}); //Create worker
    try {
      const {data: { text }, } = await worker.recognize(selectedImage);
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
      {/* Image Upload Card */}
      <Card className="p-4">
        <CardHeader className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">OCR Image Upload</h2>
          <p className="text-default-500">Upload an image to extract text using OCR</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="w-full">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              label="Upload Image File"
              variant="bordered"
              className="w-full"
            />
          </div>

          <div className="w-full">
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Uploaded content"
                className="w-full h-auto rounded-lg shadow-lg"
              />
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
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <p>No image uploaded</p>
                </div>
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="w-full rounded-lg border-medium border-default-200 px-3 py-2 text-default-600">
              <div className="text-small text-default-500">Status</div>
              <div className="text-default-700">
                {!selectedImage
                  ? "Pending to upload image"
                  : ocrStatus
                    ? ocrStatus
                    : "Pending text extraction"}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Extract Button Section */}
      <div className="flex justify-center py-4">
        <Button
          onPress={readImageText}
          isDisabled={!selectedImage || isProcessing}
          color="primary"
          variant="shadow"
          size="lg"
          startContent={isProcessing ? <Spinner size="sm" /> : null}
        >
          {isProcessing ? 'Processing...' : 'Extract Text'}
        </Button>
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
              {selectedImage
                ? "Click 'Extract Text' to process the image"
                : "Upload an image to begin text extraction"}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default OcrImageUpload;