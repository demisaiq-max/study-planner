import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Camera, User, Check } from 'lucide-react-native';
import { useUser } from '@/hooks/user-context';
import { useLanguage, Language } from '@/hooks/language-context';

export default function SettingsScreen() {
  const { user, updateUser } = useUser();
  const { language, changeLanguage, t } = useLanguage();
  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleSaveName = async () => {
    if (!user || !name.trim()) {
      Alert.alert(t('error'), 'Please enter a valid name');
      return;
    }

    try {
      await updateUser({
        ...user,
        name: name.trim(),
      });
      Alert.alert(t('notification'), 'Name updated successfully');
    } catch (error) {
      Alert.alert(t('error'), 'Failed to update name');
    }
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    await changeLanguage(newLanguage);
    setShowLanguageSelector(false);
  };

  const handleProfilePicturePress = () => {
    if (Platform.OS === 'web') {
      Alert.alert(t('notification'), 'Profile picture upload is not available on web');
      return;
    }
    
    Alert.alert(
      t('profilePicture'),
      'Profile picture functionality will be available soon',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('settings'),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#000000',
          },
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile')}</Text>
          
          {/* Profile Picture */}
          <View style={styles.profilePictureSection}>
            <TouchableOpacity 
              style={styles.profilePictureContainer}
              onPress={handleProfilePicturePress}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <User size={40} color="#8E8E93" />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Camera size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.profilePictureLabel}>{t('profilePicture')}</Text>
          </View>

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('name')}</Text>
            <View style={styles.nameInputContainer}>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder={t('name')}
                placeholderTextColor="#8E8E93"
              />
              <TouchableOpacity 
                style={styles.saveNameButton}
                onPress={handleSaveName}
              >
                <Text style={styles.saveNameText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          
          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <Text style={styles.languageSelectorText}>
              {language === 'ko' ? t('korean_lang') : t('english_lang')}
            </Text>
            <View style={[styles.chevron, showLanguageSelector && styles.chevronUp]} />
          </TouchableOpacity>

          {showLanguageSelector && (
            <View style={styles.languageOptions}>
              <TouchableOpacity 
                style={[styles.languageOption, language === 'ko' && styles.languageOptionSelected]}
                onPress={() => handleLanguageChange('ko')}
              >
                <Text style={[styles.languageOptionText, language === 'ko' && styles.languageOptionTextSelected]}>
                  {t('korean_lang')}
                </Text>
                {language === 'ko' && <Check size={20} color="#007AFF" />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.languageOption, language === 'en' && styles.languageOptionSelected]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[styles.languageOptionText, language === 'en' && styles.languageOptionTextSelected]}>
                  {t('english_lang')}
                </Text>
                {language === 'en' && <Check size={20} color="#007AFF" />}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>Study App v1.0.0</Text>
            <Text style={styles.appInfoSubtext}>
              {language === 'ko' ? '학습 관리 앱' : 'Study Management App'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profilePictureLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  saveNameButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  saveNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  languageSelectorText: {
    fontSize: 16,
    color: '#000000',
  },
  chevron: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#8E8E93',
  },
  chevronUp: {
    borderTopWidth: 0,
    borderBottomWidth: 8,
    borderBottomColor: '#8E8E93',
  },
  languageOptions: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  languageOptionSelected: {
    backgroundColor: '#E8F3FF',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#000000',
  },
  languageOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
});