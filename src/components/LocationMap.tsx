
import React, { useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';

interface LocationMapProps {
  address: string;
  name: string;
  onClose: () => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ address, name, onClose }) => {
  const [mapError, setMapError] = useState(false);

  // Generate Google Maps embed URL
  const getMapUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}`;
  };

  // Generate Google Maps directions URL
  const getDirectionsUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{address}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Map Placeholder */}
          <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">Interactive Map</p>
              <p className="text-gray-400 text-sm">Google Maps integration coming soon</p>
              <p className="text-gray-400 text-xs mt-2">Add your Google Maps API key to enable maps</p>
            </div>
          </div>

          {/* Map Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={getDirectionsUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              <span>Get Directions</span>
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>View on Google Maps</span>
            </a>
          </div>

          {/* Location Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Location Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <p className="text-gray-600">{address}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Coordinates:</span>
                <p className="text-gray-600">To be determined via geocoding</p>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Enable Map Integration</h4>
            <p className="text-sm text-blue-700 mb-2">
              To enable interactive maps, you need to:
            </p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Get a Google Maps API key from Google Cloud Console</li>
              <li>Enable the Maps Embed API and Maps JavaScript API</li>
              <li>Add the API key to your environment configuration</li>
              <li>Update the LocationMap component with your API key</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
