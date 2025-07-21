import React, { useEffect } from "react";
import { DescriptionText, TitleText } from "@/app/util/widgets/CustomText";
import { Colors } from "@/constants/Colors";
import { baseStyles } from "@/constants/Styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { RoundedBox, SpacerVertical } from "@/app/util/widgets/CustomBox";
import { Switch } from "react-native";
import { useProfileViewModel } from "../viewmodel/ProfileViewModel";

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
      <SpacerVertical size={16} />
      <RoundedBox style={{ marginVertical: 16 }}>
        <View
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
        </View>
      </RoundedBox>
    </View>
  );
}
