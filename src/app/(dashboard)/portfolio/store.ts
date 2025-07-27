import { LanguageField } from "@/interfaces/post.interface";
import { create } from "zustand";

// The Portfolio Page store (with zustand)

interface StoreType {
  activeLanguages: LanguageField[];

  // actions
  setActiveLanguages: (
    languages: LanguageField[] | ((prev: LanguageField[]) => LanguageField[])
  ) => void;
}

const usePortfolioStore = create<StoreType>((set) => ({
  activeLanguages: [{ id: "en", code: "en", name: "English" }],

  // set many
  setActiveLanguages: (
    languages: LanguageField[] | ((prev: LanguageField[]) => LanguageField[])
  ) =>
    set((state) => ({
      activeLanguages:
        typeof languages === "function"
          ? languages(state.activeLanguages)
          : languages,
    })),
}));

export default usePortfolioStore;
