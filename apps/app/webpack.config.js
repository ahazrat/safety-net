const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// These warnings come from optional/dead code paths in third-party packages
// (not our source), and don't affect the bundle at runtime:
// - @react-navigation/drawer's legacy Drawer.js statically imports reanimated
//   v1 APIs (Clock, Value, ...) that v3 no longer exports; that file isn't
//   reached at runtime since gesture-handler v2 is installed.
// - react-native-paper's MaterialCommunityIcon tries
//   @react-native-vector-icons/material-design-icons first and falls back to
//   @expo/vector-icons, which we do have installed.
const IGNORED_MODULE_WARNINGS = [
	/Can't resolve '@react-native-vector-icons\/material-design-icons'/,
	/'react-native-reanimated'/,
];

module.exports = async function (env, argv) {
	const config = await createExpoWebpackConfigAsync(env, argv);
	config.ignoreWarnings = [
		...(config.ignoreWarnings || []),
		(warning) => IGNORED_MODULE_WARNINGS.some((pattern) => pattern.test(warning.message)),
	];
	return config;
};
