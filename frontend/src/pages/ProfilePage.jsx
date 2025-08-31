import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";
import toast from "react-hot-toast";
import { CameraIcon, LoaderIcon, MapPinIcon, Send, ShuffleIcon, Upload } from "lucide-react";
import { LANGUAGES } from "../constants";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: updateProfileMutation, isPending } = useMutation({
  mutationFn: updateProfile,
  onSuccess: () => {
    toast.success("Profile updated successfully!");
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
    navigate("/home"); // 👈 redirige al dashboard del usuario
  },
  onError: (error) => {
    toast.error(error.response?.data?.message || "Failed to update profile");
  },
});

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(formState);
  };

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // Extraer extensión y generar nombre único (por ID de usuario)
    const fileExt = file.name.split(".").pop();
    const fileName = `${authUser._id}.${fileExt}`;

    // Subir archivo al bucket profile-pics
    const { error } = await supabase.storage
      .from("profile-pics")
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    // Obtener URL pública del archivo
    const { data } = supabase.storage.from("profile-pics").getPublicUrl(fileName);

    // Actualizar el formState
    setFormState({ ...formState, profilePic: data.publicUrl });

    toast.success("Profile picture uploaded!");
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Failed to upload picture");
  }
};

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
      <div className="card bg-base-200 w-full max-w-3xl mx-auto shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Edit Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                    {formState.profilePic ? (
                    <img
                        src={formState.profilePic}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                    />
                    ) : (
                    <div className="flex items-center justify-center h-full">
                        <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                    )}
                </div>

              <div className="flex items-center gap-2">
                <label className="btn btn-accent cursor-pointer">
                    <Upload className="size-4 mr-2" />
                    Upload Profile Picture
                    <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    />
                </label>
            </div>

            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your interests"
              />
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({ ...formState, nativeLanguage: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <Send className="size-5 mr-2" />
                  Update Profile
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Updating...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;