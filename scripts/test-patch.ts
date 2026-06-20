import { patchSettings } from "../app/services/theme-engine/index";
async function test() {
  try {
    await patchSettings({} as any, "123", { colors_accent_1: "#fff" });
  } catch (e) {
    console.log("Caught:", e);
  }
}
test();
