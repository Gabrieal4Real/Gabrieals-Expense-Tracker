const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

const FLUTTER_DEPENDENCY = "    implementation 'com.experian.sample_module:flutter_release:1.0'";
const REPO_DECLARATION = `        maven {
            url "$rootDir/../native_modules/android/repo"
        }
        maven {
            url "https://storage.googleapis.com/download.flutter.io"
        }`;

const addFlutterDependency = (config) => {
  const { modResults } = config;
  let gradleContent = modResults.contents;

  if (gradleContent.includes(FLUTTER_DEPENDENCY)) return config;

  const dependenciesRegex = /(dependencies\s*\{)/;
  if (dependenciesRegex.test(gradleContent)) {
    gradleContent = gradleContent.replace(dependenciesRegex, `$1\n${FLUTTER_DEPENDENCY}`);
    modResults.contents = gradleContent;
  }

  return config;
};

const addFlutterRepositories = (config) => {
  const { modResults } = config;
  let gradleContent = modResults.contents;

  if (gradleContent.includes('native_modules/android/repo')) return config;

  const allProjectsRepoRegex = /(allprojects\s*\{\s*repositories\s*\{)/;
  if (allProjectsRepoRegex.test(gradleContent)) {
    gradleContent = gradleContent.replace(allProjectsRepoRegex, `$1\n${REPO_DECLARATION}`);
    modResults.contents = gradleContent;
    return config;
  }

  const buildscriptRepoRegex = /(repositories\s*\{)/;
  if (buildscriptRepoRegex.test(gradleContent)) {
    gradleContent = gradleContent.replace(buildscriptRepoRegex, `$1\n${REPO_DECLARATION}`);
    modResults.contents = gradleContent;
  }

  return config;
};

module.exports = (config) => {
  config = withAppBuildGradle(config, addFlutterDependency);
  config = withProjectBuildGradle(config, addFlutterRepositories);
  return config;
};