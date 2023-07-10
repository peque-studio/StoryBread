import type { FeatherAttributes, FeatherIcon } from "feather-icons";

export default function createIcon(
	icon: FeatherIcon,
	attrs?: Partial<FeatherAttributes>,
) {
	const svgDocument = new DOMParser().parseFromString(
		icon.toSvg(attrs),
		"image/svg+xml",
	);
	return svgDocument.querySelector("svg")!;
}
