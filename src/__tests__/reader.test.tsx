import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import BeforeAfterToggle from "@/components/sandbox/BeforeAfterToggle";
import Sandbox from "@/components/sandbox/Sandbox";
import CardReader from "@/components/reader/CardReader";
import ReadingRuler from "@/components/reader/ReadingRuler";
import { buildModule } from "@/lib/nlp";

const testModule = buildModule(
  "Kalimat pertama menjelaskan konsep dasar dengan cukup rinci. Kalimat kedua memberikan contoh penerapan konsep tersebut. Kalimat ketiga membahas langkah berikutnya. Kalimat keempat menyimpulkan seluruh pembahasan materi.",
  "Materi Uji",
)!;

afterEach(cleanup);

describe("CardReader", () => {
  it("menavigasi maju dan mundur serta memperbarui status kartu", () => {
    render(<CardReader module={testModule} />);

    expect(screen.getAllByText("Kartu 1 dari 2")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Selanjutnya" }));
    expect(screen.getAllByText("Kartu 2 dari 2")).toHaveLength(2);
    expect(screen.getByRole("status").textContent).toBe("Kartu 2 dari 2");

    fireEvent.click(screen.getByRole("button", { name: "Sebelumnya" }));
    expect(screen.getAllByText("Kartu 1 dari 2")).toHaveLength(2);
  });

  it("menonaktifkan navigasi pada batas pertama dan terakhir", () => {
    render(<CardReader module={testModule} />);

    expect(screen.getByRole("button", { name: "Sebelumnya" }).hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Selanjutnya" }));
    expect(screen.getByRole("button", { name: "Selanjutnya" }).hasAttribute("disabled")).toBe(true);
  });
});

describe("BeforeAfterToggle", () => {
  it("menampilkan sourceText persis dengan gaya dasar Standar", () => {
    const sourceText = "Baris pertama.\n\nBaris kedua tetap dipertahankan.";
    render(
      <BeforeAfterToggle
        module={buildModule(sourceText, "Perbandingan")!}
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Teks asli" }));
    const original = screen.getByTestId("original-text");
    expect(original.textContent).toBe(sourceText);
    expect(original.classList.contains("ba-reader")).toBe(false);
    expect(original.style.whiteSpace).toBe("pre-wrap");
    expect(original.style.fontFamily).toContain("ui-sans-serif");
    expect(original.style.fontSize).toBe("18px");
  });

  it("tidak menampilkan ruler pada teks asli meskipun preferensinya aktif", () => {
    render(
      <BeforeAfterToggle module={testModule} rulerEnabled lineHeight={32} />,
    );

    expect(screen.getByTestId("reading-ruler")).not.toBeNull();
    fireEvent.click(screen.getByRole("radio", { name: "Teks asli" }));
    expect(screen.queryByTestId("reading-ruler")).toBeNull();
  });
});

describe("ReadingRuler", () => {
  it("menjaga tinggi pita konsisten dengan pilihan 1, 2, atau 3 baris", () => {
    render(<ReadingRuler lineHeight={32} containerHeight={160} />);

    for (const lines of [1, 2, 3]) {
      fireEvent.click(screen.getByRole("radio", { name: `${lines} baris` }));
      expect(screen.getByTestId("reading-ruler").style.height).toBe(`${lines * 32 + 4}px`);
    }
  });

  it("menaikkan dan menurunkan posisi satu line-height serta membatasi area", () => {
    render(<ReadingRuler lineHeight={32} containerHeight={160} />);
    const ruler = () => screen.getByTestId("reading-ruler");

    expect(ruler().style.top).toBe("0px");
    fireEvent.click(screen.getByRole("button", { name: "Turunkan pita" }));
    expect(ruler().style.top).toBe("32px");
    fireEvent.click(screen.getByRole("button", { name: "Naikkan pita" }));
    expect(ruler().style.top).toBe("0px");
    expect(screen.getByRole("button", { name: "Naikkan pita" }).hasAttribute("disabled")).toBe(true);

    for (let index = 0; index < 5; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Turunkan pita" }));
    }
    expect(ruler().style.top).toBe("124px");
    expect(screen.getByRole("button", { name: "Turunkan pita" }).hasAttribute("disabled")).toBe(true);
  });
});

describe("mode fokus", () => {
  it("menghapus kontrol lain dari pohon aksesibilitas dan memulihkannya saat kembali", () => {
    render(<Sandbox />);

    fireEvent.click(screen.getByRole("button", { name: /Fotosintesis/ }));
    fireEvent.click(screen.getByRole("radio", { name: "Kartu" }));
    fireEvent.click(screen.getByRole("button", { name: "Mode fokus" }));

    expect(screen.queryByRole("tab", { name: "Materi contoh" })).toBeNull();
    expect(screen.queryByRole("radio", { name: /^Disleksia/ })).toBeNull();
    expect(screen.queryByRole("slider", { name: "Ukuran teks" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Kembali ke tampilan lengkap" }));
    expect(screen.getByRole("tab", { name: "Materi contoh" })).not.toBeNull();
    expect(screen.getByRole("radio", { name: /^Disleksia/ })).not.toBeNull();
  });
});
