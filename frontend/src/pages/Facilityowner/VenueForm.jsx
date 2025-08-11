import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createVenue } from "../../services/facilityowner/venueApi";
import { queryClient } from "../../utils/queryClient";

const sportsOptions = ["Badminton", "Tennis", "Basketball", "Football"];
const amenitiesOptions = ["Parking", "Drinking Water", "Locker Room", "WiFi"];
const venueTypes = ["Indoor", "Outdoor"];

const VenueForm = ({ existingVenue, onSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: existingVenue
      ? {
          name: existingVenue.name,
          location: {
            address: existingVenue.location.address,
            city: existingVenue.location.city,
            state: existingVenue.location.state,
            pincode: existingVenue.location.pincode,
          },
          description: existingVenue.description || "",
          venueType: existingVenue.venueType || "",
          sportsTypes: existingVenue.sportsTypes || [],
          amenities: existingVenue.amenities || [],
          about: existingVenue.about || "",
          existingPhotos: existingVenue.photos || [],
        }
      : {
          name: "",
          location: { address: "", city: "", state: "", pincode: "" },
          description: "",
          venueType: "",
          sportsTypes: [],
          amenities: [],
          about: "",
          existingPhotos: [],
        },
  });

  const [newPhotos, setNewPhotos] = useState([]);
  const [newPhotosPreview, setNewPhotosPreview] = useState([]);

  const existingPhotos = watch("existingPhotos");

  useEffect(() => {
    if (!newPhotos.length) {
      setNewPhotosPreview([]);
      return;
    }
    const urls = newPhotos.map((file) => URL.createObjectURL(file));
    setNewPhotosPreview(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [newPhotos]);

  const mutation = useMutation({
    mutationFn: (formData) => {
      if (existingVenue) return updateVenue(existingVenue._id, formData);
      else return createVenue(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["venues"]);
      toast.success("Venue saved successfully!");
      onSuccess && onSuccess(data.data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to save venue");
    },
  });

  const onNewPhotosChange = (e) => {
    setNewPhotos(Array.from(e.target.files));
  };

  const removeExistingPhoto = (url) => {
    setValue(
      "existingPhotos",
      existingPhotos.filter((p) => p !== url)
    );
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location[address]", data.location.address);
    formData.append("location[city]", data.location.city);
    formData.append("location[state]", data.location.state);
    formData.append("location[pincode]", data.location.pincode);
    formData.append("description", data.description);
    formData.append("venueType", data.venueType);
    data.sportsTypes.forEach((sport) => formData.append("sportsTypes[]", sport));
    data.amenities.forEach((a) => formData.append("amenities[]", a));
    formData.append("about", data.about);
    data.existingPhotos.forEach((url) => formData.append("existingPhotos[]", url));
    newPhotos.forEach((file) => formData.append("photos", file));

    mutation.mutate(formData);
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 sm:p-8 md:p-10">
      <CardContent>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center">
          {existingVenue ? "Edit Venue" : "Create Venue"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Venue Name */}
          <div>
            <Label htmlFor="name" className="mb-2 block text-sm font-medium">
              Venue Name *
            </Label>
            <Input
              id="name"
              placeholder="Venue name"
              {...register("name", { required: "Venue name is required" })}
              aria-invalid={errors.name ? "true" : "false"}
              className="w-full"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Location */}
          <fieldset className="border border-gray-200 rounded-md p-6">
            <legend className="text-lg font-semibold mb-6 px-2">
              Location *
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location.address" className="mb-2 block text-sm font-medium">
                  Address *
                </Label>
                <Input
                  id="location.address"
                  placeholder="Street address"
                  {...register("location.address", { required: "Address is required" })}
                  aria-invalid={errors.location?.address ? "true" : "false"}
                  className="w-full"
                />
                {errors.location?.address && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.location.address.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location.city" className="mb-2 block text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="location.city"
                  placeholder="City"
                  {...register("location.city", { required: "City is required" })}
                  aria-invalid={errors.location?.city ? "true" : "false"}
                  className="w-full"
                />
                {errors.location?.city && (
                  <p className="text-sm text-red-600 mt-1">{errors.location.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location.state" className="mb-2 block text-sm font-medium">
                  State *
                </Label>
                <Input
                  id="location.state"
                  placeholder="State"
                  {...register("location.state", { required: "State is required" })}
                  aria-invalid={errors.location?.state ? "true" : "false"}
                  className="w-full"
                />
                {errors.location?.state && (
                  <p className="text-sm text-red-600 mt-1">{errors.location.state.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location.pincode" className="mb-2 block text-sm font-medium">
                  Pincode *
                </Label>
                <Input
                  id="location.pincode"
                  placeholder="Pincode"
                  {...register("location.pincode", { required: "Pincode is required" })}
                  aria-invalid={errors.location?.pincode ? "true" : "false"}
                  className="w-full"
                />
                {errors.location?.pincode && (
                  <p className="text-sm text-red-600 mt-1">{errors.location.pincode.message}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-2 block text-sm font-medium">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Short description"
              {...register("description")}
              className="w-full rounded-md border border-gray-300 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Venue Type */}
          <div>
            <Label htmlFor="venueType" className="mb-2 block text-sm font-medium">
              Venue Type *
            </Label>
            <select
              id="venueType"
              {...register("venueType", { required: "Venue type is required" })}
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-invalid={errors.venueType ? "true" : "false"}
            >
              <option value="">Select venue type</option>
              {venueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.venueType && (
              <p className="text-sm text-red-600 mt-1">{errors.venueType.message}</p>
            )}
          </div>

          {/* Sports Types */}
          <fieldset>
            <legend className="text-lg font-semibold mb-4">Sports Types *</legend>
            <div className="flex flex-wrap gap-6">
              {sportsOptions.map((sport) => (
                <label
                  key={sport}
                  className="inline-flex items-center space-x-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    value={sport}
                    {...register("sportsTypes")}
                    defaultChecked={existingVenue?.sportsTypes?.includes(sport)}
                    className="form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{sport}</span>
                </label>
              ))}
            </div>
            {errors.sportsTypes && (
              <p className="text-sm text-red-600 mt-2">{errors.sportsTypes.message}</p>
            )}
          </fieldset>

          {/* Amenities */}
          <fieldset>
            <legend className="text-lg font-semibold mb-4">Amenities</legend>
            <div className="flex flex-wrap gap-6">
              {amenitiesOptions.map((amenity) => (
                <label
                  key={amenity}
                  className="inline-flex items-center space-x-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    value={amenity}
                    {...register("amenities")}
                    defaultChecked={existingVenue?.amenities?.includes(amenity)}
                    className="form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* About */}
          <div>
            <Label htmlFor="about" className="mb-2 block text-sm font-medium">
              About
            </Label>
            <textarea
              id="about"
              placeholder="More details about the venue"
              {...register("about")}
              className="w-full rounded-md border border-gray-300 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Existing Photos */}
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Existing Photos (click to remove)
            </Label>
            <div className="flex gap-4 flex-wrap mt-2">
              {existingPhotos?.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="existing"
                  onClick={() => removeExistingPhoto(url)}
                  className="w-24 h-24 object-cover rounded-md cursor-pointer border-2 border-red-600 hover:opacity-80 transition"
                  title="Click to remove"
                />
              ))}
            </div>
          </div>

          {/* Upload New Photos */}
          <div>
            <Label htmlFor="newPhotos" className="mb-2 block text-sm font-medium">
              Upload New Photos
            </Label>
            <input
              type="file"
              multiple
              accept="image/*"
              id="newPhotos"
              onChange={onNewPhotosChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-4 flex-wrap mt-4">
              {newPhotosPreview.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-lg font-semibold"
          >
            {isSubmitting ? "Submitting..." : existingVenue ? "Update Venue" : "Create Venue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VenueForm;
