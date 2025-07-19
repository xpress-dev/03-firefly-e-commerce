import { useState, useEffect } from "react";
import {
  MdAdd,
  MdLocationOn,
  MdHome,
  MdWork,
  MdStar,
  MdStarBorder,
} from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";
import AddressForm from "./AddressForm";

const AddressSelector = ({ selectedAddress, onAddressSelect }) => {
  const {
    addresses,
    addressesLoading,
    addressesError,
    getUserAddresses,
    createAddress,
    clearAddressesError,
  } = useEcommerceStore();

  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getUserAddresses();
  }, [getUserAddresses]);

  const handleAddAddress = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    clearAddressesError();
  };

  const handleSubmitAddress = async (addressData) => {
    setActionLoading(true);
    try {
      const response = await createAddress(addressData);
      if (response.success) {
        // Auto-select the newly created address
        onAddressSelect(response.data);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Address creation failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "home":
        return <MdHome className="w-4 h-4" />;
      case "work":
        return <MdWork className="w-4 h-4" />;
      case "other":
        return <MdLocationOn className="w-4 h-4" />;
      default:
        return <MdLocationOn className="w-4 h-4" />;
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

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <AddressForm
            onSubmit={handleSubmitAddress}
            onCancel={handleCancelForm}
            isLoading={actionLoading}
            error={addressesError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Delivery Address
        </h3>
        <button
          onClick={handleAddAddress}
          disabled={addresses.length >= 5 || addressesLoading}
          className="flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdAdd className="w-4 h-4 mr-1" />
          Add New Address
        </button>
      </div>

      {/* Address Limit Warning */}
      {addresses.length >= 5 && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <p className="text-sm text-yellow-700">
            You have reached the maximum limit of 5 addresses. Please delete an
            existing address before adding a new one.
          </p>
        </div>
      )}

      {/* Loading State */}
      {addressesLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
        </div>
      )}

      {/* Addresses List */}
      {!addressesLoading && (
        <>
          {addresses.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <MdLocationOn className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No saved addresses
              </h4>
              <p className="text-gray-600 mb-4">
                Add your first delivery address to get started.
              </p>
              <button
                onClick={handleAddAddress}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedAddress?._id === address._id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => onAddressSelect(address)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${getTypeColor(
                          address.type
                        )}`}
                      >
                        {getTypeIcon(address.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {address.label}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {getTypeLabel(address.type)}
                          </span>
                          {address.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="font-medium">
                            {address.firstName} {address.lastName}
                          </p>
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p>{address.addressLine2}</p>
                          )}
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                          <p className="flex items-center">
                            <MdLocationOn className="w-4 h-4 mr-1" />
                            {address.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {address.isDefault ? (
                        <div
                          className="text-yellow-500"
                          title="Default address"
                        >
                          <MdStar className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="text-gray-300" title="Not default">
                          <MdStarBorder className="w-5 h-5" />
                        </div>
                      )}

                      {selectedAddress?._id === address._id && (
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Error Display */}
      {addressesError && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
          <p className="text-sm text-red-600">{addressesError}</p>
        </div>
      )}

      {/* Address Count */}
      {addresses.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          {addresses.length} of 5 addresses used
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
