
// plugins/withFlutterBridge.js
const { withDangerousMod, withAndroidManifest } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFlutterBridge(config) {
  const androidPackage = (config.android?.package || 'org.gabrieal.expensetracker').toLowerCase();

  // 1) Write React Native-style Java module + package under app/src/main/java/<package>/flutterbridge/
  config = withDangerousMod(config, [
    'android',
    (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const androidRoot = path.join(projectRoot, 'android');
      const segments = androidPackage.split('.');
      const javaDir = path.join(
        androidRoot,
        'app',
        'src',
        'main',
        'java',
        ...segments,
        'flutterbridge'
      );
      fs.mkdirSync(javaDir, { recursive: true });

      // FlutterBridgeModule.java (ReactContextBaseJavaModule)
      const moduleJava = `
package ${androidPackage}.flutterbridge;

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
      `.trim();

      // FlutterBridgePackage.java (ReactPackage)
      const packageJava = `
package ${androidPackage}.flutterbridge;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FlutterBridgePackage implements ReactPackage {

  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new FlutterBridgeModule(reactContext));
    return modules;
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
      `.trim();

      fs.writeFileSync(path.join(javaDir, 'FlutterBridgeModule.java'), moduleJava, 'utf8');
      fs.writeFileSync(path.join(javaDir, 'FlutterBridgePackage.java'), packageJava, 'utf8');

      return cfg;
    },
  ]);

  // 2) Ensure FlutterActivity exists in manifest (idempotent)
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

  // 3) Register the ReactPackage in MainApplication (idempotent patch)
  config = withDangerousMod(config, [
    'android',
    (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      // Try both Kotlin and Java variants commonly used by RN 0.7x templates
      const mainAppKts = path.join(projectRoot, 'android', 'app', 'src', 'main', 'java', ...androidPackage.split('.'), 'MainApplication.kt');
      const mainAppJava = path.join(projectRoot, 'android', 'app', 'src', 'main', 'java', ...androidPackage.split('.'), 'MainApplication.java');

      const addPackageImport = `import ${androidPackage}.flutterbridge.FlutterBridgePackage`;
      const addPackageLine = `packages.add(new FlutterBridgePackage());`;

      function patchMainApplication(filePath, isKotlin) {
        if (!fs.existsSync(filePath)) return false;
        let code = fs.readFileSync(filePath, 'utf8');

        // add import if missing
        if (!code.includes('FlutterBridgePackage')) {
          const importAnchor = isKotlin
            ? /import\s+com\.facebook\.react\.ReactApplication[\s\S]*?\n/
            : /import\s+com\.facebook\.react\.ReactApplication;[\s\S]*?\n/;
          // If anchor not found, prepend at top
          if (importAnchor.test(code)) {
            code = code.replace(importAnchor, (m) => m + addPackageImport + (isKotlin ? '\n' : ';\n'));
          } else {
            code = addPackageImport + (isKotlin ? '\n' : ';\n') + code;
          }
        }

        // register package where packages are created
        if (isKotlin) {
          // Typical RN template: PackageList + mutable list for extra packages
          if (!code.includes('FlutterBridgePackage()')) {
            code = code.replace(
              /PackageList\(this\)\.packages/,
              (m) => `${m}.apply {\n      add(FlutterBridgePackage())\n    }`
            );
          }
        } else {
          if (!code.includes('new FlutterBridgePackage()')) {
            // Find where packages list is constructed
            // Common pattern: List<ReactPackage> packages = new PackageList(this).getPackages();
            code = code.replace(
              /new PackageList\(this\)\.getPackages\(\)/,
              (m) => `${m};\n      ${addPackageLine}`
            );
          }
        }

        fs.writeFileSync(filePath, code, 'utf8');
        return true;
      }

      const patched =
        patchMainApplication(mainAppKts, true) ||
        patchMainApplication(mainAppJava, false);

      if (!patched) {
        // If neither file exists or pattern didn’t match, leave a notice
        const noticePath = path.join(projectRoot, 'android', 'withFlutterBridge.README.txt');
        const msg = `
[withFlutterBridge] Could not automatically patch MainApplication to add FlutterBridgePackage.
Please add the package manually:

Kotlin (MainApplication.kt):
  import ${androidPackage}.flutterbridge.FlutterBridgePackage
  // ...
  override fun getPackages(): List<ReactPackage> {
    return PackageList(this).packages.apply {
      add(FlutterBridgePackage())
    }
  }

Java (MainApplication.java):
  import ${androidPackage}.flutterbridge.FlutterBridgePackage;
  // ...
  @Override
  protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new FlutterBridgePackage());
    return packages;
  }
`;
        try { fs.writeFileSync(noticePath, msg, 'utf8'); } catch {}
      }

      return cfg;
    },
  ]);

  return config;
};
``
