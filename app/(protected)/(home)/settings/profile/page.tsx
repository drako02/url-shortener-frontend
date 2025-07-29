"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Check, X, Edit3, Mail, Calendar } from "lucide-react";
import { SettingSection } from "../shared/setting-section";
import { useAuth } from "@/context/Auth";
import { FieldsToUpdate, User } from "@/app/api/types";
import { APIResponse, fetchRequest, logError } from "@/app/api/helpers";
import { auth } from "@/firebaseConfig";
import { toast } from "sonner";
import { isEqual } from "lodash";
import { format } from "date-fns";

//TODO Add users should be able to add an avatar
// TODO Users should be able to change their emails and password
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const {user} = useAuth();

  useEffect(() => {
    if (user) {
      setNewData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (!user){
    return null
  }
  // useEffect(() => {
  //   setFormData({na})
  // })
  console.log({lastName: user.lastName})

  const saveButtonDisabled =
    isEqual(
      { firstName: user.firstName, lastName: user.lastName },
      { firstName: newData.firstName, lastName: newData.lastName }
    ) ||
    (!newData.firstName && !newData.lastName);
  
  const handleSave = async () => {
    // console.log({unchanged})
    // if (unchanged) {
    //   setIsEditing(false);
    //   return;
    // }

    try {
      const res = await updateUserDetails({ //TODO Use the response to update the global user object
        firstName: newData.firstName,
        lastName: newData.lastName,
      });

      setIsEditing(false);

      if (!res) {
        toast.error("Failed to update user details");

      } else {
        console.log({res})
        toast.success("User details updated successfully");
      }

    } catch (error) {
      logError({
        context: "Updating user details",
        error,
        message: "Failed to update user details",
        logLevel: "error",
      });

      toast.error("Failed to update user details");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const avatarLetters = (user: User): string => {
    const { firstName, lastName, email } = user;
    if (firstName && lastName) {
      return firstName[0] + lastName[0];
    }

    if (firstName && !lastName) {
      return firstName.slice(0, 2);
    }

    if (!firstName && lastName) {
      return lastName.slice(0, 2);
    }

    return email.slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-none bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-700 shadow-lg">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {/* {newData.name.split(' ').map(n => n[0]).join('')} */}
                  {avatarLetters(user)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg group-hover:scale-105 transition-transform"
                variant="secondary"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {/* {newData.firstName + " " + newData.lastName} */}
                  {user.firstName + " " + user.lastName}
                </h1>
              </div>
              {/* <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {formData.bio}
              </p> */}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {newData.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {format(user.joinedAt, "MMM yyy")}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <SettingSection
        header={
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update your personal details and profile information
              </p>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        }
        content={
          <div className="space-y-6">
            <div className="grid grid-rows-2 gap-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {" "}
                {/* use grid */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-nowrap"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={newData.firstName}
                    onChange={(e) =>
                      setNewData({ ...newData, firstName: e.target.value })
                    }
                    disabled={!isEditing}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex  flex-col gap-1">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-nowrap"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={newData.lastName}
                    onChange={(e) =>
                      setNewData({ ...newData, lastName: e.target.value })
                    }
                    disabled={!isEditing}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2 grid grid-cols-1 md:grid-cols-3 ">
                <div className="col-span-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newData.email}
                    onChange={(e) =>
                      setNewData({ ...newData, email: e.target.value })
                    }
                    disabled={true} //TODO Users should be able to change their email
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-2">
                <Button
                disabled={saveButtonDisabled}
                  onClick={handleSave}
                  className="gap-2 bg-green-600 hover:bg-green-700 focus:ring-green-500"
                >
                  <Check className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        }
        variant="elevated"
      />
    </div>
  );
}

// TODO: create the update function
const updateUserDetails = async (fields: FieldsToUpdate): Promise<User|undefined> => {
  console.log("updattteee 1")
  const token = await auth.currentUser?.getIdToken();
  const res = await fetchRequest<APIResponse<User>>("/api/users", {
    method:"PATCH",
    headers: {
      token: token || "",
    },
    body: { fields },
  });

  return res.data;
};

// type UserInfo = {
//   firstName: string;
//   lastName: string;
// }
// const isSameInfo = (prev:UserInfo, update: UserInfo ) => {
//   return isEqual(prev, update)
// }