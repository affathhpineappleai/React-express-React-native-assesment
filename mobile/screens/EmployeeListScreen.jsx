// EmployeeListScreen.jsx

import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { getEmployees, deleteEmployee } from "../api/employeeApi";

export default function EmployeeListScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedDepartment === "All") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (emp) => emp.department === selectedDepartment
      );
      setFilteredEmployees(filtered);
    }
  }, [selectedDepartment, employees]);

  const confirmDelete = (employee) => {
    setSelectedEmployee(employee);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteEmployee(selectedEmployee._id);
      setEmployees((prev) =>
        prev.filter((emp) => emp._id !== selectedEmployee._id)
      );
      Alert.alert("Success", "Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      Alert.alert("Error", "Failed to delete employee. Please try again.");
    } finally {
      setDeleteModalVisible(false);
      setSelectedEmployee(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedEmployee(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.image_url
            ? `http://192.168.8.101:5000/uploads/${item.image_url}`
            : "https://via.placeholder.com/100",
        }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.Full_name}</Text>
        <Text style={styles.detail}>{item.position}</Text>
        <Text style={styles.detail}>{item.department}</Text>
        <Text style={styles.detail}>{item.email}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() =>
            navigation.navigate("EditEmployee", { employeeId: item._id })
          }
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => confirmDelete(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading employees...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Employees</Text>
          <Text style={styles.count}>{filteredEmployees.length} employees</Text>
        </View>

        {/* Department Filter */}
        <View style={styles.filterContainer}>
          {["All", "HR", "IT", "Finance", "Marketing"].map((dept) => (
            <TouchableOpacity
              key={dept}
              style={[
                styles.filterButton,
                selectedDepartment === dept && styles.activeFilter,
              ]}
              onPress={() => setSelectedDepartment(dept)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedDepartment === dept && styles.activeFilterText,
                ]}
              >
                {dept}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredEmployees.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No employees found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEmployees}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate("CreateEmployee")}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent
          visible={deleteModalVisible}
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Delete</Text>

              <Text style={styles.modalText}>
                Are you sure you want to delete{" "}
                <Text style={styles.employeeName}>
                  {selectedEmployee?.Full_name}
                </Text>
                ?
              </Text>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={cancelDelete}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmDeleteButton]}
                  onPress={handleDelete}
                >
                  <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  count: {
    fontSize: 16,
    color: "#666",
    backgroundColor: "#e9ecef",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e9ecef",
    marginRight: 8,
    marginBottom: 8,
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  activeFilter: {
    backgroundColor: "#007bff",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    backgroundColor: "#e9ecef",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  actions: {
    justifyContent: "center",
    alignItems: "flex-end",
    minWidth: 80,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    minWidth: 70,
  },
  editButton: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#007bff",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
    borderWidth: 1,
    borderColor: "#dc3545",
  },
  buttonText: {
    color: "#007bff",
    fontWeight: "500",
    fontSize: 14,
  },
  deleteButtonText: {
    color: "#dc3545",
    fontWeight: "500",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
    marginBottom: 20,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  employeeName: {
    fontWeight: "bold",
    color: "#dc3545",
  },
  modalFooter: {
    flexDirection: "row",
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
  },
  cancelButtonText: {
    color: "#6c757d",
    fontWeight: "600",
  },
  confirmDeleteButton: {
    backgroundColor: "#dc3545",
  },
  confirmDeleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
