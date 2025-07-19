import { useState, useEffect } from "react";
import { MdAdd, MdLocationOn, MdWarning } from "react-icons/md";
import useEcommerceStore from "../store/FireflyStore";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

const AddressesManager = () => {
  const {
    addresses,
    addressesLoading,
    addressesError,
    getUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearAddressesError,
  } = useEcommerceStore();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getUserAddresses();
  }, [getUserAddresses]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    clearAddressesError();
  };

  const handleSubmitAddress = async (addressData) => {
    setActionLoading(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, addressData);
      } else {
        await createAddress(addressData);
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Address operation failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setActionLoading(true);
      try {
        await deleteAddress(addressId);
      } catch (error) {
        console.error("Delete address failed:", error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    setActionLoading(true);
    try {
      await setDefaultAddress(addressId);
    } catch (error) {
      console.error("Set default address failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // const defaultAddress = addresses.find((addr) => addr.isDefault);

  if (showForm) {
    return (
      <AddressForm
        address={editingAddress}
        onSubmit={handleSubmitAddress}
        onCancel={handleCancelForm}
        isLoading={actionLoading}
        error={addressesError}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
          <p className="text-gray-600 mt-1">
            Manage your delivery addresses (up to 5 addresses)
          </p>
        </div>
        <button
          onClick={handleAddAddress}
          disabled={addresses.length >= 5 || addressesLoading}
          className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdAdd className="w-5 h-5 mr-2" />
          Add Address
        </button>
      </div>

      {/* Address Limit Warning */}
      {addresses.length >= 5 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start">
            <MdWarning className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Maximum addresses reached
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have reached the maximum limit of 5 addresses. Please delete
                an existing address before adding a new one.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {addressesError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800 text-sm">{addressesError}</p>
        </div>
      )}

      {/* Loading State */}
      {addressesLoading && !showForm && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      )}

      {/* Addresses Grid */}
      {!addressesLoading && !showForm && (
        <>
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MdLocationOn className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No addresses yet
              </h3>
              <p className="text-gray-600 mb-6">
                Add your first delivery address to get started with shopping.
              </p>
              <button
                onClick={handleAddAddress}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  isDefault={address.isDefault}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefaultAddress}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Address Count */}
      {addresses.length > 0 && !showForm && (
        <div className="text-center text-sm text-gray-500">
          {addresses.length} of 5 addresses used
        </div>
      )}
    </div>
  );
};

export default AddressesManager;
