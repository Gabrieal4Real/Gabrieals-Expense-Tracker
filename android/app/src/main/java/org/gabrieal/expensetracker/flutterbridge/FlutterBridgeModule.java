package org.gabrieal.expensetracker.flutterbridge;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import io.flutter.embedding.android.FlutterActivity;

public class FlutterBridgeModule extends ReactContextBaseJavaModule {

  public FlutterBridgeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    // This is the JS module name: NativeModules.FlutterBridgeModule
    return "FlutterBridgeModule";
  }

  /**
   * JS: openFlutter(route?: string, params?: Record<string, any>?)
   */
  @ReactMethod
  public void openFlutter(@Nullable String route, @Nullable ReadableMap params) {
    Activity activity = getCurrentActivity();
    if (activity == null) return;

    FlutterActivity.NewEngineIntentBuilder builder = FlutterActivity
      .withNewEngine();

    if (route != null && !route.isEmpty()) {
      builder.initialRoute(route);
    }

    Intent intent = builder.build(activity);

    // TODO: serialize 'params' to JSON and add as intent extras if needed.
    // For example:
    // if (params != null) {
    //   org.json.JSONObject json = com.facebook.react.bridge.Arguments.toBundle(params) != null
    //     ? new org.json.JSONObject(Arguments.toBundle(params))
    //     : new org.json.JSONObject();
    //   intent.putExtra("flutter_initial_params_json", json.toString());
    // }

    activity.startActivity(intent);
  }
}