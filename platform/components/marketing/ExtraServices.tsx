// K42 (G130): the two paid extras on /pricing — "We set it up for you" and custom design (docs/23_EK_HIZMETLER.md).
// Each is its own Etsy listing (lib/marketing/config.ts `services`). Until a listing is live the card says
// "Coming soon on Etsy" (EtsyButton); a price shows only when it is real (no placeholder text reaches the page).
import { MARKETING, type ServiceCommerce } from '../../lib/marketing/config.ts';
import { realPrice } from '../../lib/marketing/placeholders.ts';
import { displayPrice } from '../../lib/marketing/site.ts';
import x from './extra-services.module.css';
import s from './marketing.module.css';
import { Container, EtsyButton, Section } from './ui.tsx';

const COPY: Record<ServiceCommerce['id'], { title: string; text: string[] }> = {
  'setup-service': {
    title: 'Prefer us to do it?',
    text: [
      'Send us your names, date, wording, photos and RSVP settings in an Etsy message, and we enter them in your editor for you. One round of setup, as its own Etsy listing next to your design.',
      'You can still change everything yourself afterwards. Another round by us is a new purchase.',
    ],
  },
  'custom-design': {
    title: 'Custom design',
    text: [
      'A new design made for you on our platform: your own look, opening and colors, with the same editor, RSVP and pages as every design.',
      'The price includes the design itself, 2 rounds of changes and a first version within 3 days. Your design is never sold to anyone else.',
    ],
  },
};

function ServicePrice({ service }: { service: ServiceCommerce }) {
  const price = realPrice(service.price);
  if (!price) return null;
  return (
    <p className={x.price}>
      {displayPrice(price)}
      <span className={x.note}> one-time, on Etsy</span>
    </p>
  );
}

export function ExtraServices({ services = MARKETING.services }: { services?: ServiceCommerce[] }) {
  if (!services.length) return null;
  return (
    <Section labelledBy="extras-title">
      <Container>
        <h2 id="extras-title" className={s.h2}>
          Extras
        </h2>
        <div className={x.grid}>
          {services.map((sv) => (
            <article key={sv.id} className={x.card} data-service={sv.id}>
              <h3 className={s.h3}>{COPY[sv.id].title}</h3>
              {COPY[sv.id].text.map((t) => (
                <p key={t} className={x.text}>
                  {t}
                </p>
              ))}
              <ServicePrice service={sv} />
              <EtsyButton design={sv} placement="pricing-extras" variant="secondary" />
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
