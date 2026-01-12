const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');
const path = require('path');

/**
 * Custom Expo config plugin to integrate Flutter AAR with Android build
 * This plugin modifies the generated Gradle files to include the local Maven repository
 * and adds the Flutter AAR as a dependency
 */

const withFlutterAAR = (config) => {
  // Modify app/build.gradle to add the Flutter AAR dependency
  config = withAppBuildGradle(config, (config) => {
    const { modResults } = config;
    let gradleContent = modResults.contents;

    // Add the Flutter AAR dependency if not already present
    const flutterDependency = "    implementation 'com.experian.sample_module:flutter_release:1.0'";
    
    if (!gradleContent.includes(flutterDependency)) {
      // Find the dependencies block and add our dependency
      const dependenciesRegex = /(dependencies\s*\{)/;
      if (dependenciesRegex.test(gradleContent)) {
        gradleContent = gradleContent.replace(
          dependenciesRegex,
          `$1\n${flutterDependency}`
        );
      }
    }

    modResults.contents = gradleContent;
    return config;
  });

  // Modify project/build.gradle to add the local Maven repository
  config = withProjectBuildGradle(config, (config) => {
    const { modResults } = config;
    let gradleContent = modResults.contents;

    // Add the local Maven repository pointing to assets/repo
    const repoDeclaration = `        maven {
            url "$rootDir/../assets/repo"
        }
        maven {
            url "https://storage.googleapis.com/download.flutter.io"
        }`;

    if (!gradleContent.includes('assets/repo')) {
      // Find the allprojects { repositories { block and add our repo
      const allProjectsRepoRegex = /(allprojects\s*\{\s*repositories\s*\{)/;
      if (allProjectsRepoRegex.test(gradleContent)) {
        gradleContent = gradleContent.replace(
          allProjectsRepoRegex,
          `$1\n${repoDeclaration}`
        );
      } else {
        // If allprojects block doesn't exist, try to find repositories in buildscript or other places
        const buildscriptRepoRegex = /(repositories\s*\{)/;
        if (buildscriptRepoRegex.test(gradleContent)) {
          // Add it to the first repositories block found
          gradleContent = gradleContent.replace(
            buildscriptRepoRegex,
            `$1\n${repoDeclaration}`
          );
        }
      }
    }

    modResults.contents = gradleContent;
    return config;
  });

  return config;
};

module.exports = withFlutterAAR;
