/**
 * Expo config plugin — renames the release APK output to Wayfinder-release.apk
 *
 * Injects an applicationVariants.all block into android/app/build.gradle
 * during expo prebuild (which EAS runs before building).
 */
const { withAppBuildGradle } = require('@expo/config-plugins');

const RENAME_BLOCK = `
// Rename APK output to Wayfinder-release.apk
android.applicationVariants.all { variant ->
    variant.outputs.all { output ->
        outputFileName = "Wayfinder-\${variant.buildType.name}.apk"
    }
}
`;

module.exports = function withApkName(config) {
  return withAppBuildGradle(config, (mod) => {
    const gradle = mod.modResults.contents;

    // Only inject once — guard against duplicate runs
    if (gradle.includes('outputFileName = "Wayfinder-')) {
      return mod;
    }

    // Insert right before the dependencies block
    mod.modResults.contents = gradle.replace(
      /^dependencies\s*\{/m,
      RENAME_BLOCK + '\ndependencies {'
    );

    return mod;
  });
};
