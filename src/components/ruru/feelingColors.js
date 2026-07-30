// Shared color palette used by both the feeling wheel segments and the chat
// feeling badges, ported 1:1 from RuRuComms' Form1.cs (GetColorForIndex /
// updateFeelingOnNeatStyle).
export const WHEEL_SEGMENT_COLORS = [
	"#BF8A3E", // fear (orange)
	"#983EBF", // anger (purple)
	"#3E77BF", // sadness (blue)
	"#BF553E", // love (red)
	"#3EBF5D", // joy (green)
	"#E7E432", // surprise (yellow)
];

export const ANCESTOR_BADGE_COLORS = {
	love: "#EB6969",
	anger: "#DF9B6B",
	sadness: "#6BA2DF",
	fear: "#D16BDF",
	surprise: "#DADA60",
	joy: "#60DCBC",
};

// Used when a received feeling name isn't found anywhere in our feelings tree
// (e.g. it came from a differently-versioned client).
export const MANUAL_FEELING_BADGE_COLOR = "#179530";

// Recursively searches the feelings tree for `name` and returns the name of
// its top-level ancestor category (e.g. "scared" -> "fear"), or null if not found.
export function findTopLevelAncestor(tree, name, topLevelName = null) {
	for (const [key, value] of Object.entries(tree)) {
		const ancestor = topLevelName ?? key;
		if (key.toLowerCase() === name.toLowerCase()) {
			return ancestor;
		}
		const found = findTopLevelAncestor(value, name, ancestor);
		if (found) {
			return found;
		}
	}
	return null;
}

export function badgeColorForFeeling(tree, name) {
	const ancestor = findTopLevelAncestor(tree, name);
	if (ancestor && ANCESTOR_BADGE_COLORS[ancestor]) {
		return ANCESTOR_BADGE_COLORS[ancestor];
	}
	return MANUAL_FEELING_BADGE_COLOR;
}

