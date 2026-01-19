const { withDangerousMod, withAndroidManifest } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFlutterBridge(config) {
  const androidPackage = (config.android?.package || 'org.gabrieal.expensetracker').toLowerCase();

  // Android Implementation
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

  // iOS Implementation
  config = withDangerousMod(config, ['ios', (cfg) => {
    const projectRoot = cfg.modRequest.projectRoot;
    const iosProjectPath = path.join(projectRoot, 'ios', 'Appspensive');
    
    if (!fs.existsSync(iosProjectPath)) {
      console.warn('[withFlutterBridge] iOS project directory not found, skipping iOS bridge setup');
      return cfg;
    }

    // Create FlutterBridgeModule.swift
    const swiftModule = `//
//  FlutterBridgeModule.swift
//  Appspensive
//
//  Auto-generated by withFlutterBridge plugin
//

import Foundation
import React
import Flutter

@objc(FlutterBridgeModule)
class FlutterBridgeModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func openFlutter(_ route: String?, params: NSDictionary?) {
    DispatchQueue.main.async {
      guard let rootViewController = self.getRootViewController() else {
        print("[FlutterBridge] Could not find root view controller")
        return
      }

      print("Running Flutter engine")
      
      let flutterEngine = FlutterEngine(name: "flutter_engine")
      
      // Set initial route when running the engine (not deprecated)
      if let route = route, !route.isEmpty {
        flutterEngine.run(withEntrypoint: nil, initialRoute: route)
      } else {
        flutterEngine.run()
      }
      
      let flutterViewController = FlutterViewController(engine: flutterEngine, nibName: nil, bundle: nil)
      
      rootViewController.present(flutterViewController, animated: true, completion: nil)
    }
  }
  
  private func getRootViewController() -> UIViewController? {
    guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
          let window = windowScene.windows.first,
          let rootViewController = window.rootViewController else {
      return nil
    }
    
    var topController = rootViewController
    while let presentedViewController = topController.presentedViewController {
      topController = presentedViewController
    }
    
    return topController
  }
}
`;

    // Create FlutterBridgeModule.m (Objective-C bridge)
    const objcBridge = `//
//  FlutterBridgeModule.m
//  Appspensive
//
//  Auto-generated by withFlutterBridge plugin
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FlutterBridgeModule, NSObject)

RCT_EXTERN_METHOD(openFlutter:(NSString *)route params:(NSDictionary *)params)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
`;

    fs.writeFileSync(path.join(iosProjectPath, 'FlutterBridgeModule.swift'), swiftModule, 'utf8');
    fs.writeFileSync(path.join(iosProjectPath, 'FlutterBridgeModule.m'), objcBridge, 'utf8');
    
    console.log('[withFlutterBridge] Created iOS Flutter bridge files');
    
    return cfg;
  }]);

  // Add iOS bridge files to Xcode project
  const { withXcodeProject } = require('@expo/config-plugins');
  config = withXcodeProject(config, (cfg) => {
    const xcodeProject = cfg.modResults;
    
    // Check if files are already added (avoid duplicates)
    const swiftExists = Object.values(xcodeProject.hash.project.objects.PBXFileReference || {})
      .some(ref => ref.path && (ref.path === 'FlutterBridgeModule.swift' || ref.path === 'Appspensive/FlutterBridgeModule.swift'));
    
    if (swiftExists) {
      console.log('[withFlutterBridge] iOS bridge files already in Xcode project');
      return cfg;
    }
    
    try {
      // Find the Appspensive group
      const groups = xcodeProject.hash.project.objects.PBXGroup;
      let appGroupUuid = null;
      
      for (const key in groups) {
        if (groups[key].name === 'Appspensive' || groups[key].path === 'Appspensive') {
          appGroupUuid = key;
          break;
        }
      }
      
      if (!appGroupUuid) {
        throw new Error('Could not find Appspensive group');
      }
      
      // Generate UUIDs
      const swiftFileRefUuid = xcodeProject.generateUuid();
      const objcFileRefUuid = xcodeProject.generateUuid();
      const swiftBuildFileUuid = xcodeProject.generateUuid();
      const objcBuildFileUuid = xcodeProject.generateUuid();
      
      // Add file references
      xcodeProject.hash.project.objects.PBXFileReference = xcodeProject.hash.project.objects.PBXFileReference || {};
      
      xcodeProject.hash.project.objects.PBXFileReference[swiftFileRefUuid] = {
        isa: 'PBXFileReference',
        lastKnownFileType: 'sourcecode.swift',
        path: 'Appspensive/FlutterBridgeModule.swift',
        sourceTree: '"<group>"'
      };
      
      xcodeProject.hash.project.objects.PBXFileReference[objcFileRefUuid] = {
        isa: 'PBXFileReference',
        lastKnownFileType: 'sourcecode.c.objc',
        path: 'Appspensive/FlutterBridgeModule.m',
        sourceTree: '"<group>"'
      };
      
      // Add to Appspensive group
      if (!groups[appGroupUuid].children) {
        groups[appGroupUuid].children = [];
      }
      
      groups[appGroupUuid].children.push({
        value: swiftFileRefUuid,
        comment: 'FlutterBridgeModule.swift'
      });
      
      groups[appGroupUuid].children.push({
        value: objcFileRefUuid,
        comment: 'FlutterBridgeModule.m'
      });
      
      // Create build file objects
      xcodeProject.hash.project.objects.PBXBuildFile = xcodeProject.hash.project.objects.PBXBuildFile || {};
      
      xcodeProject.hash.project.objects.PBXBuildFile[swiftBuildFileUuid] = {
        isa: 'PBXBuildFile',
        fileRef: swiftFileRefUuid,
        fileRef_comment: 'FlutterBridgeModule.swift'
      };
      
      xcodeProject.hash.project.objects.PBXBuildFile[objcBuildFileUuid] = {
        isa: 'PBXBuildFile',
        fileRef: objcFileRefUuid,
        fileRef_comment: 'FlutterBridgeModule.m'
      };
      
      // Add to sources build phase
      const buildPhases = xcodeProject.hash.project.objects.PBXSourcesBuildPhase;
      let addedToPhase = false;
      
      for (const key in buildPhases) {
        const phase = buildPhases[key];
        if (phase.isa === 'PBXSourcesBuildPhase' && Array.isArray(phase.files)) {
          phase.files.push({
            value: swiftBuildFileUuid,
            comment: 'FlutterBridgeModule.swift in Sources'
          });
          
          phase.files.push({
            value: objcBuildFileUuid,
            comment: 'FlutterBridgeModule.m in Sources'
          });
          
          addedToPhase = true;
          break;
        }
      }
      
      if (addedToPhase) {
        console.log('[withFlutterBridge] ✅ Successfully added iOS bridge files to Xcode project');
      } else {
        throw new Error('Could not find PBXSourcesBuildPhase');
      }
      
    } catch (error) {
      console.error('[withFlutterBridge] ❌ Failed to add files automatically:', error.message);
      throw new Error(`Flutter bridge setup failed: ${error.message}\n\nThe plugin cannot complete automatic setup. This is a critical error that prevents the iOS app from working.`);
    }
    
    return cfg;
  });

  return config;
};