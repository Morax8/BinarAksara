import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Tentang, { metadata } from "@/app/tentang/page";

describe("halaman Tentang", () => {
  it("menjelaskan cara kerja, privasi, batasan, dan menyediakan jalan kembali", () => {
    render(<Tentang />);

    expect(screen.getByRole("heading", { name: "Tentang BinarAksara" })).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Privasi" })).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Batasan" })).not.toBeNull();
    expect(screen.getByText(/tidak ada pretrained AI/i)).not.toBeNull();
    expect(screen.getByText(/bukan diagnosis/i)).not.toBeNull();
    expect(screen.getByText(/voice online.*dapat mengirim teks/i)).not.toBeNull();
    expect(screen.getByText(/localService=true/i)).not.toBeNull();
    expect(screen.getByText(/tidak memiliki backend atau API TTS sendiri/i)).not.toBeNull();
    expect(screen.getAllByRole("link", { name: "Kembali ke sandbox" }).every((link) => link.getAttribute("href") === "/")).toBe(true);
    expect(document.querySelectorAll("main#konten-utama")).toHaveLength(1);
    expect(metadata.title).toBe("Tentang BinarAksara");
    expect(metadata.description).toBeTruthy();
  });
});
