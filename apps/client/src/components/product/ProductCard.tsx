import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice, calcDiscount } from '../../lib/utils';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useCartStore } from '../../stores/cartStore';
import { useReducedMotion } from 'framer-motion';

import { toast } from 'sonner';
import { Image } from '../ui/Image';

interface ProductCardProps {
  product: Product;
  showDetails?: boolean;
  imagePriority?: boolean;
}

/** Spring-powered wishlist heart — pops with a bounce on toggle. */
function WishlistButton({
  wishlisted,
  onToggle,
  productName,
}: {
  wishlisted: boolean;
  onToggle: () => void;
  productName: string;
}) {
  const reducedMotion = useReducedMotion();
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);

  // Springs are declared at the top level (rules of hooks) and drive
  // scale/rotate through style. Inside the click handler we only call
  // .set() — the springs automatically settle back to rest.
  const springScale = useSpring(scale, { stiffness: 300, damping: 15, mass: 0.5 });
  const springRotate = useSpring(rotate, { stiffness: 300, damping: 15, mass: 0.5 });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
    if (!reducedMotion) {
      springScale.jump(1.4);
      springRotate.jump(wishlisted ? -15 : 15);
      scale.set(1);
      rotate.set(0);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      style={{ scale: springScale, rotate: springRotate }}
      className="absolute top-3 right-3 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[rgba(var(--ivory-rgb),0.85)] border border-hairline flex items-center justify-center text-ink-mute hover:text-sienna hover:border-[rgba(var(--sienna-rgb),0.5)] backdrop-blur-sm focus-visible:outline-offset-2 transition-colors"
      aria-label={wishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      aria-pressed={wishlisted}
    >
      <Heart
        className={`w-3.5 h-3.5 ${
          wishlisted ? 'fill-sienna text-sienna' : ''
        }`}
      />
    </motion.button>
  );
}

/** Magnetic quick-add button — follows cursor subtly. */
function QuickAddButton({
  onClick,
  productName,
}: {
  onClick: (e: React.MouseEvent) => void;
  productName: string;
}) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 25, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 250, damping: 25, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!e.currentTarget || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(((e.clientX - centerX) / rect.width) * 10);
    y.set(((e.clientY - centerY) / rect.height) * 10);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onClick={onClick}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="atelier-btn w-full !py-2.5 !min-h-[48px]"
      aria-label={`Quick add ${productName} to cart`}
    >
      <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
    </motion.button>
  );
}

export function ProductCard({ product, showDetails = true, imagePriority = false }: ProductCardProps) {

  const { toggleItem, isWishlisted } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const discount = product.comparePrice
    ? calcDiscount(product.price, product.comparePrice)
    : 0;

  const allSizesOutOfStock = product.sizes.length > 0 && product.sizes.every((s) => s.stock <= 0);
  const wishlisted = isWishlisted(product._id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (allSizesOutOfStock) {
      toast.error(`${product.name} is currently sold out`);
      return;
    }
    const color = product.colorways?.[0] || { name: 'Default', hex: '#181410', images: [] };
    const size = product.sizes?.find((s) => s.stock > 0)?.label || product.sizes?.[0]?.label || 'M';
    addItem(product, color, size);
    toast.success(`Added ${product.name} to cart`);
    openCart();
  };

  // Magnetic card hover — subtle lift toward cursor.
  const reducedMotion = useReducedMotion();
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardSpringX = useSpring(cardX, { stiffness: 220, damping: 25, mass: 0.8 });
  const cardSpringY = useSpring(cardY, { stiffness: 220, damping: 25, mass: 0.8 });
  const cardRotate = useMotionValue(0);
  const cardSpringRotate = useSpring(cardRotate, { stiffness: 200, damping: 22, mass: 0.6 });

  const handleCardPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!e.currentTarget || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    cardX.set(((e.clientX - centerX) / rect.width) * 6);
    cardY.set(((e.clientY - centerY) / rect.height) * 6);
    // Subtle rotation based on cursor position.
    cardRotate.set(((e.clientX - centerX) / rect.width) * 1.5);
  };

  const handleCardPointerLeave = () => {
    cardX.set(0);
    cardY.set(0);
    cardRotate.set(0);
  };

  return (
    <motion.article
      className="group relative"
      style={{
        x: cardSpringX,
        y: cardSpringY,
        rotateZ: cardSpringRotate,
      }}
      onPointerMove={handleCardPointerMove}
      onPointerLeave={handleCardPointerLeave}
    >
      {/* Image area = the card's primary link. Wishlist + quick-add are layered
          siblings (not nested in the anchor) so the a11y tree stays valid and
          keyboard users can reach quick-add via focus-within. */}
      <Link
        to={`/products/${product.slug}`}
        className="block relative aspect-[3/4] atelier-frame atelier-frame-hover focus-visible:outline-offset-4"
        aria-label={`${product.name} by ${product.brand}`}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            loading={imagePriority ? 'eager' : 'lazy'}
            fetchPriority={imagePriority ? 'high' : 'auto'}
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--bone)]">
            <span className="font-display text-4xl text-ink-mute/30">V</span>
          </div>
        )}

        {allSizesOutOfStock && (
          <div className="absolute inset-0 z-10 bg-[rgba(var(--ivory-rgb),0.7)] backdrop-blur-[2px] flex items-center justify-center">
            <span className="atelier-eyebrow text-ink text-[10px] border border-[rgba(var(--ink-rgb),0.4)] px-4 py-2">
              Sold Out
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="bg-sienna text-ivory font-mono text-[10px] font-bold px-2 py-0.5 tracking-widest">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-ink text-ivory font-mono text-[10px] font-bold px-2 py-0.5 tracking-widest uppercase">
              NEW
            </span>
          )}
        </div>
      </Link>

      {/* Wishlist — spring-powered heart with bounce. */}
      <WishlistButton
        wishlisted={wishlisted}
        onToggle={() => toggleItem(product._id)}
        productName={product.name}
      />

      {/* Quick Add — magnetic button, revealed on hover AND focus-within. */}
      {!allSizesOutOfStock && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-[opacity,transform] duration-200 ease-out transform translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:translate-y-0">
          <QuickAddButton
            onClick={handleQuickAdd}
            productName={product.name}
          />
        </div>
      )}

      {showDetails && (
        <div className="mt-3.5 space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-display text-ink text-base group-hover:text-sienna transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </div>
          {product.brand && (
            <p className="atelier-eyebrow text-ink-mute">{product.brand}</p>
          )}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-0.5">
            <span className="text-sienna font-display text-lg font-semibold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-ink-mute line-through text-sm">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.article>
  );
}
