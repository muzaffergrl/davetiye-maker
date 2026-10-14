// 404 inside the marketing site (unknown design or guide).
import s from '../../components/marketing/marketing.module.css';
import { Container, Section, TextLink } from '../../components/marketing/ui.tsx';

export default function MarketingNotFound() {
  return (
    <Section className={s.pageHead}>
      <Container narrow>
        <h1 className={s.h1}>This page could not be found</h1>
        <p className={s.lead}>The link may be old, or the page has moved. These pages will help you find your way.</p>
        <ul className={s.linkList}>
          <li>
            <a href="/designs">Wedding website designs</a>
          </li>
          <li>
            <a href="/how-it-works">How it works</a>
          </li>
          <li>
            <a href="/faq">Frequently asked questions</a>
          </li>
        </ul>
        <TextLink href="/">Back to the home page</TextLink>
      </Container>
    </Section>
  );
}
