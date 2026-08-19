"use client";

import { useEffect, useMemo, useState } from "react";
import SectionLink from "./SectionLink";
import {
  drawQuestions,
  isBlankCorrect,
} from "../quizzes/sample";
import type { QuizQuestion } from "../quizzes/types";

const STORAGE_PREFIX = "kambaz-book-selfcheck:";

type AttemptRecord = {
  attempts: number;
  lastScore: number;
  lastTotal: number;
};

type Phase = "idle" | "quiz" | "summary";

function readRecord(quizId: string): AttemptRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + quizId);
    if (!raw) return null;
    return JSON.parse(raw) as AttemptRecord;
  } catch {
    return null;
  }
}

function writeRecord(quizId: string, record: AttemptRecord) {
  try {
    localStorage.setItem(STORAGE_PREFIX + quizId, JSON.stringify(record));
  } catch {
    /* private mode / quota — quiz still works */
  }
}

function QuizCode({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-[0.8rem] leading-relaxed text-neutral-800">
      <code>{code}</code>
    </pre>
  );
}

export default function SelfCheck({
  quizId,
  bank,
  count = 10,
}: {
  quizId: string;
  bank: QuizQuestion[];
  count?: number;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [items, setItems] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [blank, setBlank] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [prior, setPrior] = useState<AttemptRecord | null>(null);

  useEffect(() => {
    setPrior(readRecord(quizId));
  }, [quizId]);

  const current = items[index];
  const score = results.filter(Boolean).length;

  const kindLabel = useMemo(() => {
    if (!current) return "";
    const labels: Record<string, string> = {
      concept: "Concept",
      syntax: "Syntax",
      acronym: "Acronym",
      snippet: "Code",
      blank: "Fill in the blank",
      puzzle: "Puzzle",
    };
    return labels[current.kind] ?? current.kind;
  }, [current]);

  function start() {
    setItems(drawQuestions(bank, count));
    setIndex(0);
    setSelected("");
    setBlank("");
    setRevealed(false);
    setResults([]);
    setPhase("quiz");
  }

  function check() {
    if (!current || revealed) return;
    const ok = current.choices?.length
      ? selected === current.answer
      : isBlankCorrect(current, blank);
    setRevealed(true);
    setResults((prev) => [...prev, ok]);
  }

  function next() {
    if (index + 1 >= items.length) {
      const nextScore = [...results].filter(Boolean).length;
      const prev = readRecord(quizId);
      const record: AttemptRecord = {
        attempts: (prev?.attempts ?? 0) + 1,
        lastScore: nextScore,
        lastTotal: items.length,
      };
      writeRecord(quizId, record);
      setPrior(record);
      setPhase("summary");
      return;
    }
    setIndex((i) => i + 1);
    setSelected("");
    setBlank("");
    setRevealed(false);
  }

  return (
    <div className="my-4 overflow-hidden rounded border border-neutral-300 bg-white shadow-sm">
      <div className="border-b border-neutral-300 bg-neutral-100 px-3 py-2 font-sans text-sm text-neutral-700">
        Self-check — {count} questions from a bank of {bank.length}
      </div>

      <div className="space-y-4 p-4 font-sans text-[0.95rem]">
        {phase === "idle" ? (
          <>
            <p className="m-0 text-neutral-800">
              Ten questions, drawn at random from this section&apos;s bank —
              a mix of concepts, syntax, acronyms, snippets, fill-in-the-blank,
              and short puzzles. This is for you, not Canvas: check an answer,
              read the explanation, then try another draw if you want.
            </p>
            {prior ? (
              <p className="m-0 text-sm text-neutral-600">
                Last time: {prior.lastScore}/{prior.lastTotal} —{" "}
                {prior.attempts} attempt{prior.attempts === 1 ? "" : "s"} on
                this device.
              </p>
            ) : null}
            <button
              type="button"
              onClick={start}
              className="rounded border border-neutral-400 bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
            >
              Start self-check
            </button>
          </>
        ) : null}

        {phase === "summary" ? (
          <Summary
            items={items}
            results={results}
            score={score}
            attempts={prior?.attempts}
            onRetry={start}
          />
        ) : null}

        {phase === "quiz" && current ? (
          <QuestionCard
            current={current}
            index={index}
            total={items.length}
            kindLabel={kindLabel}
            selected={selected}
            blank={blank}
            revealed={revealed}
            lastWasCorrect={results[results.length - 1] ?? false}
            onSelect={setSelected}
            onBlank={setBlank}
            onCheck={check}
            onNext={next}
            isLast={index === items.length - 1}
          />
        ) : null}
      </div>
    </div>
  );
}

function Summary({
  items,
  results,
  score,
  attempts,
  onRetry,
}: {
  items: QuizQuestion[];
  results: boolean[];
  score: number;
  attempts?: number;
  onRetry: () => void;
}) {
  const misses = items.filter((_, i) => results[i] === false);
  return (
    <>
      <p className="m-0 text-lg font-semibold text-neutral-900">
        {score}/{items.length} correct
        {attempts ? (
          <span className="ml-2 text-sm font-normal text-neutral-600">
            (attempt {attempts} on this device)
          </span>
        ) : null}
      </p>
      {misses.length > 0 ? (
        <div>
          <p className="mb-2 mt-0 font-medium">Worth another look:</p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            {misses.map((q) => (
              <li key={q.id}>
                <SectionLink to={q.section} />
                {" — "}
                {q.prompt.length > 80 ? `${q.prompt.slice(0, 80)}…` : q.prompt}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="m-0 text-neutral-800">
          Clean sweep — try another draw to see a different mix from the bank.
        </p>
      )}
      <button
        type="button"
        onClick={onRetry}
        className="rounded border border-neutral-400 bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
      >
        Try another 10
      </button>
    </>
  );
}

function QuestionCard({
  current,
  index,
  total,
  kindLabel,
  selected,
  blank,
  revealed,
  lastWasCorrect,
  onSelect,
  onBlank,
  onCheck,
  onNext,
  isLast,
}: {
  current: QuizQuestion;
  index: number;
  total: number;
  kindLabel: string;
  selected: string;
  blank: string;
  revealed: boolean;
  lastWasCorrect: boolean;
  onSelect: (id: string) => void;
  onBlank: (value: string) => void;
  onCheck: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const canCheck = current.choices?.length
    ? selected !== ""
    : blank.trim() !== "";

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-neutral-600">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>
          {kindLabel}
          {" · "}
          <SectionLink to={current.section} />
        </span>
      </div>

      <p className="m-0 font-medium text-neutral-900">{current.prompt}</p>
      {current.code ? <QuizCode code={current.code} /> : null}

      {current.choices?.length ? (
        <fieldset className="m-0 border-0 p-0">
          <legend className="sr-only">{current.prompt}</legend>
          <ul className="m-0 list-none space-y-1.5 p-0">
            {current.choices.map((choice) => {
              const isAnswer = choice.id === current.answer;
              const isPick = choice.id === selected;
              let extra = "border-neutral-300 bg-white hover:bg-neutral-50";
              if (revealed && isAnswer) {
                extra = "border-green-600 bg-green-50";
              } else if (revealed && isPick && !isAnswer) {
                extra = "border-red-600 bg-red-50";
              } else if (!revealed && isPick) {
                extra = "border-neutral-700 bg-neutral-100";
              }
              return (
                <li key={choice.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-2 rounded border px-3 py-2 ${extra} ${revealed ? "cursor-default" : ""}`}
                  >
                    <input
                      type="radio"
                      className="mt-1"
                      name={`selfcheck-${current.id}`}
                      value={choice.id}
                      checked={selected === choice.id}
                      disabled={revealed}
                      onChange={() => onSelect(choice.id)}
                    />
                    <span>{choice.text}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ) : (
        <label className="block">
          <span className="sr-only">Your answer</span>
          <input
            type="text"
            value={blank}
            disabled={revealed}
            onChange={(e) => onBlank(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onCheck();
              }
            }}
            autoComplete="off"
            className="w-full rounded border border-neutral-400 px-3 py-2 font-mono text-sm outline-none focus:border-neutral-700"
            placeholder="Type your answer"
          />
        </label>
      )}

      {revealed ? (
        <div
          className={
            lastWasCorrect
              ? "rounded border border-green-600 bg-green-50 px-3 py-2"
              : "rounded border border-red-600 bg-red-50 px-3 py-2"
          }
        >
          <p className="m-0 font-semibold">
            {lastWasCorrect ? "Correct" : "Not quite"}
          </p>
          <p className="mb-0 mt-1">{current.explanation}</p>
          <p className="mb-0 mt-1 text-sm">
            Review <SectionLink to={current.section} />.
          </p>
        </div>
      ) : null}

      <div className="flex gap-2">
        {!revealed ? (
          <button
            type="button"
            onClick={onCheck}
            disabled={!canCheck}
            className="rounded border border-neutral-400 bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            Check
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="rounded border border-neutral-400 bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-700"
          >
            {isLast ? "See score" : "Next"}
          </button>
        )}
      </div>
    </>
  );
}
