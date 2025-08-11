import { useSafeAreaInsets } from "react-native-safe-area-context";
import { baseStyles } from "@/constants/Styles";
import { View } from "react-native";
import { useTravelTrackingViewModel } from "../viewmodel/TravelTrackingViewModel";
import { TitleBox } from "@/app/util/widgets/CustomBox";
import { SpacerVertical } from "@/app/util/widgets/CustomBox";

export default function TravelTrackingScreen() {
  const insets = useSafeAreaInsets();

  const { uiState, ...travelTrackingViewModel } = useTravelTrackingViewModel();

  return (
    <View
      style={[
        baseStyles.baseBackground,
        { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 18 },
      ]}
    >
      <TitleBox title="Travel Tracking" />
    </View>
  );
}
