import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import InputPanel from "@/components/sandbox/InputPanel";
import { SAMPLES } from "@/data/samples";

const setItem = vi.spyOn(Storage.prototype, "setItem");

afterEach(() => {
  cleanup();
  setItem.mockClear();
});

describe("InputPanel", () => {
  it("menerapkan teks hanya saat tombol diklik dan membangun materi dari input", () => {
    const onApply = vi.fn();
    render(<InputPanel onApply={onApply} onSelectSample={vi.fn()} activeSampleId={SAMPLES[0].id} />);

    fireEvent.click(screen.getByRole("tab", { name: "Tempel teks sendiri" }));
    const input = screen.getByLabelText("Teks materi");
    fireEvent.change(input, { target: { value: "Kalimat pertama untuk belajar. Kalimat kedua untuk latihan." } });
    expect(onApply).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Terapkan materi" }));
    expect(onApply).toHaveBeenCalledWith(
      "Kalimat pertama untuk belajar. Kalimat kedua untuk latihan.",
      "Materi Belajar",
    );
  });

  it("menampilkan pesan untuk input kosong", () => {
    const onApply = vi.fn();
    render(<InputPanel onApply={onApply} onSelectSample={vi.fn()} activeSampleId={null} />);

    fireEvent.click(screen.getByRole("tab", { name: "Tempel teks sendiri" }));
    fireEvent.click(screen.getByRole("button", { name: "Terapkan materi" }));

    expect(screen.getByRole("alert").textContent).toContain("Masukkan teks materi");
    expect(onApply).not.toHaveBeenCalled();
  });

  it("tidak menulis materi pengguna ke localStorage", () => {
    render(<InputPanel onApply={vi.fn()} onSelectSample={vi.fn()} activeSampleId={null} />);

    fireEvent.click(screen.getByRole("tab", { name: "Tempel teks sendiri" }));
    fireEvent.change(screen.getByLabelText("Teks materi"), {
      target: { value: "Materi pribadi yang hanya boleh berada di memori." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Terapkan materi" }));

    expect(setItem).not.toHaveBeenCalled();
  });
});
