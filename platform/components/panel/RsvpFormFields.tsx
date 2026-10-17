'use client';
// "Reply form" (G128): the simplest editor of what guests fill in. The built-in fields first (their label = the design's
// form text, content.copy.form_*; Name and "Will you attend?" are always required and cannot be removed, the guest
// count is always asked, Email and the note get a Required / Optional switch: content.rsvp.required), then the couple's
// own questions (content.rsvp.questions: question, answer type, choices, Required / Optional; add, move, remove).
// One system with G051's questions and G068's labels: nothing is stored twice. The Excel, CSV and Google Sheet columns
// follow this list (lib/rsvp/table.ts).

import { Lock, Plus } from 'lucide-react';
import type { ContentRecord, RsvpQuestion, RsvpQuestionType } from '../../lib/content/types.ts';
import { CONTENT_LIMITS } from '../../lib/content/limits.ts';
import { newQuestionId } from '../../lib/panel/model.ts';
import { QUESTION_TYPE_LABELS, QUESTION_TYPES, type RequirableField } from '../../lib/rsvp/form-config.ts';
import { withCopy, type PanelCopyEntry } from '../../lib/theme/copy.ts';
import { IssueList, RepeatableItem, SelectField, TextField, usePanelContext } from './fields.tsx';
import { Badge, Button, Segmented } from './ui.tsx';
import { msg, t } from '../../lib/i18n/client.ts';
import styles from './panel.module.css';
import own from './rsvp-form-fields.module.css';

type Need = 'required' | 'optional';
const NEED_OPTIONS: Array<{ value: Need; label: string }> = [
  { value: 'required', label: msg('Required') },
  { value: 'optional', label: msg('Optional') },
];
const needOptions = () => NEED_OPTIONS.map((o) => ({ ...o, label: t(o.label) }));

const typeOptions = () => QUESTION_TYPES.map((type) => ({ value: type, label: t(QUESTION_TYPE_LABELS[type]) }));
const TYPE_HINTS: Record<RsvpQuestionType, string> = {
  choice: msg('Guests pick one of your choices.'),
  yesno: msg('Guests tap Yes or No.'),
  text: msg('Guests write a few words.'),
  long: msg('Guests can write a longer answer.'),
  number: msg('Guests type a number, for example how many children are coming.'),
};

interface FixedField {
  /** The design's text of this field's label (content.copy key). */
  copyKey: string;
  fallback: string;
  /** Required / Optional switch; null = always required (name, attending) or always asked (guests). */
  requirable: RequirableField | null;
  fixed?: 'required' | 'asked';
}

const FIXED: FixedField[] = [
  { copyKey: 'form_name', fallback: msg('Your name'), requirable: null, fixed: 'required' },
  { copyKey: 'form_attend', fallback: msg('Will you attend?'), requirable: null, fixed: 'required' },
  { copyKey: 'form_guests', fallback: msg('Number of guests'), requirable: null, fixed: 'asked' },
  { copyKey: 'form_email', fallback: msg('Email'), requirable: 'email' },
  { copyKey: 'form_note', fallback: msg('A note for the couple'), requirable: 'message' },
];

function setRequired(c: ContentRecord, field: RequirableField, on: boolean) {
  const next = { ...(c.rsvp.required ?? {}) };
  if (on) next[field] = true;
  else delete next[field];
  if (Object.keys(next).length) c.rsvp = { ...c.rsvp, required: next };
  else {
    const { required: _drop, ...rest } = c.rsvp;
    c.rsvp = rest;
  }
}

function FixedRow({ f, entry }: { f: FixedField; entry: PanelCopyEntry | undefined }) {
  const { content, edit, locked } = usePanelContext();
  const label = entry?.default ?? t(f.fallback);
  const raw = content.copy?.[f.copyKey];
  const required = f.requirable ? content.rsvp?.required?.[f.requirable] === true : true;
  return (
    <div className={own.row} data-rsvp-field={f.copyKey}>
      {entry ? (
        <TextField
          path={`copy.${f.copyKey}`}
          label={t('Label')}
          placeholder={entry.default}
          maxLength={entry.max}
          value={typeof raw === 'string' ? raw : ''}
          onChange={(v) => edit((c) => withCopy(c, f.copyKey, v.trim() ? v : null))}
        />
      ) : (
        <p className={own.fixedLabel}>{label}</p>
      )}
      {f.requirable ? (
        <Segmented<Need>
          label={t('Guests must fill this in?')}
          value={required ? 'required' : 'optional'}
          options={needOptions()}
          disabled={locked}
          onChange={(v) => edit((c) => setRequired(c, f.requirable!, v === 'required'))}
        />
      ) : (
        <p className={own.always}>
          <Badge tone="neutral" icon={Lock}>
            {f.fixed === 'asked' ? t('Always asked') : t('Always required')}
          </Badge>
          <span className={styles.hint}>{f.fixed === 'asked' ? t('Guests who accept say how many are coming.') : t('Every reply needs this.')}</span>
        </p>
      )}
    </div>
  );
}

function QuestionCard({ q, i, count }: { q: RsvpQuestion; i: number; count: number }) {
  const { edit, issuesAt, locked } = usePanelContext();
  const change = (fn: (x: RsvpQuestion) => void) => edit((c) => void fn(c.rsvp.questions![i]));
  return (
    <RepeatableItem<RsvpQuestion>
      index={i}
      count={count}
      noun={t('form question')}
      title={q.label.trim() || t('Question {n}', { n: i + 1 })}
      select={(c) => c.rsvp?.questions ?? []}
      assign={(c, list) => void (c.rsvp = { ...c.rsvp, questions: list })}
      data-question-row={i}
    >
      <TextField
        path={`rsvp.questions.${i}.label`}
        label={t('Question')}
        maxLength={CONTENT_LIMITS.questionLabel}
        placeholder={t('Meal choice')}
        value={q.label}
        onChange={(v) => change((x) => void (x.label = v))}
      />
      <SelectField
        path={`rsvp.questions.${i}.type`}
        label={t('Answer')}
        hint={TYPE_HINTS[q.type] ? t(TYPE_HINTS[q.type]) : undefined}
        value={q.type}
        options={typeOptions()}
        onChange={(v) =>
          change((x) => {
            x.type = (QUESTION_TYPES as readonly string[]).includes(v) ? (v as RsvpQuestionType) : 'text';
            if (x.type !== 'choice') delete x.options;
            else if (!x.options?.length) x.options = ['', ''];
          })
        }
      />
      {q.type === 'choice'
        ? (q.options ?? []).map((o, j) => (
            <div key={j} className={styles.choiceRow}>
              <TextField
                path={`rsvp.questions.${i}.options.${j}`}
                label={t('Choice {n}', { n: j + 1 })}
                maxLength={CONTENT_LIMITS.questionOption}
                value={o}
                onChange={(v) => change((x) => void (x.options![j] = v))}
              />
              <Button small variant="tertiary" disabled={locked} aria-label={t('Remove choice {choice} of question {question}', { choice: j + 1, question: i + 1 })} onClick={() => change((x) => void x.options!.splice(j, 1))}>
                {t('Remove')}
              </Button>
            </div>
          ))
        : null}
      <IssueList issues={[...issuesAt(`rsvp.questions.${i}.options`), ...issuesAt(`rsvp.questions.${i}.id`)]} />
      {q.type === 'choice' && (q.options?.length ?? 0) < CONTENT_LIMITS.questionOptions ? (
        <Button small variant="secondary" icon={Plus} disabled={locked} onClick={() => change((x) => void (x.options = [...(x.options ?? []), '']))}>
          {t('Add a choice')}
        </Button>
      ) : null}
      <Segmented<Need>
        label={t('Guests must answer?')}
        value={q.required ? 'required' : 'optional'}
        options={needOptions()}
        disabled={locked}
        onChange={(v) =>
          change((x) => {
            if (v === 'required') x.required = true;
            else delete x.required;
          })
        }
      />
    </RepeatableItem>
  );
}

export function RsvpFormFields({ copy, questionsShown }: { copy: readonly PanelCopyEntry[]; questionsShown: boolean }) {
  const { content, edit, issuesAt, locked } = usePanelContext();
  const questions = content.rsvp?.questions ?? [];
  const off = content.rsvp?.method === 'none';
  const entry = (key: string) => copy.find((e) => e.key === key);
  const add = () =>
    edit((c) => {
      const list = c.rsvp.questions ?? [];
      c.rsvp = { ...c.rsvp, questions: [...list, { id: newQuestionId(list.map((q) => q.id)), label: '', type: 'choice', options: ['', ''] }] };
    });
  return (
    <div className={own.wrap} data-rsvp-form-fields>
      <h2 className={styles.subTitle}>{t('Reply form')}</h2>
      <p className={styles.hint}>
        {t('What guests fill in. A required field must be filled in before a reply can be sent. Your Excel file and Google Sheet get a column for each field.')}
      </p>
      {off ? <p className={styles.note}>{t('Replies on the website are off, so guests do not see this form.')}</p> : null}
      <div className={own.list}>
        {FIXED.map((f) => (
          <div key={f.copyKey} className={styles.item}>
            <div className={styles.itemHead}>
              <span className={styles.itemTitle}>{entry(f.copyKey)?.default ?? t(f.fallback)}</span>
            </div>
            <FixedRow f={f} entry={entry(f.copyKey)} />
          </div>
        ))}
      </div>
      {questionsShown ? (
        <div data-rsvp-questions className={own.list}>
          <h3 className={own.subhead}>{t('Your questions')}</h3>
          <p className={styles.hint}>
            {t('Up to {max}, for example a meal choice. Guests who accept answer them. Changing or removing a question later keeps the answers you already have.', { max: CONTENT_LIMITS.rsvpQuestions })}
          </p>
          {questions.map((q, i) => (
            <QuestionCard key={q.id || i} q={q} i={i} count={questions.length} />
          ))}
          <IssueList issues={issuesAt('rsvp.questions')} />
          {questions.length < CONTENT_LIMITS.rsvpQuestions ? (
            <Button variant="secondary" icon={Plus} disabled={locked} onClick={add} data-add-question>
              {t('Add a question')}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
