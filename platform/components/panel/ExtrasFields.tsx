'use client';
// G138 editors of the Details page: "Good to know" (0–10 free blocks), "Travel & stay" (getting here + 0–6 places to
// stay) and "Meal & menu" (is a meal served? + the menu, with a shortcut to a meal choice question on the RSVP form).
// Everything is optional: an empty part leaves no trace on the website (lib/theme/extras-block.ts).

import { Plus, X } from 'lucide-react';
import type { ContentRecord, DetailsBlock, DetailsBlockIcon, MealCourse, TravelNote, TravelStay } from '../../lib/content/types.ts';
import { CONTENT_LIMITS } from '../../lib/content/limits.ts';
import { addMealQuestion, existingMealQuestion, mealChoices, mealQuestionState } from '../../lib/panel/meal-question.ts';
import { Group, IssueList, RepeatableItem, SelectField, TextField, UrlField, usePanelContext } from './fields.tsx';
import { BlockSwitch } from './sections.tsx';
import { Button, EmptyState, Segmented, useSnackbar } from './ui.tsx';
import styles from './panel.module.css';

const nullIfEmpty = (v: string): string | null => (v.trim() ? v : null);
const L = CONTENT_LIMITS;

// ---------------------------------------------------------------------------------------------
// Good to know (details_blocks)

const ICON_OPTIONS: Array<{ value: DetailsBlockIcon | ''; label: string }> = [
  { value: '', label: 'No icon' },
  { value: 'info', label: 'Info' },
  { value: 'dress', label: 'Dress' },
  { value: 'kids', label: 'Children' },
  { value: 'gift', label: 'Gift' },
  { value: 'car', label: 'Car' },
  { value: 'weather', label: 'Weather' },
  { value: 'camera', label: 'Camera' },
  { value: 'music', label: 'Music' },
  { value: 'glass', label: 'Glass' },
  { value: 'heart', label: 'Heart' },
];

/** One-tap starters: a title and an icon (the couple writes the text). */
const BLOCK_IDEAS: Array<{ title: string; icon: DetailsBlockIcon }> = [
  { title: 'Dress code', icon: 'dress' },
  { title: 'Children', icon: 'kids' },
  { title: 'Gifts', icon: 'gift' },
  { title: 'Parking', icon: 'car' },
  { title: 'Weather', icon: 'weather' },
  { title: 'Photos', icon: 'camera' },
];

export function DetailsBlocksFields() {
  const { content, edit, issuesAt, locked } = usePanelContext();
  const items = content.details_blocks ?? [];
  const add = (b: DetailsBlock = { title: '' }) => edit((c) => void (c.details_blocks = [...(c.details_blocks ?? []), b]));
  const set = (i: number, patch: Partial<DetailsBlock>) => edit((c) => void (c.details_blocks![i] = { ...c.details_blocks![i], ...patch }));
  const room = items.length < L.detailsBlocks;
  return (
    <>
      <p className={styles.hint}>
        Short blocks on your Details page, such as dress code, children, gifts, parking or the weather. None, a few or up to {L.detailsBlocks}.
      </p>
      {room ? (
        <div className={styles.chips} role="group" aria-label="Add a block about">
          {BLOCK_IDEAS.map((idea) => (
            <button key={idea.title} type="button" className={styles.chip} disabled={locked} onClick={() => add({ title: idea.title, icon: idea.icon })} data-add-block-idea={idea.icon}>
              + {idea.title}
            </button>
          ))}
        </div>
      ) : null}
      {!items.length ? (
        <EmptyState icon={Plus} action={<Button variant="primary" icon={Plus} disabled={locked} onClick={() => add()} data-add-block>Add a block</Button>}>
          Nothing here yet: guests see no extra blocks.
        </EmptyState>
      ) : null}
      {items.map((b, i) => (
        <RepeatableItem<DetailsBlock>
          key={i}
          index={i}
          count={items.length}
          noun="block"
          title={`Block ${i + 1}`}
          select={(c) => c.details_blocks ?? []}
          assign={(c, list) => void (c.details_blocks = list)}
          data-block-row={i}
        >
          <TextField path={`details_blocks.${i}.title`} label="Title" maxLength={L.blockTitle} placeholder="Children" value={b.title} onChange={(v) => set(i, { title: v })} />
          <TextField
            path={`details_blocks.${i}.text`}
            label="Text"
            optional
            multiline
            rows={3}
            maxLength={L.blockText}
            placeholder="We love your little ones, but our celebration is adults only."
            value={b.text}
            onChange={(v) => set(i, { text: nullIfEmpty(v) })}
          />
          <SelectField
            path={`details_blocks.${i}.icon`}
            label="Icon"
            optional
            value={b.icon ?? ''}
            options={ICON_OPTIONS}
            onChange={(v) => set(i, { icon: (v || null) as DetailsBlockIcon | null })}
          />
          <UrlField path={`details_blocks.${i}.link`} label="Link" optional value={b.link} onChange={(v) => set(i, { link: v })} />
          {b.link ? (
            <TextField
              path={`details_blocks.${i}.link_label`}
              label="Link text"
              optional
              maxLength={L.blockLinkLabel}
              placeholder="Learn more"
              value={b.link_label}
              onChange={(v) => set(i, { link_label: nullIfEmpty(v) })}
            />
          ) : null}
        </RepeatableItem>
      ))}
      <IssueList issues={issuesAt('details_blocks')} />
      {items.length && room ? (
        <Button variant="secondary" icon={Plus} disabled={locked} data-add-block onClick={() => add()}>
          Add a block
        </Button>
      ) : items.length ? (
        <p className={styles.hint}>This section holds {L.detailsBlocks} blocks at most.</p>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Travel & stay

type TransportKey = 'airport' | 'parking' | 'shuttle' | 'taxi';
const TRANSPORT: Array<{ key: TransportKey; label: string; placeholder: string }> = [
  { key: 'airport', label: 'Airport & station', placeholder: 'Fly into Florence (FLR), 40 minutes by car.' },
  { key: 'parking', label: 'Parking', placeholder: 'Free parking next to the venue.' },
  { key: 'shuttle', label: 'Shuttle', placeholder: 'A shuttle leaves the hotel at 3:15 PM.' },
  { key: 'taxi', label: 'Taxi & rideshare', placeholder: 'Please book a ride home in advance.' },
];

function setTransport(c: ContentRecord, key: TransportKey, patch: Partial<TravelNote>) {
  const next = { ...(c.travel?.[key] ?? {}), ...patch };
  c.travel = { ...(c.travel ?? {}), [key]: next.text || next.link ? next : null };
}

export function TravelFields({ showSwitch }: { showSwitch: boolean }) {
  const { content, edit, issuesAt, locked } = usePanelContext();
  const stays = content.travel?.stays ?? [];
  const addStay = () => edit((c) => void (c.travel = { ...(c.travel ?? {}), stays: [...(c.travel?.stays ?? []), { name: '' }] }));
  const setStay = (i: number, patch: Partial<TravelStay>) => edit((c) => void (c.travel!.stays![i] = { ...c.travel!.stays![i], ...patch }));
  return (
    <>
      {showSwitch ? <BlockSwitch block="travel_stay" label="Show travel & stay" hint="Guests see it on the Details page. Empty parts are not shown." /> : null}
      <UrlField
        path="urls.accommodation"
        label="Travel & stay link"
        optional
        hint="A hotel block or accommodation page for guests."
        value={content.urls?.accommodation}
        onChange={(v) => edit((c) => void (c.urls = { ...(c.urls ?? {}), accommodation: v }))}
      />
      <Group title="Getting here">
        {TRANSPORT.map((t) => {
          const note = content.travel?.[t.key];
          return (
            <div key={t.key} className={styles.fieldPair} data-transport={t.key}>
              <TextField
                path={`travel.${t.key}.text`}
                label={t.label}
                optional
                multiline
                rows={2}
                maxLength={L.travelText}
                placeholder={t.placeholder}
                value={note?.text}
                onChange={(v) => edit((c) => setTransport(c, t.key, { text: nullIfEmpty(v) }))}
              />
              <UrlField path={`travel.${t.key}.link`} label={`${t.label}: link`} optional value={note?.link} onChange={(v) => edit((c) => setTransport(c, t.key, { link: v }))} />
            </div>
          );
        })}
      </Group>
      <Group title="Places to stay">
        <p className={styles.hint}>Hotels or rentals near the venue, up to {L.travelStays}. A booking code or room block name helps guests get your rate.</p>
        {stays.map((s, i) => (
          <RepeatableItem<TravelStay>
            key={i}
            index={i}
            count={stays.length}
            noun="place to stay"
            title={`Place to stay ${i + 1}`}
            select={(c) => c.travel?.stays ?? []}
            assign={(c, list) => void (c.travel = { ...(c.travel ?? {}), stays: list })}
            data-stay-row={i}
          >
            <TextField path={`travel.stays.${i}.name`} label="Name" maxLength={L.stayName} placeholder="Hotel Villa Rosa" value={s.name} onChange={(v) => setStay(i, { name: v })} />
            <TextField path={`travel.stays.${i}.distance`} label="Distance" optional maxLength={L.stayDistance} placeholder="10 min drive" value={s.distance} onChange={(v) => setStay(i, { distance: nullIfEmpty(v) })} />
            <TextField path={`travel.stays.${i}.address`} label="Address" optional maxLength={L.stayAddress} value={s.address} onChange={(v) => setStay(i, { address: nullIfEmpty(v) })} />
            <UrlField path={`travel.stays.${i}.link`} label="Booking link" optional value={s.link} onChange={(v) => setStay(i, { link: v })} />
            <TextField path={`travel.stays.${i}.code`} label="Booking code or room block" optional maxLength={L.stayCode} placeholder="SMITHWEDDING" value={s.code} onChange={(v) => setStay(i, { code: nullIfEmpty(v) })} />
            <TextField path={`travel.stays.${i}.note`} label="Note" optional multiline rows={2} maxLength={L.stayNote} placeholder="Book by May 1 for the group rate." value={s.note} onChange={(v) => setStay(i, { note: nullIfEmpty(v) })} />
          </RepeatableItem>
        ))}
        {stays.length < L.travelStays ? (
          <Button variant="secondary" icon={Plus} disabled={locked} data-add-stay onClick={addStay}>
            Add a place to stay
          </Button>
        ) : (
          <p className={styles.hint}>This section holds {L.travelStays} places at most.</p>
        )}
      </Group>
      <IssueList issues={[...issuesAt('travel'), ...issuesAt('travel.stays')]} />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Meal & menu

type Served = 'unset' | 'yes' | 'no';
const STARTER_MENU: MealCourse[] = [
  { title: 'Starter', items: [] },
  { title: 'Main', items: [] },
  { title: 'Dessert', items: [] },
];

export function MealFields() {
  const { content, edit, issuesAt, locked } = usePanelContext();
  const snack = useSnackbar();
  const meal = content.meal ?? {};
  const served: Served = meal.served === true ? 'yes' : meal.served === false ? 'no' : 'unset';
  const courses = meal.courses ?? [];
  const setServed = (v: Served) => edit((c) => void (c.meal = { ...(c.meal ?? {}), served: v === 'yes' ? true : v === 'no' ? false : null }));
  const setCourses = (c: ContentRecord, list: MealCourse[]) => void (c.meal = { ...(c.meal ?? {}), courses: list });
  const setTitle = (i: number, title: string) => edit((c) => void (c.meal!.courses![i] = { ...c.meal!.courses![i], title }));
  const setDish = (i: number, j: number, v: string) =>
    edit((c) => {
      const items = [...c.meal!.courses![i].items];
      items[j] = v;
      c.meal!.courses![i] = { ...c.meal!.courses![i], items };
    });
  const addDish = (i: number) => edit((c) => void (c.meal!.courses![i] = { ...c.meal!.courses![i], items: [...c.meal!.courses![i].items, ''] }));
  const removeDish = (i: number, j: number) =>
    edit((c) => void (c.meal!.courses![i] = { ...c.meal!.courses![i], items: c.meal!.courses![i].items.filter((_, k) => k !== j) }));
  const question = mealQuestionState(content);
  const asked = existingMealQuestion(content);
  return (
    <>
      <Segmented<Served>
        id="meal-served"
        label="Is a meal served?"
        value={served}
        disabled={locked}
        options={[
          { value: 'unset', label: 'Not shown' },
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        onChange={setServed}
      />
      <p className={styles.hint}>
        {served === 'yes'
          ? 'Guests see a menu card on the Details page. Without a menu it says a meal will be served.'
          : 'Nothing about the meal is shown to guests.'}
      </p>
      {served === 'yes' ? (
        <>
          {!courses.length ? (
            <EmptyState
              icon={Plus}
              action={
                <Button variant="primary" icon={Plus} disabled={locked} data-start-menu onClick={() => edit((c) => setCourses(c, structuredClone(STARTER_MENU)))}>
                  Start a menu
                </Button>
              }
            >
              Add your menu if you like: headings such as Starter, Main and Dessert, with the dishes under each.
            </EmptyState>
          ) : null}
          {courses.map((course, i) => (
            <RepeatableItem<MealCourse>
              key={i}
              index={i}
              count={courses.length}
              noun="menu heading"
              title={`Menu heading ${i + 1}`}
              select={(c) => c.meal?.courses ?? []}
              assign={setCourses}
              data-course-row={i}
            >
              <TextField path={`meal.courses.${i}.title`} label="Heading" maxLength={L.courseTitle} placeholder="Main" value={course.title} onChange={(v) => setTitle(i, v)} />
              {course.items.map((dish, j) => (
                <div key={j} className={styles.inlineRow} data-dish={`${i}.${j}`}>
                  <TextField path={`meal.courses.${i}.items.${j}`} label={`Dish ${j + 1}`} maxLength={L.courseItem} value={dish} onChange={(v) => setDish(i, j, v)} />
                  <Button variant="tertiary" small icon={X} disabled={locked} aria-label={`Remove dish ${j + 1} of ${course.title || `heading ${i + 1}`}`} onClick={() => removeDish(i, j)} />
                </div>
              ))}
              {course.items.length < L.courseItems ? (
                <Button variant="tertiary" small icon={Plus} disabled={locked} data-add-dish={i} onClick={() => addDish(i)}>
                  Add a dish
                </Button>
              ) : null}
            </RepeatableItem>
          ))}
          {courses.length && courses.length < L.mealCourses ? (
            <Button variant="secondary" icon={Plus} disabled={locked} data-add-course onClick={() => edit((c) => setCourses(c, [...(c.meal?.courses ?? []), { title: '', items: [] }]))}>
              Add a menu heading
            </Button>
          ) : null}
          <TextField
            path="meal.note"
            label="Dietary note"
            optional
            multiline
            rows={2}
            maxLength={L.mealNote}
            placeholder="Vegetarian and gluten-free options on request."
            value={meal.note}
            onChange={(v) => edit((c) => void (c.meal = { ...(c.meal ?? {}), note: nullIfEmpty(v) }))}
          />
          <Group title="RSVP">
            {question === 'exists' ? (
              <p className={styles.hint} data-meal-question="exists">
                Your reply form already asks “{asked?.label}”. Change it under RSVP.
              </p>
            ) : question === 'full' ? (
              <p className={styles.hint}>Your reply form holds {L.rsvpQuestions} questions already.</p>
            ) : (
              <>
                <p className={styles.hint}>Let guests choose their meal when they reply: {mealChoices(content).join(', ')}. You can change the choices under RSVP.</p>
                <Button
                  variant="secondary"
                  icon={Plus}
                  disabled={locked}
                  data-add-meal-question
                  onClick={() => {
                    edit((c) => void addMealQuestion(c));
                    snack('Meal choice added to your RSVP form');
                  }}
                >
                  Add a meal choice question to RSVP
                </Button>
              </>
            )}
          </Group>
        </>
      ) : null}
      <IssueList issues={[...issuesAt('meal'), ...issuesAt('meal.courses')]} />
    </>
  );
}
