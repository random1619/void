import { motion, useReducedMotion } from 'framer-motion';
import { headlineContainer, headlineWord, trackingWord } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface AnimatedHeadingProps {
  /** Visible text. Words wrapped in `_underscores_` render as italic emphasis. */
  text: string;
  /** ID for aria-labelledby sections. */
  id?: string;
  className?: string;
  level?: 1 | 2 | 3;
  /** `mask` = word-by-word rise (hero + featured). `tracking` = letters
      breathe open from tight tracking (section headlines). */
  variant?: 'mask' | 'tracking';
}

/**
 * AnimatedHeading — editorial heading reveal in two flavors.
 *
 * `mask`: words rise out of an overflow-hidden mask, staggered 70ms apart
 *   (the hero headline's motion language).
 * `tracking`: words fade up while letter-spacing expands from tight to
 *   natural — the "headline breathes open" luxury move.
 *
 * Words wrapped in underscores (`_word_`) render italic sienna. Reduced
 * motion renders the heading statically. Descenders are protected by a
 * `pb-[0.09em]` reserve on every mask.
 */
export function AnimatedHeading({
  text,
  id,
  className,
  level = 2,
  variant = 'mask',
}: AnimatedHeadingProps) {
  const reducedMotion = useReducedMotion();

  // Parse words with single or multi-word underscore support e.g. "Four Houses, _One Aesthetic_"
  const tokens: { text: string; em: boolean }[] = [];
  const regex = /_([^_]+)_|([^\s_]+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      const emWords = match[1].split(/\s+/).filter(Boolean);
      emWords.forEach((w) => tokens.push({ text: w, em: true }));
    } else if (match[2]) {
      tokens.push({ text: match[2], em: false });
    }
  }

  const Tag = (level === 1 ? 'h1' : level === 3 ? 'h3' : 'h2') as 'h1' | 'h2' | 'h3';

  if (reducedMotion) {
    return (
      <Tag id={id} className={className}>
        {tokens.map((token, i) => (
          <span key={i} className={token.em ? 'italic text-sienna font-normal' : undefined}>
            {token.text}
            {i < tokens.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={cn('inline-block', className)}>
      <motion.span
        variants={headlineContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="inline-block"
      >
        {tokens.map((token, i) => {
          const WordVariant = variant === 'tracking' ? trackingWord : headlineWord;

          return (
            <span
              key={i}
              className={cn(
                'inline-block',
                variant === 'mask' && 'overflow-hidden align-bottom pb-[0.09em] -mb-[0.09em]'
              )}
            >
              <motion.span
                variants={WordVariant}
                className={cn(
                  'inline-block',
                  token.em && 'italic text-sienna font-normal'
                )}
              >
                {token.text}
              </motion.span>
              {i < tokens.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}


