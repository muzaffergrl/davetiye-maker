// 404 inside a language of the marketing site (unknown design or guide). Not-found pages get no params: the words come
// from the language layout (NotFoundCopyProvider in MarketShell); English is only the fallback.
import { NotFoundFromContext } from '../../../../components/marketing/NotFound.tsx';
import { notFoundCopy } from '../../../../components/marketing/not-found-copy.ts';

export default function LanguageNotFound() {
  return <NotFoundFromContext fallback={notFoundCopy()} />;
}
