import { render, screen } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/context/language/LanguageContext";
import { useEffect } from "react";

const TestComponent = () => {
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage("bg");
  }, [setLanguage]);

  return <div data-testid="language">{language}</div>;
};

test("LanguageProvider provides default language and updates it", () => {
  render(
    <LanguageProvider>
      <TestComponent />
    </LanguageProvider>
  );

  const languageDiv = screen.getByTestId("language");
  expect(languageDiv.textContent).toBe("bg");
});
