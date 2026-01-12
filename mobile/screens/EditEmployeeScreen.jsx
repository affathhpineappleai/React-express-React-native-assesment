// Import React hooks for managing state and side effects
import { useState, useEffect } from "react";

// Import necessary React Native components for UI, interaction, scrolling, platform detection, and loading indicator
import {
  View, // Generic container
  Text, // Text display
  TextInput, // Input field
  TouchableOpacity, // Button component that can be pressed
  StyleSheet, // Styling helper
  Image, // Display images
  Alert, // Pop-up alert dialogs
  ScrollView, // Scrollable container
  Platform, // Detect platform (web, ios, android)
  ActivityIndicator, // Loading spinner
} from "react-native";

// Import API helper functions to fetch and update employee data
import { getEmployeeById, updateEmployee } from "../api/employeeApi";

// Main functional component for editing an employee
export default function EditEmployeeScreen({ route, navigation }) {
  // Get employee ID from route parameters
  const { employeeId } = route.params;

  // State variables for form fields
  const [name, setName] = useState(""); // Employee full name
  const [position, setPosition] = useState(""); // Employee job position
  const [department, setDepartment] = useState(""); // Employee department
  const [email, setEmail] = useState(""); // Employee email (read-only)
  const [image, setImage] = useState(null); // Newly selected image
  const [existingImage, setExistingImage] = useState(""); // URL of existing image
  const [loading, setLoading] = useState(false); // Loading state for update submission
  const [fetching, setFetching] = useState(true); // Loading state while fetching existing employee

  // useEffect to fetch employee data once when component mounts
  useEffect(() => {
    fetchEmployeeData(); // Call function to get employee data
  }, []);

  // Function to fetch existing employee data
  const fetchEmployeeData = async () => {
    try {
      setFetching(true); // Show loader
      const employee = await getEmployeeById(employeeId); // Fetch employee from API

      // Pre-fill form fields with fetched data
      setName(employee.Full_name || "");
      setPosition(employee.position || "");
      setDepartment(employee.department || "");
      setEmail(employee.email || "");

      // Set existing image URL if available
      if (employee.image_url) {
        setExistingImage(
          `http://192.168.8.101:5000/uploads/${employee.image_url}`
        );
      }
    } catch (error) {
      console.error("Error fetching employee:", error); // Log error
      Alert.alert("Error", "Failed to load employee data"); // Show error alert
      navigation.goBack(); // Navigate back if fetch fails
    } finally {
      setFetching(false); // Hide loader
    }
  };

  // Function to pick a new image from device
  const pickImage = async () => {
    if (Platform.OS === "web") {
      // Web: use file input element
      const input = document.createElement("input");
      input.type = "file"; // Accept files
      input.accept = "image/*"; // Only images

      // When file is selected
      input.onchange = (event) => {
        const file = event.target.files[0]; // Get first file
        if (file) {
          // Set image state with file and preview URI
          setImage({
            file: file, // Actual file object
            uri: URL.createObjectURL(file), // Preview URI for <Image>
            name: file.name, // File name
            type: file.type, // MIME type
          });
          setExistingImage(""); // Clear current image preview
        }
      };
      input.click(); // Trigger file picker
      return; // Stop further execution
    }

    try {
      // Native: dynamically import expo-image-picker
      const ImagePicker = await import("expo-image-picker");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images
        allowsEditing: true, // Allow user to crop
        aspect: [1, 1], // Square crop
        quality: 1, // Max quality
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0]); // Set picked image
        setExistingImage(""); // Clear existing image
      }
    } catch (error) {
      console.error("Error picking image:", error); // Log error
      Alert.alert("Error", "Failed to pick image"); // Show alert
    }
  };

  // Main function to update employee
  const handleSubmit = async () => {
    if (!name || !position || !department || !email) {
      Alert.alert("Error", "Please fill in all fields."); // Validate fields
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      const formData = new FormData(); // Create FormData for multipart upload
      formData.append("Full_name", name); // Append name
      formData.append("position", position); // Append position
      formData.append("department", department); // Append department
      formData.append("email", email); // Append email

      // Handle image upload
      if (image) {
        if (Platform.OS === "web") {
          if (image.file) {
            formData.append("image_url", image.file); // Upload file directly
          } else if (image.uri && image.uri.startsWith("data:")) {
            const response = await fetch(image.uri);
            const blob = await response.blob(); // Convert base64 to blob
            formData.append("image_url", blob, image.name || "image.jpg");
          }
        } else {
          // Native platforms
          const uriParts = image.uri.split("/"); // Split path
          const fileName = uriParts[uriParts.length - 1]; // Get file name
          const fileType = image.type || `image/${fileName.split(".").pop()}`; // MIME type
          formData.append("image_url", {
            uri: image.uri,
            name: fileName,
            type: fileType,
          });
        }
      }

      console.log("=== DEBUG: Edit FormData ===");
      console.log("ID:", employeeId);

      // Log FormData entries for debugging
      if (formData instanceof FormData) {
        const entries = [];
        for (let [key, value] of formData.entries()) {
          if (value instanceof File || value instanceof Blob) {
            entries.push({
              key,
              type: "File/Blob",
              name: value.name,
              size: value.size,
            });
          } else if (typeof value === "object") {
            entries.push({ key, type: "Object", value: JSON.stringify(value) });
          } else {
            entries.push({ key, type: "String", value });
          }
        }
        console.log("FormData entries:", entries);
      }

      await updateEmployee(employeeId, formData); // API call to update employee

      Alert.alert("Success", "Employee updated successfully!"); // Success alert
      navigation.goBack(); // Navigate back
    } catch (error) {
      console.error("Error updating employee:", error); // Log error
      Alert.alert("Error", "Failed to update employee. Please try again."); // Show alert
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  // Alternative test function using fetch directly (for debugging)
  const testDirectFetch = async () => {
    if (!name || !position || !department || !email) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      const formData = new FormData(); // Create FormData for multipart upload
      formData.append("Full_name", name); // Append name
      formData.append("position", position); // Append position
      formData.append("department", department); // Append department
      formData.append("email", email);

      if (image && Platform.OS === "web" && image.file) {
        formData.append("image_url", image.file);
      }

      console.log("=== TEST: Direct Fetch ===");

      const response = await fetch(
        `http://192.168.8.101:5000/api/employees/${employeeId}`,
        {
          method: "PUT",
          body: formData, // Do not set Content-Type manually
        }
      );

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      Alert.alert("Success", "Employee updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", `Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear selected or existing image
  const clearImage = () => {
    setImage(null); // Remove new image
    setExistingImage(""); // Remove existing image preview
  };

  // Show loader during initial fetch
  if (fetching) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading employee data...</Text>
      </View>
    );
  }

  // Show loader during update
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Updating employee...</Text>
      </View>
    );
  }

  // Main UI for editing employee
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Employee</Text>

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

      {/* Email Input (read-only) */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={false}
      />

      {/* Image Section */}
      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Profile Image</Text>

        {/* Show existing or new image */}
        {existingImage ? (
          <View style={styles.existingImageContainer}>
            <Image
              source={{ uri: existingImage }}
              style={styles.imagePreview}
            />
            <Text style={styles.imageNote}>Current Image</Text>
            <TouchableOpacity style={styles.removeButton} onPress={clearImage}>
              <Text style={styles.removeButtonText}>Remove Current Image</Text>
            </TouchableOpacity>
          </View>
        ) : image ? (
          <View style={styles.existingImageContainer}>
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            <Text style={styles.imageNote}>New Image Selected</Text>
            <TouchableOpacity style={styles.removeButton} onPress={clearImage}>
              <Text style={styles.removeButtonText}>Remove New Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noImageText}>
            No new image selected (current image will be kept)
          </Text>
        )}

        {/* Image picker button */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {existingImage || image ? "Change Image" : "Select New Image"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Test direct fetch button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ff9800", marginTop: 10 }]}
        onPress={testDirectFetch}
      >
        <Text style={styles.buttonText}>Test Direct Upload</Text>
      </TouchableOpacity>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update Employee</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Stylesheet for component styling
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f2f2f2", flexGrow: 1 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  loadingText: { marginTop: 12, fontSize: 16, color: "#666" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
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
  imageSection: { marginTop: 10, marginBottom: 20, alignItems: "center" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
    alignSelf: "flex-start",
  },
  existingImageContainer: {
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#007bff",
    marginBottom: 8,
  },
  imageNote: { fontSize: 14, color: "#666", marginBottom: 10 },
  noImageText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 15,
    textAlign: "center",
  },
  imagePicker: {
    width: "100%",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  imagePickerText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  removeButton: {
    padding: 8,
    backgroundColor: "#dc3545",
    borderRadius: 6,
    marginTop: 5,
  },
  removeButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  button: { flex: 1, padding: 15, borderRadius: 8, alignItems: "center" },
  cancelButton: { backgroundColor: "#6c757d" },
  cancelButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
