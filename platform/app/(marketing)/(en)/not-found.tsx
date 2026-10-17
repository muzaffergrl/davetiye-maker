// 404 inside the English marketing site (unknown design or guide).
import { NotFoundView } from '../../../components/marketing/NotFound.tsx';
import { notFoundCopy } from '../../../components/marketing/not-found-copy.ts';

export default function MarketingNotFound() {
  return <NotFoundView copy={notFoundCopy()} />;
}
