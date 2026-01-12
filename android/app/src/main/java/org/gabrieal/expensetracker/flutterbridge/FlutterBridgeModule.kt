package org.gabrieal.expensetracker.flutterbridge

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import io.flutter.embedding.android.FlutterActivity

class FlutterBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "FlutterBridgeModule"

  @ReactMethod
  fun openFlutter(route: String?, params: ReadableMap?) {
    val activity = currentActivity ?: return
    val builder = FlutterActivity.withNewEngine()
    route?.takeIf { it.isNotEmpty() }?.let { builder.initialRoute(it) }
    activity.startActivity(builder.build(activity))
  }
}