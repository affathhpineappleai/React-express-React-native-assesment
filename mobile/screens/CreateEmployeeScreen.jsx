// Import React hook for managing component state
import { useState } from "react";

// Import core React Native components for UI and interaction
import {
  View, // Container element
  Text, // For displaying text
  TextInput, // For input fields
  TouchableOpacity, // Pressable button component
  StyleSheet, // For creating component styles
  Image, // For displaying images
  Alert, // For pop-up messages
  ScrollView, // Scrollable container
  Platform, // Detect platform (iOS, Android, Web)
  ActivityIndicator, // Loading spinner
} from "react-native";

// Import API function to create employee
import { createEmployee } from "../api/employeeApi";

// Main functional component for creating employees
export default function CreateEmployeeScreen({ navigation }) {
  // State variables for form fields
  const [name, setName] = useState(""); // Employee's full name
  const [position, setPosition] = useState(""); // Employee's job position
  const [department, setDepartment] = useState(""); // Employee's department
  const [email, setEmail] = useState(""); // Employee's email address
  const [image, setImage] = useState(null); // Selected profile image
  const [loading, setLoading] = useState(false); // Loading state while submitting

  // Function to submit employee data without image (for testing)
  const handleSubmitTest = async () => {
    // Check if all required fields are filled
    if (!name || !position || !department || !email) {
      Alert.alert("Error", "Please fill in all fields."); // Show error if any field empty
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      // Prepare data object to send as JSON
      const employeeData = {
        Full_name: name,
        position: position,
        department: department,
        email: email,
      };

      console.log("Sending test data:", employeeData); // Debug log

      // Make POST request to backend API
      const response = await fetch("http://192.168.8.101:5000/api/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Sending JSON
        },
        body: JSON.stringify(employeeData), // Convert object to JSON string
      });

      // Check if server returned success
      if (!response.ok) {
        const errorText = await response.text(); // Get server error message
        console.error("Server error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json(); // Parse server response
      console.log("Success:", data);

      Alert.alert("Success", "Employee created successfully!"); // Show success message
      navigation.goBack(); // Navigate back to previous screen
    } catch (error) {
      console.error("Error creating employee:", error); // Log error
      Alert.alert("Error", `Failed to create employee: ${error.message}`); // Show error message
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Function to submit employee data with optional image
  const handleSubmit = async () => {
    // Validate required fields
    if (!name || !position || !department || !email) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append("Full_name", name);
      formData.append("position", position);
      formData.append("department", department);
      formData.append("email", email);

      // Handle image upload
      if (image) {
        if (Platform.OS === "web") {
          // For web: convert base64 image to blob
          if (image.uri.startsWith("data:")) {
            const response = await fetch(image.uri);
            const blob = await response.blob();
            formData.append("image_url", blob, image.name || "image.jpg"); // Field name must match backend
          }
        } else {
          // For mobile platforms
          const uriParts = image.uri.split("/");
          const fileName = uriParts[uriParts.length - 1]; // Extract file name from path
          const fileType = image.type || `image/${fileName.split(".").pop()}`; // Determine file type
          formData.append("image_url", {
            uri: image.uri,
            name: fileName,
            type: fileType,
          });
        }
      }

      // Debug: Log FormData entries
      console.log("Submitting FormData...");
      for (let [key, value] of formData.entries()) {
        console.log(key, "=>", value);
      }

      // Call backend API function
      await createEmployee(formData);

      Alert.alert("Success", "Employee created successfully!");
      navigation.goBack(); // Navigate back
    } catch (error) {
      console.error("Error creating employee:", error);
      Alert.alert("Error", "Failed to create employee. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Function to pick image from device (native or web)
  const pickImage = async () => {
    if (Platform.OS === "web") {
      // Web: use file input element
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Set image preview using base64
            setImage({
              uri: e.target.result,
              name: file.name,
              type: file.type,
            });
          };
          reader.readAsDataURL(file);
        }
      };

      input.click(); // Trigger file picker
      return;
    }

    try {
      // Native: use expo-image-picker dynamically
      const ImagePicker = await import("expo-image-picker");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images
        allowsEditing: true, // Allow cropping
        aspect: [1, 1], // Square image
        quality: 1, // Highest quality
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0]); // Set selected image
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  // Show loading spinner while API call in progress
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Main UI
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Employee</Text>

      {/* Full Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      {/* Position Input */}
      <TextInput
        style={styles.input}
        placeholder="Position"
        value={position}
        onChangeText={setPosition}
      />

      {/* Department Input */}
      <TextInput
        style={styles.input}
        placeholder="Department"
        value={department}
        onChangeText={setDepartment}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Image Picker Button */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>
          {image ? "Change Image" : "Pick Image (Optional)"}
        </Text>
      </TouchableOpacity>

      {/* Image Preview */}
      {image && (
        <Image source={{ uri: image.uri }} style={styles.imagePreview} />
      )}

      {/* Test Button - No image */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6c757d", marginTop: 10 }]}
        onPress={handleSubmitTest}
      >
        <Text style={styles.buttonText}>Test (No Image)</Text>
      </TouchableOpacity>

      {/* Main Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Employee</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePicker: {
    width: "100%",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#007bff",
  },
});
