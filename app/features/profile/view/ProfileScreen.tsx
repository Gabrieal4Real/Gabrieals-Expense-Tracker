import React, { useEffect } from "react";
import {
  DescriptionText,
  TitleText,
  SubtitleText,
} from "@/app/util/widgets/CustomText";
import { Colors } from "@/constants/Colors";
import { baseStyles } from "@/constants/Styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, View, Switch, Image } from "react-native";
import { HorizontalDivider, RoundedBox } from "@/app/util/widgets/CustomBox";
import { useProfileViewModel } from "../viewmodel/ProfileViewModel";
import {
  navigateToEditTransaction,
  navigateToTravelTracking,
} from "@/app/util/systemFunctions/NavigationUtil";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const { uiState, ...profileViewModel } = useProfileViewModel();

  useEffect(() => {
    profileViewModel.getProfile();
  }, []);

  const toggleSwitch = () => {
    profileViewModel.updateProfile({
      remaining: uiState.profile?.remaining ?? 0,
      requireAuth: !uiState.profile?.requireAuth ? 1 : 0,
    });
  };

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: insets.top + 18 }]}>
      <TitleText text="Profile" color={Colors.textPrimary} textAlign="center" />
      <RoundedBox
        style={{
          marginTop: 16,
          paddingVertical: 0,
          paddingHorizontal: 0,
          backgroundColor: Colors.borderStroke,
        }}
      >
        <Pressable
          onPress={navigateToTravelTracking}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SubtitleText
            text="Travel Tracking"
            color={Colors.navigationBar}
            style={{ paddingHorizontal: 16 }}
          />
          <Image
            source={require("@/assets/images/flight_taking_off.png")}
            style={{ flex: 0.5, height: 58, marginEnd: 4 }}
            resizeMode="contain"
          />
        </Pressable>
      </RoundedBox>
      <RoundedBox style={{ marginTop: 16 }}>
        <SubtitleText text="Settings" color={Colors.textPrimary} />
        <HorizontalDivider style={{ marginTop: 12, marginBottom: 16 }} />
        <Pressable
          onPress={toggleSwitch}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <DescriptionText
            text="Require Auth on Launch"
            color={Colors.textPrimary}
          />
          <Switch
            value={uiState.profile?.requireAuth === 1}
            onValueChange={toggleSwitch}
          />
        </Pressable>
      </RoundedBox>
    </View>
  );
}
