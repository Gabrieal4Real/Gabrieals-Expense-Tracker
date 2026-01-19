const { withDangerousMod, withXcodeProject } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin to integrate XCFrameworks into an iOS project.
 * This plugin survives the prebuild process and automatically links XCFrameworks.
 */
module.exports = function withXCFramework(config, options = {}) {
  const {
    frameworks = ['App.xcframework', 'Flutter.xcframework'],
    frameworksPath = '../native_modules/ios',
  } = options;

  // Add XCFrameworks to the Xcode project
  config = withXcodeProject(config, (cfg) => {
    const xcodeProject = cfg.modResults;
    const projectRoot = cfg.modRequest.projectRoot;
    const pbxGroup = xcodeProject.hash.project.objects.PBXGroup;
    
    // Find or create Frameworks group
    let frameworksGroup;
    for (const key in pbxGroup) {
      if (pbxGroup[key].name === 'Frameworks') {
        frameworksGroup = { uuid: key, group: pbxGroup[key] };
        break;
      }
    }
    
    if (!frameworksGroup) {
      console.warn('[withXCFramework] Could not find Frameworks group in Xcode project');
      return cfg;
    }

    // Get the main target
    const nativeTargets = xcodeProject.hash.project.objects.PBXNativeTarget;
    let mainTargetKey;
    for (const key in nativeTargets) {
      if (nativeTargets[key].name === 'Appspensive') {
        mainTargetKey = key;
        break;
      }
    }

    if (!mainTargetKey) {
      console.warn('[withXCFramework] Could not find main app target');
      return cfg;
    }

    frameworks.forEach((framework) => {
      const frameworkPath = path.join(frameworksPath, framework);
      const frameworkName = framework.replace('.xcframework', '');
      
      // Check if framework is already added
      const alreadyAdded = Object.values(xcodeProject.hash.project.objects.PBXFileReference || {})
        .some(ref => ref.path && ref.path.includes(framework));
      
      if (alreadyAdded) {
        console.log(`[withXCFramework] ${framework} already linked`);
        return;
      }

      try {
        // Ensure PBXBuildFile section exists
        if (!xcodeProject.hash.project.objects.PBXBuildFile) {
          xcodeProject.hash.project.objects.PBXBuildFile = {};
        }
        
        // Create PBXFileReference for the XCFramework
        const fileRefUuid = xcodeProject.generateUuid();
        
        xcodeProject.hash.project.objects.PBXFileReference[fileRefUuid] = {
          isa: 'PBXFileReference',
          lastKnownFileType: 'wrapper.xcframework',
          name: framework,
          path: frameworkPath,
          sourceTree: '"<group>"'
        };
        
        xcodeProject.hash.project.objects.PBXFileReference[fileRefUuid + '_comment'] = framework;

        // Add to Frameworks group
        if (!frameworksGroup.group.children) {
          frameworksGroup.group.children = [];
        }
        frameworksGroup.group.children.push({
          value: fileRefUuid,
          comment: framework
        });

        // Create PBXBuildFile for linking
        const buildFileUuid = xcodeProject.generateUuid();
        
        xcodeProject.hash.project.objects.PBXBuildFile[buildFileUuid] = {
          isa: 'PBXBuildFile',
          fileRef: fileRefUuid
        };
        
        xcodeProject.hash.project.objects.PBXBuildFile[buildFileUuid + '_comment'] = framework + ' in Frameworks';

        // Add to PBXFrameworksBuildPhase
        const frameworksBuildPhase = xcodeProject.hash.project.objects.PBXFrameworksBuildPhase;
        for (const key in frameworksBuildPhase) {
          if (frameworksBuildPhase[key].files) {
            frameworksBuildPhase[key].files.push({
              value: buildFileUuid,
              comment: framework + ' in Frameworks'
            });
            break;
          }
        }

        // Create PBXBuildFile for embedding
        const embedBuildFileUuid = xcodeProject.generateUuid();
        
        xcodeProject.hash.project.objects.PBXBuildFile[embedBuildFileUuid] = {
          isa: 'PBXBuildFile',
          fileRef: fileRefUuid,
          settings: {
            ATTRIBUTES: ['CodeSignOnCopy', 'RemoveHeadersOnCopy']
          }
        };
        
        xcodeProject.hash.project.objects.PBXBuildFile[embedBuildFileUuid + '_comment'] = framework + ' in Embed Frameworks';

        // Find or create "Embed Frameworks" copy files build phase
        let embedPhaseKey;
        
        // Ensure PBXCopyFilesBuildPhase section exists
        if (!xcodeProject.hash.project.objects.PBXCopyFilesBuildPhase) {
          xcodeProject.hash.project.objects.PBXCopyFilesBuildPhase = {};
        }
        
        const copyFilesPhases = xcodeProject.hash.project.objects.PBXCopyFilesBuildPhase;
        for (const key in copyFilesPhases) {
          if (copyFilesPhases[key].name === '"Embed Frameworks"' || copyFilesPhases[key].name === 'Embed Frameworks') {
            embedPhaseKey = key;
            break;
          }
        }

        if (!embedPhaseKey) {
          // Create new Embed Frameworks phase
          console.log(`[withXCFramework]   - Creating new Embed Frameworks phase...`);
          embedPhaseKey = xcodeProject.generateUuid();
          console.log(`[withXCFramework]   - Generated embedPhaseKey: ${embedPhaseKey}`);
          
          xcodeProject.hash.project.objects.PBXCopyFilesBuildPhase[embedPhaseKey] = {
            isa: 'PBXCopyFilesBuildPhase',
            buildActionMask: 2147483647,
            dstPath: '""',
            dstSubfolderSpec: 10,
            files: [],
            name: '"Embed Frameworks"',
            runOnlyForDeploymentPostprocessing: 0
          };
          console.log(`[withXCFramework]   - Created PBXCopyFilesBuildPhase object`);
          
          xcodeProject.hash.project.objects.PBXCopyFilesBuildPhase[embedPhaseKey + '_comment'] = 'Embed Frameworks';
          console.log(`[withXCFramework]   - Added PBXCopyFilesBuildPhase comment`);
          
          // Add to main target's buildPhases
          const mainTarget = nativeTargets[mainTargetKey];
          if (!mainTarget.buildPhases) {
            mainTarget.buildPhases = [];
          }
          mainTarget.buildPhases.push({
            value: embedPhaseKey,
            comment: 'Embed Frameworks'
          });
          console.log(`[withXCFramework]   - Added to main target build phases`);
        }

        // Add to Embed Frameworks phase
        const embedPhase = copyFilesPhases[embedPhaseKey];
        if (!embedPhase.files) {
          embedPhase.files = [];
        }
        embedPhase.files.push({
          value: embedBuildFileUuid,
          comment: framework + ' in Embed Frameworks'
        });

        console.log(`[withXCFramework] Successfully linked and embedded ${framework}`);
      } catch (error) {
        console.error(`[withXCFramework] Failed to link ${framework}:`, error.message);
      }
    });

    // Add framework search paths to the main target build settings
    // frameworksPath is '../native_modules/ios' relative to project root
    // We need it relative to ios folder, so it's just '../native_modules/ios'
    const frameworkSearchPath = `"$(PROJECT_DIR)/${frameworksPath}"`;
    
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      if (typeof configurations[key] === 'object' && configurations[key].buildSettings) {
        const buildSettings = configurations[key].buildSettings;
        if (buildSettings.PRODUCT_BUNDLE_IDENTIFIER && buildSettings.PRODUCT_BUNDLE_IDENTIFIER.includes('expensetracker')) {
          buildSettings.FRAMEWORK_SEARCH_PATHS = buildSettings.FRAMEWORK_SEARCH_PATHS || ['"$(inherited)"'];
          if (Array.isArray(buildSettings.FRAMEWORK_SEARCH_PATHS)) {
            if (!buildSettings.FRAMEWORK_SEARCH_PATHS.some(p => p.includes('native_modules'))) {
              buildSettings.FRAMEWORK_SEARCH_PATHS.push(frameworkSearchPath);
            }
          }
        }
      }
    }
    console.log(`[withXCFramework] Added framework search paths to main target: ${frameworkSearchPath}`);

    return cfg;
  });

  // Modify Podfile to add framework search paths and linking
  config = withDangerousMod(config, ['ios', (cfg) => {
    const projectRoot = cfg.modRequest.projectRoot;
    const podfilePath = path.join(projectRoot, 'ios', 'Podfile');
    
    if (!fs.existsSync(podfilePath)) {
      console.warn('[withXCFramework] Podfile not found, skipping Podfile modifications');
      return cfg;
    }

    let podfileContent = fs.readFileSync(podfilePath, 'utf8');
    // frameworksPath is already relative to projectRoot (e.g., '../native_modules/ios')
    // From the ios/ folder, we need to go up one level and then to native_modules/ios
    // So if frameworksPath is '../native_modules/ios', from ios/ it becomes '../native_modules/ios'
    const relativeFrameworksPath = frameworksPath;

    // Check if modifications already exist
    if (podfileContent.includes('# XCFramework Integration')) {
      console.log('[withXCFramework] Podfile already configured');
      return cfg;
    }

    // Find the post_install block and inject XCFramework configuration
    const xcframeworkConfig = `
    # XCFramework Integration - Configure build settings for XCFrameworks
    # Add framework search paths to the main app target
    installer.target_installation_results.pod_target_installation_results.each do |pod_name, target_installation_result|
      if pod_name == 'Pods-Appspensive'
        target_installation_result.native_target.build_configurations.each do |config|
          config.build_settings['FRAMEWORK_SEARCH_PATHS'] ||= ['$(inherited)']
          config.build_settings['FRAMEWORK_SEARCH_PATHS'] << '$(PROJECT_DIR)/${relativeFrameworksPath}'
          config.build_settings['ENABLE_BITCODE'] = 'NO'
        end
      end
    end
    
    # Also add to Pods project targets
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['FRAMEWORK_SEARCH_PATHS'] ||= ['$(inherited)']
        config.build_settings['FRAMEWORK_SEARCH_PATHS'] << '$(PROJECT_DIR)/${relativeFrameworksPath}'
        config.build_settings['ENABLE_BITCODE'] = 'NO'
        
        if config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < 15.1
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
        end
      end
    end
`;

    // Find the closing of post_install block and inject before it
    const postInstallEndRegex = /(\s+end\s+end\s*)$/m;
    if (postInstallEndRegex.test(podfileContent)) {
      // Insert before the last two 'end' statements
      podfileContent = podfileContent.replace(
        /(\s+)end\s+end\s*$/m,
        `${xcframeworkConfig}$1end\nend\n`
      );
      fs.writeFileSync(podfilePath, podfileContent, 'utf8');
      console.log('[withXCFramework] Added XCFramework configuration to Podfile');
    } else {
      console.warn('[withXCFramework] Could not find react_native_post_install in Podfile');
    }

    return cfg;
  }]);

  return config;
};