import { forwardRef } from "react";
import { KeyboardTypeOptions, TextInputProps } from "react-native";
import { TextInput } from "react-native";
import { TinyText } from "@/app/util/widgets/CustomText";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import { baseStyles } from "@/constants/Styles";
import { SpacerVertical } from "@/app/util/widgets/CustomBox";

interface InputProps extends TextInputProps {
    label: string;
    prefix?: string;
}

const CustomTextInput = forwardRef<TextInput, InputProps>(
    ({ label, prefix, ...props }, ref) => (
      <View>
        <TinyText text={label} color={Colors.textPrimary} textAlign="left" />
        <SpacerVertical size={8} />
        <View style={[baseStyles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          {prefix && (
            <TinyText
              text={prefix}
              color={Colors.textPrimary}
              textAlign="left"
              style={{ marginRight: 8 }}
            />
          )}
          <TextInput
            ref={ref}
            style={{ flex: 1, paddingVertical: 0, color: Colors.textPrimary }}
            placeholderTextColor={Colors.placeholder}
            selectionColor={Colors.placeholder}
            returnKeyType="next"
            {...props}
          />
        </View>
      </View>
    )
  );

export default CustomTextInput;
