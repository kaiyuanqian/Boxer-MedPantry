import { useState } from 'react';
import { Tab } from '@headlessui/react';
import OcrImageUpload from '@/components/ocr-image-upload';
import OcrImageCapture from '@/components/ocr-image-capture';

const IndexPage = () => {
  return (
    <div style={{ padding: 10 }}>
      <Tab.Group>
        <Tab.List className="max-w-4xl mx-auto flex space-x-1 rounded-xl bg-gray-200 p-1 my-8">
          <Tab
            className={({ selected }: { selected: boolean }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${selected
                ? 'bg-white text-black shadow'
                : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-300'
              }`
            }
          >
            Upload Image
          </Tab>
          <Tab
            className={({ selected }: { selected: boolean }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${selected
                ? 'bg-white text-black shadow'
                : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-300'
              }`
            }
          >
            Capture Image
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <OcrImageUpload />
          </Tab.Panel>
          <Tab.Panel>
            <OcrImageCapture />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default IndexPage;