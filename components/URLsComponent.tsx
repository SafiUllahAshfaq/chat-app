interface UrlObject {
  url: string;
  isActive: boolean;
  _id: string;
}

interface URLsComponentProps {
  urls: UrlObject[];
}

const URLsComponent: React.FC<URLsComponentProps> = ({ urls }) => {
  return (
    <div className="bg-primary-light p-4 rounded-lg max-h-64 overflow-y-auto">
      <ul className="space-y-2">
        {urls.map((urlObj) => (
          <li key={urlObj._id} className="text-gray-700">
            {urlObj.url}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default URLsComponent;
