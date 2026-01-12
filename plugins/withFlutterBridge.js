const { withDangerousMod, withAndroidManifest } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFlutterBridge(config) {
  const androidPackage = (config.android?.package || 'org.gabrieal.expensetracker').toLowerCase();

  config = withDangerousMod(config, ['android', (cfg) => {
    const javaDir = path.join(
      cfg.modRequest.projectRoot,
      'android/app/src/main/java',
      ...androidPackage.split('.'),
      'flutterbridge'
    );
    fs.mkdirSync(javaDir, { recursive: true });

    const moduleKotlin = `package ${androidPackage}.flutterbridge

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
}`;

    const packageKotlin = `package ${androidPackage}.flutterbridge

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class FlutterBridgePackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> = 
    listOf(FlutterBridgeModule(reactContext))

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = 
    emptyList()
}`;

    fs.writeFileSync(path.join(javaDir, 'FlutterBridgeModule.kt'), moduleKotlin, 'utf8');
    fs.writeFileSync(path.join(javaDir, 'FlutterBridgePackage.kt'), packageKotlin, 'utf8');
    return cfg;
  }]);

  config = withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest?.application?.[0];
    if (!app) return cfg;
    
    const hasFlutter = (app.activity || []).some(
      (a) => a.$?.['android:name'] === 'io.flutter.embedding.android.FlutterActivity'
    );
    
    if (!hasFlutter) {
      app.activity = app.activity || [];
      app.activity.push({
        $: {
          'android:name': 'io.flutter.embedding.android.FlutterActivity',
          'android:theme': '@style/Theme.AppCompat.Light.NoActionBar',
          'android:hardwareAccelerated': 'true',
          'android:windowSoftInputMode': 'adjustResize',
        },
      });
    }
    return cfg;
  });

  config = withDangerousMod(config, ['android', (cfg) => {
    const projectRoot = cfg.modRequest.projectRoot;
    const mainAppPath = (isKotlin) => path.join(
      projectRoot, 'android/app/src/main/java',
      ...androidPackage.split('.'),
      isKotlin ? 'MainApplication.kt' : 'MainApplication.java'
    );

    const patchMainApplication = (filePath, isKotlin) => {
      if (!fs.existsSync(filePath)) return false;
      let code = fs.readFileSync(filePath, 'utf8');

      if (!code.includes('FlutterBridgePackage')) {
        const importLine = `import ${androidPackage}.flutterbridge.FlutterBridgePackage`;
        const importAnchor = /import\s+com\.facebook\.react\.ReactApplication[\s\S]*?\n/;
        code = importAnchor.test(code)
          ? code.replace(importAnchor, (m) => m + importLine + (isKotlin ? '\n' : ';\n'))
          : importLine + (isKotlin ? '\n' : ';\n') + code;
      }

      if (isKotlin && !code.includes('FlutterBridgePackage()')) {
        code = code.replace(
          /PackageList\(this\)\.packages/,
          (m) => `${m}.apply {\n      add(FlutterBridgePackage())\n    }`
        );
      } else if (!isKotlin && !code.includes('new FlutterBridgePackage()')) {
        code = code.replace(
          /new PackageList\(this\)\.getPackages\(\)/,
          (m) => `${m};\n      packages.add(new FlutterBridgePackage());`
        );
      }

      fs.writeFileSync(filePath, code, 'utf8');
      return true;
    };

    if (!patchMainApplication(mainAppPath(true), true) && !patchMainApplication(mainAppPath(false), false)) {
      const msg = `[withFlutterBridge] Could not auto-patch MainApplication.\nAdd: import ${androidPackage}.flutterbridge.FlutterBridgePackage\nThen add FlutterBridgePackage() to packages list.`;
      try { fs.writeFileSync(path.join(projectRoot, 'android/withFlutterBridge.README.txt'), msg, 'utf8'); } catch {}
    }

    return cfg;
  }]);

  return config;
};