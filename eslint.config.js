// eslint.config.js
import antfu from "@antfu/eslint-config";

export default antfu(
	{ vue: true, typescript: true },
	{
		// Without `files`, they are general rules for all files
		rules: {
			"style/semi": ["error", "always"],
			"style/quotes": ["error", "double"],
			"style/no-tabs": "off",
			"style/indent": ["error", "tab"],
			"no-console": "warn",
			"no-alert": "warn",
			"unused-imports/no-unused-vars": "warn",
		},
	},
	{
		// Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
		files: ["**/*.vue"],
		rules: {
			"vue/no-mutating-props": ["error", { shallowOnly: true }],
			"unused-imports/no-unused-vars": "off",
			"vue/no-unused-vars": ["warn", { ignorePattern: "^_" }],
		},
	},
);
