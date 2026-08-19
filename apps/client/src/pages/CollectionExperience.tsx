import { PinnedHero } from '../components/collection/PinnedHero';
import { ManifestoBand } from '../components/collection/ManifestoBand';
import { HorizontalLookbook } from '../components/collection/HorizontalLookbook';
import { CollectionIndex } from '../components/collection/CollectionIndex';
import { CuratedProducts } from '../components/collection/CuratedProducts';
import { ProcessSteps } from '../components/collection/ProcessSteps';
import { ClosingCta } from '../components/collection/ClosingCta';

/**
 * SS / 2026 — The Ivory Series
 *
 * A cinematic collection experience page: pinned hero, horizontal lookbook,
 * curated product grid, and editorial process storytelling. Uses the existing
 * Atelier Noir ivory world without introducing new tokens or dependencies.
 */
export default function CollectionExperience() {
  return (
    <main className="atelier-bg text-ink antialiased overflow-x-hidden">
      <PinnedHero />
      <ManifestoBand />
      <HorizontalLookbook />
      <CollectionIndex />
      <CuratedProducts />
      <ProcessSteps />
      <ClosingCta />
    </main>
  );
}
