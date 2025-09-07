import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { useLanguage } from "@/hooks/language-context";
import { useRouter } from "expo-router";



export default function CommunityScreen() {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const tabs = [
    {
      title: language === 'ko' ? '오늘의 공부 인증' : "Today's Study Verification",
      route: '/community-study',
      icon: '📚',
      description: language === 'ko' ? '오늘의 공부를 인증하고 동기부여를 받아보세요' : 'Verify your study and get motivated'
    },
    {
      title: language === 'ko' ? '내 등급 모임' : 'My Grade Group',
      route: '/community-grade',
      icon: '👥',
      description: language === 'ko' ? '같은 등급 친구들과 정보를 공유해요' : 'Share information with friends in the same grade'
    },
    {
      title: language === 'ko' ? '문제질문하기' : 'Ask Questions',
      route: '/community-questions',
      icon: '❓',
      description: language === 'ko' ? '모르는 문제를 질문하고 답변을 받아보세요' : 'Ask questions and get answers'
    }
  ];

  const handleTabPress = (index: number) => {
    router.push(tabs[index].route as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{language === 'ko' ? '커뮤니티' : 'Community'}</Text>
        <TouchableOpacity>
          <Search size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {tabs.map((tab, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.tabCard}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}
          >
            <View style={styles.tabCardContent}>
              <View style={styles.tabIconContainer}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
              </View>
              <Text style={styles.tabCardTitle}>{tab.title}</Text>
              <View style={styles.tabCardArrow}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </View>
            <View style={styles.tabCardDivider} />
            <View style={styles.tabCardFooter}>
              <Text style={styles.tabCardDescription}>
                {tab.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  tabCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },
  tabCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tabIcon: {
    fontSize: 24,
  },
  tabCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  tabCardArrow: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 24,
    color: "#C7C7CC",
    fontWeight: "300",
  },
  tabCardDivider: {
    height: 1,
    backgroundColor: "#F2F2F7",
    marginHorizontal: 20,
  },
  tabCardFooter: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tabCardDescription: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },

});