import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ClozeQuiz from "@/components/reader/ClozeQuiz";
import { createClozeItems } from "@/lib/nlp/cloze";
import { buildModule } from "@/lib/nlp";
import { SAMPLES } from "@/data/samples";

const quizModule = buildModule(SAMPLES[0].content)!;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ClozeQuiz", () => {
  it("menonaktifkan Jawab sebelum memilih lalu memberi feedback dan mengunci opsi", () => {
    render(<ClozeQuiz module={quizModule} />);
    const submit = screen.getByRole("button", { name: "Jawab" }) as HTMLButtonElement;
    const item = createClozeItems(quizModule, quizModule.id)[0];
    expect(submit.disabled).toBe(true);

    fireEvent.click(screen.getByRole("radio", { name: item.answer }));
    expect(submit.disabled).toBe(false);
    fireEvent.click(submit);
    expect(screen.getByRole("status").textContent).toContain("Benar");
    expect(screen.getAllByRole("radio").every((radio) => (radio as HTMLInputElement).disabled)).toBe(true);
  });

  it("menjelaskan jawaban benar dan kalimat sumber ketika salah", () => {
    render(<ClozeQuiz module={quizModule} />);
    const item = createClozeItems(quizModule, quizModule.id)[0];
    const wrong = item.options.find((option) => option !== item.answer)!;
    fireEvent.click(screen.getByRole("radio", { name: wrong }));
    fireEvent.click(screen.getByRole("button", { name: "Jawab" }));
    expect(screen.getByRole("status").textContent).toContain("Belum tepat");
    expect(screen.getByRole("status").textContent).toContain(item.answer);
    expect(screen.getByRole("status").textContent).toContain(item.prompt.replace("_____", item.answer));
  });

  it("memajukan soal dengan fokus, menampilkan skor, dan mengulang item yang sama", () => {
    render(<ClozeQuiz module={quizModule} />);
    const items = createClozeItems(quizModule, quizModule.id);
    let correct = 0;

    items.forEach((item, index) => {
      expect(screen.getByText(`Soal ${index + 1} dari ${items.length}`)).not.toBeNull();
      const answer = index === 0 ? item.options.find((option) => option !== item.answer)! : item.answer;
      if (index > 0) correct += 1;
      fireEvent.click(screen.getByRole("radio", { name: answer }));
      fireEvent.click(screen.getByRole("button", { name: "Jawab" }));
      fireEvent.click(screen.getByRole("button", { name: "Soal berikutnya" }));
      if (index < items.length - 1) {
        expect(document.activeElement).toBe(screen.getByRole("heading", { name: "Lengkapi kalimat berikut" }));
      }
    });

    expect(screen.getByRole("status").textContent).toContain(`Skor: ${correct}/${items.length} benar`);
    fireEvent.click(screen.getByRole("button", { name: "Ulangi kuis" }));
    expect(screen.getByText(`Soal 1 dari ${items.length}`)).not.toBeNull();
    expect(screen.getByRole("button", { name: "Jawab" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getAllByRole("radio").every((radio) => !(radio as HTMLInputElement).checked)).toBe(true);
  });

  it("mengacak ulang sesuai seed baru dan mereset progres", () => {
    const { rerender } = render(<ClozeQuiz module={quizModule} />);
    const initial = createClozeItems(quizModule, quizModule.id)[0];
    const shuffled = createClozeItems(quizModule, `${quizModule.id}-acak-1`)[0];
    fireEvent.click(screen.getByRole("radio", { name: initial.answer }));
    fireEvent.click(screen.getByRole("button", { name: "Jawab" }));
    fireEvent.click(screen.getByRole("button", { name: "Acak ulang" }));
    expect(screen.getByText(shuffled.prompt)).not.toBeNull();
    expect(screen.queryByRole("status")).toBeNull();

    const other = buildModule(SAMPLES[1].content)!;
    rerender(<ClozeQuiz key={other.id} module={other} />);
    expect(screen.getByText(createClozeItems(other, other.id)[0].prompt)).not.toBeNull();
  });

  it("menampilkan empty state yang dapat diakses tanpa kontrol kuis", () => {
    const empty = buildModule("Aku dan kamu di sini.")!;
    render(<ClozeQuiz module={empty} />);
    expect(screen.getByRole("region", { name: "Latih pemahaman" }).textContent).toContain("belum memiliki cukup kandidat");
    expect(screen.queryByRole("button", { name: "Jawab" })).toBeNull();
  });

  it("tidak menyimpan jawaban atau skor ke localStorage", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    render(<ClozeQuiz module={quizModule} />);
    const item = createClozeItems(quizModule, quizModule.id)[0];
    fireEvent.click(screen.getByRole("radio", { name: item.answer }));
    fireEvent.click(screen.getByRole("button", { name: "Jawab" }));
    expect(setItem).not.toHaveBeenCalled();
  });
});
