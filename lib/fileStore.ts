import fs from "fs";
import path from "path";
import { formListSchema, formSchema, type Form } from "./formSchema";

const DATA_PATH = path.join(process.cwd(), "data", "forms.json");

function readData(): Form[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    try {
      return formListSchema.parse(parsed);
    } catch (innerErr) {
      // Attempt to repair common issues (missing/invalid uuid, invalid dates)
      if (Array.isArray(parsed)) {
        const repaired = parsed.map((item) => {
          const copy: any = { ...item };
          // ensure id is a valid uuid-like string
          const uuidRegex =
            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
          if (
            !copy.id ||
            typeof copy.id !== "string" ||
            !uuidRegex.test(copy.id)
          ) {
            try {
              copy.id = crypto.randomUUID();
            } catch (e) {
              // fallback simple id
              copy.id =
                String(Date.now()) + Math.random().toString(36).slice(2, 8);
            }
          }

          // ensure updatedAt is ISO
          if (!copy.updatedAt || Number.isNaN(Date.parse(copy.updatedAt))) {
            copy.updatedAt = new Date().toISOString();
          }

          // coerce fieldsCount
          if (
            copy.fieldsCount == null ||
            typeof copy.fieldsCount !== "number"
          ) {
            const n = Number(copy.fieldsCount);
            copy.fieldsCount = Number.isFinite(n)
              ? Math.max(0, Math.min(50, Math.trunc(n || 0)))
              : 0;
          }

          return copy;
        });

        try {
          return formListSchema.parse(repaired);
        } catch (finalErr) {
          console.error("Failed to repair seed data:", finalErr);
          return [];
        }
      }
      throw innerErr;
    }
  } catch (err) {
    console.error("Failed to read seed data:", err);
    return [];
  }
}

function writeData(forms: Form[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(forms, null, 2), "utf-8");
}

export const store = {
  list(): Form[] {
    return readData().sort(
      (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
    );
  },
  get(id: string) {
    return readData().find((f) => f.id === id) || null;
  },
  create(input: Partial<Form>): Form {
    const toCreate = formSchema.parse({
      ...input,
      id: input.id ?? crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    });
    const all = readData();
    all.push(toCreate);
    writeData(all);
    return toCreate;
  },
  update(id: string, input: Partial<Form>) {
    const all = readData();
    const idx = all.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    const merged = {
      ...all[idx],
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };
    const parsed = formSchema.parse(merged);
    all[idx] = parsed;
    writeData(all);
    return parsed;
  },
  delete(id: string) {
    const all = readData();
    const filtered = all.filter((f) => f.id !== id);
    if (filtered.length === all.length) return false;
    writeData(filtered);
    return true;
  },
};
