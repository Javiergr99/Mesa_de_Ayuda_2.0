import { DEFAULT_APPEARANCE } from "@/features/appearance-settings/model/appearance.defaults";
import { applyAppearance } from "@/features/appearance-settings/model/appearance.utils";

describe("appearance utils", () => {
  it("aplica tokens semánticos al elemento raíz", () => {
    applyAppearance({ ...DEFAULT_APPEARANCE, primary: "#611232", cardRadius: 16 });

    expect(document.documentElement.style.getPropertyValue("--ui-primary")).toBe("#611232");
    expect(document.documentElement.style.getPropertyValue("--ui-card-radius")).toBe("16px");
  });
});
