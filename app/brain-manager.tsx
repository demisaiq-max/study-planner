import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { Stack, router } from "expo-router";
import { Plus, Edit2, Trash2, Check, X, ChevronLeft, Search } from "lucide-react-native";
import { useStudyStore } from "@/hooks/study-store";

export default function BrainManagerScreen() {
  const {
    brainDumpItems,
    addBrainDumpItem,
    updateBrainDumpItem,
    deleteBrainDumpItem,
    toggleBrainDumpItem,
  } = useStudyStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [filterCompleted, setFilterCompleted] = useState<"all" | "active" | "completed">("all");

  const filteredItems = brainDumpItems?.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterCompleted === "all" ||
      (filterCompleted === "active" && !item.completed) ||
      (filterCompleted === "completed" && item.completed);
    return matchesSearch && matchesFilter;
  }) || [];

  const handleEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = () => {
    if (editingId && editingText.trim()) {
      updateBrainDumpItem(editingId, editingText.trim());
      setEditingId(null);
      setEditingText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Delete Brain Dump Item",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBrainDumpItem(id),
        },
      ]
    );
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      addBrainDumpItem(newItemText.trim());
      setNewItemText("");
      setShowAddModal(false);
    }
  };

  const completedCount = brainDumpItems?.filter(item => item.completed).length || 0;
  const totalCount = brainDumpItems?.length || 0;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Brain Dump Manager",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
              <Plus size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCount - completedCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search brain dump items..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filterCompleted === "all" && styles.filterButtonActive]}
            onPress={() => setFilterCompleted("all")}
          >
            <Text style={[styles.filterText, filterCompleted === "all" && styles.filterTextActive]}>
              All ({totalCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterCompleted === "active" && styles.filterButtonActive]}
            onPress={() => setFilterCompleted("active")}
          >
            <Text style={[styles.filterText, filterCompleted === "active" && styles.filterTextActive]}>
              Active ({totalCount - completedCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterCompleted === "completed" && styles.filterButtonActive]}
            onPress={() => setFilterCompleted("completed")}
          >
            <Text style={[styles.filterText, filterCompleted === "completed" && styles.filterTextActive]}>
              Completed ({completedCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? "No items found" : "No brain dump items yet"}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? "Try adjusting your search or filters" 
                : "Tap the + button to add your first brain dump item"}
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              {editingId === item.id ? (
                <View style={styles.editingContainer}>
                  <TextInput
                    style={styles.editingInput}
                    value={editingText}
                    onChangeText={setEditingText}
                    multiline
                    autoFocus
                  />
                  <View style={styles.editingActions}>
                    <TouchableOpacity onPress={handleSaveEdit} style={styles.iconButton}>
                      <Check size={20} color="#34C759" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancelEdit} style={styles.iconButton}>
                      <X size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.itemContent}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleBrainDumpItem(item.id)}
                  >
                    <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                      {item.completed && <Check size={14} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.itemTextContainer}
                    onPress={() => toggleBrainDumpItem(item.id)}
                  >
                    <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemDate}>
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      onPress={() => handleEdit(item.id, item.title)}
                      style={styles.iconButton}
                    >
                      <Edit2 size={18} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id, item.title)}
                      style={styles.iconButton}
                    >
                      <Trash2 size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#8E8E93" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Brain Dump Item</Text>
            <TouchableOpacity onPress={handleAddItem}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>{"What's on your mind?"}</Text>
            <TextInput
              style={styles.textArea}
              value={newItemText}
              onChangeText={setNewItemText}
              placeholder="Enter your thoughts, ideas, or tasks..."
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={6}
              autoFocus
            />
            <Text style={styles.helperText}>
              Brain dump items help you capture thoughts quickly without overthinking.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  backButton: {
    padding: 4,
  },
  addButton: {
    padding: 4,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    marginHorizontal: 4,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#C7C7CC",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 4,
    lineHeight: 22,
  },
  itemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
  itemDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
  editingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  editingInput: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000000",
    borderWidth: 2,
    borderColor: "#007AFF",
    minHeight: 60,
  },
  editingActions: {
    flexDirection: "column",
    gap: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#000000",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    minHeight: 150,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 12,
    lineHeight: 20,
  },
});