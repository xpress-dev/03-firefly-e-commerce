import {
  MdEdit,
  MdDelete,
  MdStar,
  MdStarBorder,
  MdHome,
  MdWork,
  MdLocationOn,
  MdPhone,
  MdLocationCity,
} from "react-icons/md";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDefault = false,
  isLoading = false,
}) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "home":
        return <MdHome className="w-5 h-5" />;
      case "work":
        return <MdWork className="w-5 h-5" />;
      case "other":
        return <MdLocationOn className="w-5 h-5" />;
      default:
        return <MdLocationOn className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "home":
        return "text-blue-600 bg-blue-100";
      case "work":
        return "text-green-600 bg-green-100";
      case "other":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "home":
        return "Home";
      case "work":
        return "Work";
      case "other":
        return "Other";
      default:
        return "Other";
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
        isDefault
          ? "border-orange-500 bg-orange-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(address.type)}`}>
            {getTypeIcon(address.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{address.label}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {getTypeLabel(address.type)}
              </span>
              {isDefault && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Default
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {!isDefault && (
            <button
              onClick={() => onSetDefault(address._id)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-yellow-500 transition-colors disabled:opacity-50"
              title="Set as default"
            >
              <MdStarBorder className="w-5 h-5" />
            </button>
          )}
          {isDefault && (
            <div className="p-2 text-yellow-500" title="Default address">
              <MdStar className="w-5 h-5" />
            </div>
          )}
          <button
            onClick={() => onEdit(address)}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
            title="Edit address"
          >
            <MdEdit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(address._id)}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete address"
          >
            <MdDelete className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-3">
        {/* Name and Phone */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-gray-900">
              {address.firstName} {address.lastName}
            </p>
          </div>
          <div className="flex items-center text-gray-600">
            <MdPhone className="w-4 h-4 mr-1" />
            <span className="text-sm">{address.phone}</span>
          </div>
        </div>

        {/* Address Lines */}
        <div className="space-y-1">
          <p className="text-gray-700">{address.addressLine1}</p>
          {address.addressLine2 && (
            <p className="text-gray-700">{address.addressLine2}</p>
          )}
        </div>

        {/* City, State, Postal Code */}
        <div className="flex items-center text-gray-600">
          <MdLocationCity className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {address.city}, {address.state} {address.postalCode}
          </span>
        </div>

        {/* Country */}
        <div className="text-sm text-gray-500">{address.country}</div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
