import React from "react";

interface URLsStringComponentProps {
  urls: string[];
}

const URLsStringComponent: React.FC<URLsStringComponentProps> = ({ urls }) => {
  return (
    <div className="bg-primary-light p-4 rounded-lg max-h-64 overflow-y-auto">
      <ul className="space-y-2">
        {urls.map((url, index) => (
          <li key={index} className="text-gray-700">
            {url}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default URLsStringComponent;
