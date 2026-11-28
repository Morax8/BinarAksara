import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ExportControls from "@/components/controls/ExportControls";
import PrintLayout from "@/components/print/PrintLayout";
import { buildModule } from "@/lib/nlp";

const learningModule = buildModule(
  "Kalimat pertama menjelaskan konsep dasar. Kalimat kedua memberikan contoh penerapan. Kalimat ketiga membahas langkah berikutnya.",
  "Materi Uji",
)!;

afterEach(() => vi.restoreAllMocks());

describe("ExportControls", () => {
  it("memanggil window.print tepat sekali dari tombol", () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);
    render(<ExportControls />);

    fireEvent.click(screen.getByRole("button", { name: "Cetak / Simpan PDF" }));

    expect(print).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/seluruh materi adaptif/i)).not.toBeNull();
  });
});

describe("PrintLayout", () => {
  it("memuat judul, profil, dan seluruh kartu tanpa kontrol interaktif", () => {
    const { container } = render(
      <PrintLayout
        module={learningModule}
        title="Materi Uji"
        profileLabel="Low Vision"
      />,
    );

    const layout = screen.getByTestId("print-layout");
    expect(within(layout).getByText("BinarAksara")).not.toBeNull();
    expect(within(layout).getByRole("heading", { name: "Materi Uji" })).not.toBeNull();
    expect(within(layout).getByText(/Profil: Low Vision/)).not.toBeNull();
    expect(within(layout).getByText(learningModule.cards[0].text)).not.toBeNull();
    expect(within(layout).getByText(learningModule.cards.at(-1)!.text)).not.toBeNull();
    expect(container.querySelectorAll("[data-print-card]")).toHaveLength(learningModule.cards.length);
    expect(layout.querySelector("button, input, select, textarea, a, [role='button'], [role='slider']")).toBeNull();
  });
});
