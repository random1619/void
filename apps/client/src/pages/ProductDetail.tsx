import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, animate, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';
import { formatPrice, calcDiscount, formatDate } from '../lib/utils';
import { StarRating } from '../components/ui/StarRating';
import { PageLoader } from '../components/ui/LoadingSkeleton';
import { fadeUpVariants, staggerContainer } from '../lib/animations';
import { useMagnetic } from '../hooks/useMagnetic';
import { useSpringPress } from '../hooks/useSpringPress';
import api from '../lib/api';
import { toast } from 'sonner';
import { Image } from '../components/ui/Image';
import { ImageZoom } from '../components/ui/ImageZoom';
import { ProductImageCarousel } from '../components/product/ProductImageCarousel';
import { Tooltip } from '../components/ui/Tooltip';

/**
 * Parallax product image — the image shifts opposite to cursor movement
 * for a subtle 3D depth effect. Images are oversized (108%) to give the
 * parallax room to move without exposing edges.
 */
function ParallaxProductImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 300, damping: 30, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 300, damping: 30, mass: 0.6 });

  const handlePointer = (e: React.PointerEvent) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx.set(((e.clientX - cx) / rect.width) * -16);
    my.set(((e.clientY - cy) / rect.height) * -16);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="aspect-[3/4] atelier-frame overflow-hidden relative group"
      onPointerMove={handlePointer}
      onPointerLeave={reset}
    >
      <motion.img
        src={src}
        alt={alt}
        fetchPriority={priority ? 'high' : 'low'}
        decoding="async"
        className="w-[108%] h-[108%] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          x: reducedMotion ? 0 : springX,
          y: reducedMotion ? 0 : springY,
          left: '-4%',
          top: '-4%',
          position: 'absolute',
        }}
      />
    </div>
  );
}

/**
 * Magnetic colorway swatch — pulls toward cursor and springs on press.
 */
function MagneticColorSwatch({
  cw,
  selected,
  onSelect,
}: {
  cw: { name: string; hex: string };
  selected: boolean;
  onSelect: () => void;
}) {
  const magnetic = useMagnetic({ range: 8, stiffness: 300, damping: 25, mass: 0.4 });
  const press = useSpringPress({ scale: 0.9, stiffness: 500, damping: 20, mass: 0.3 });

  return (
    <Tooltip content={cw.name} side="top" sideOffset={6}>
      <motion.button
        ref={magnetic.ref as React.Ref<HTMLButtonElement>}
        onClick={onSelect}
        onPointerMove={magnetic.onPointerMove}
        onPointerLeave={magnetic.onPointerLeave}
        onPointerDown={press.onPointerDown}
        onPointerUp={press.onPointerUp}
        onPointerCancel={press.onPointerCancel}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-offset-4"
        aria-label={`${cw.name}${selected ? ', selected' : ''}`}
        aria-pressed={selected}
        style={{ ...magnetic.style, ...press.style }}
      >
        <motion.span
          className={`block w-8 h-8 rounded-full border-2 shadow-sm ${
            selected ? 'border-sienna ring-2 ring-sienna/30' : 'border-black/20 dark:border-white/20'
          }`}
          style={{ backgroundColor: cw.hex }}
          animate={selected ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      </motion.button>
    </Tooltip>
  );
}

/**
 * Magnetic size button with spring press feedback and stock tooltip.
 */
function MagneticSizeButton({
  size,
  selected,
  outOfStock,
  onSelect,
}: {
  size: { label: string; stock: number };
  selected: boolean;
  outOfStock: boolean;
  onSelect: () => void;
}) {
  const magnetic = useMagnetic({ range: 4, stiffness: 400, damping: 30, mass: 0.5 });
  const press = useSpringPress({ scale: 0.93, stiffness: 400, damping: 20, mass: 0.5 });

  const tooltipLabel = outOfStock
    ? `Size ${size.label} · Sold Out`
    : `Size ${size.label} · ${size.stock} in atelier`;

  return (
    <Tooltip content={tooltipLabel} side="top" sideOffset={6}>
      <motion.button
        ref={magnetic.ref as React.Ref<HTMLButtonElement>}
        onClick={onSelect}
        onPointerMove={magnetic.onPointerMove}
        onPointerLeave={magnetic.onPointerLeave}
        onPointerDown={press.onPointerDown}
        onPointerUp={press.onPointerUp}
        onPointerCancel={press.onPointerCancel}
        disabled={outOfStock}
        className={`w-12 h-12 border text-sm focus-visible:outline-offset-4 transition-colors duration-200 ${
          selected
            ? 'border-[var(--sienna)] bg-sienna text-ivory shadow-[0_4px_14px_-4px_rgba(163,72,36,0.5)]'
            : outOfStock
            ? 'border-hairline text-ink-mute/80 cursor-not-allowed bg-[var(--bone)]/50'
            : 'border-hairline text-ink-mute hover:border-[var(--sienna)] hover:text-ink hover:bg-[var(--bone)]/60'
        }`}
        aria-pressed={selected}
        aria-label={`Size ${size.label}${outOfStock ? ', out of stock' : ''}`}
        aria-disabled={outOfStock}
        style={{ ...magnetic.style, ...press.style }}
      >
        {size.label}
      </motion.button>
    </Tooltip>
  );
}

/**
 * Magnetic wishlist button with spring bounce on toggle.
 */
function MagneticWishlistButton({
  wishlisted,
  onToggle,
}: {
  wishlisted: boolean;
  onToggle: () => void;
}) {
  const magnetic = useMagnetic({ range: 6, stiffness: 300, damping: 25, mass: 0.4 });
  const press = useSpringPress({ scale: 0.9, stiffness: 500, damping: 20, mass: 0.3 });

  return (
    <Tooltip
      content={wishlisted ? 'Remove from Saved Pieces' : 'Save to Atelier Wishlist'}
      side="top"
      sideOffset={6}
    >
      <motion.button
        ref={magnetic.ref as React.Ref<HTMLButtonElement>}
        onClick={onToggle}
        onPointerMove={magnetic.onPointerMove}
        onPointerLeave={magnetic.onPointerLeave}
        onPointerDown={press.onPointerDown}
        onPointerUp={press.onPointerUp}
        onPointerCancel={press.onPointerCancel}
        className={`p-4 border transition-colors focus-visible:outline-offset-2 ${
          wishlisted ? 'border-[var(--sienna)] text-sienna' : 'border-hairline text-ink-mute hover:text-ink hover:border-[var(--sienna)]'
        }`}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wishlisted}
        style={{ ...magnetic.style, ...press.style }}
      >
        <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
      </motion.button>
    </Tooltip>
  );
}

/**
 * Magnetic quantity stepper button.
 */
function MagneticQtyButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const magnetic = useMagnetic({ range: 3, stiffness: 400, damping: 30, mass: 0.5 });
  const press = useSpringPress({ scale: 0.92, stiffness: 400, damping: 20, mass: 0.5 });

  return (
    <Tooltip content={label} side="top" sideOffset={6}>
      <motion.button
        ref={magnetic.ref as React.Ref<HTMLButtonElement>}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        onPointerMove={magnetic.onPointerMove}
        onPointerLeave={magnetic.onPointerLeave}
        onPointerDown={press.onPointerDown}
        onPointerUp={press.onPointerUp}
        onPointerCancel={press.onPointerCancel}
        className="pressable px-3 py-3 text-ink-mute hover:text-ink hover:bg-[var(--bone)] transition-colors focus-visible:outline-offset-0 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ ...magnetic.style, ...press.style }}
      >
        {children}
      </motion.button>
    </Tooltip>
  );
}

/**
 * Subtle ambient breathing orb for the product page background.
 */
function ProductAmbient() {
  const reducedMotion = useReducedMotion();
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const cycle1 = animate(orb1Ref.current, { opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }, { duration: 14, repeat: Infinity, ease: 'easeInOut' });
    const cycle2 = animate(orb2Ref.current, { opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }, { duration: 18, repeat: Infinity, ease: 'easeInOut' });
    return () => { cycle1.stop(); cycle2.stop(); };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <div ref={orb1Ref} className="fixed top-20 left-10 w-64 h-64 bg-[rgba(var(--sienna-rgb),0.06)] rounded-full blur-[100px] pointer-events-none z-0" />
      <div ref={orb2Ref} className="fixed bottom-40 right-10 w-80 h-80 bg-[rgba(var(--ink-rgb),0.04)] rounded-full blur-[120px] pointer-events-none z-0" />
    </>
  );
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { setCursorVariant } = useUIStore();

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');

  const { data: reviews } = useQuery({
    queryKey: ['reviews', product?._id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${product?._id}/reviews?limit=10`);
      return data.data;
    },
    enabled: !!product?._id,
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewPayload: { rating: number; title: string; body: string }) => {
      const { data } = await api.post(`/products/${product?._id}/reviews`, reviewPayload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', product?._id] });
      queryClient.invalidateQueries({ queryKey: ['product', slug] });
      toast.success('Review submitted successfully!');
      setReviewTitle('');
      setReviewBody('');
      setRating(5);
    },
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewBody.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    submitReviewMutation.mutate({
      rating,
      title: reviewTitle,
      body: reviewBody,
    });
  };

  useEffect(() => {
    if (!product) return;
    const currentColor = product.colorways[selectedColor];
    const colorImages = currentColor?.images?.length ? currentColor.images : product.images.map((img) => img.url);
    if (colorImages.length <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveImage((prev) => (prev === 0 ? colorImages.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImage((prev) => (prev === colorImages.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, selectedColor]);

  if (isLoading) return <PageLoader />;
  if (!product) {
    return (
      <div className="atelier-bg text-ink min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 gap-6">
        <div>
          <p className="font-display text-3xl text-ink mb-2">Product not found</p>
          <p className="text-ink-mute text-sm">This piece may have been retired or the link is incorrect.</p>
        </div>
        <Link
          to="/products"
          className="atelier-btn inline-flex items-center gap-2"
        >
          Browse All Pieces
        </Link>
      </div>
    );
  }

  const discount = product.comparePrice ? calcDiscount(product.price, product.comparePrice) : 0;
  const currentColor = product.colorways[selectedColor];
  const colorImages = currentColor?.images?.length ? currentColor.images : product.images.map((img) => img.url);

  const selectedSizeObj = product.sizes.find((s) => s.label === selectedSize);
  // Default to in-stock until a size is actually chosen; before that we don't
  // want "Out of Stock" to gate the button and mislead the shopper — the label
  // should fall through to "Select a Size", not "Out of Stock".
  const inStock = selectedSizeObj ? selectedSizeObj.stock > 0 : true;
  const maxStock = selectedSizeObj?.stock ?? 99;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      setSizeError(true);
      toast.error('Please select a size before adding to cart');
      return;
    }
    setSizeError(false);
    addItem(product, currentColor, selectedSize || product.sizes[0]?.label || 'M', quantity);
    toast.success(`${product.name} added to cart`);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="atelier-bg text-ink min-h-[100dvh] pt-36 relative"
    >
      <ProductAmbient />
      <div className="container-void relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="flex items-center gap-2 text-sm text-ink-mute mb-8"
        >
          <Link to="/home" className="hover:text-sienna transition-colors duration-200">Home</Link>
          <ChevronRight className="w-3 h-3 text-ink-mute/40" />
          <Link to="/products" className="hover:text-sienna transition-colors duration-200">Collections</Link>
          <ChevronRight className="w-3 h-3 text-ink-mute/40" />
          <span className="text-ink font-medium">{product.name}</span>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
        >
          {/* Image Gallery — Desktop Sticky with Zoom Lightbox, Mobile with Embla Touch Carousel */}
          <motion.div variants={fadeUpVariants} className="space-y-4 lg:sticky lg:top-32 lg:self-start">
            {/* Mobile Touch Carousel (Embla) */}
            <div className="lg:hidden">
              <ProductImageCarousel
                images={colorImages}
                alt={product.name}
                onSlideClick={(index) => setActiveImage(index)}
              />
            </div>

            {/* Desktop Parallax + Fullscreen Lightbox Zoom */}
            <div className="hidden lg:block">
              <ImageZoom
                images={colorImages}
                alt={product.name}
                initialIndex={activeImage}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage + '-' + selectedColor}
                    initial={{ opacity: 0.6, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.4, scale: 0.97 }}
                    transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                    className="relative group/zoom"
                  >
                    <ParallaxProductImage
                      src={colorImages[activeImage]}
                      alt={product.name}
                      priority
                    />
                    <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="font-mono text-[9px] uppercase tracking-widest bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                        Click to Expand Lightbox ↗
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </ImageZoom>
            </div>

            {/* Desktop Thumbnail Strip */}
            {colorImages.length > 1 && (
              <div className="hidden lg:flex gap-2">
                {colorImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden focus-visible:outline-offset-2 transition-all duration-300 ${
                      activeImage === i
                        ? 'ring-2 ring-sienna ring-offset-2 ring-offset-[var(--ivory)] scale-105'
                        : 'border border-hairline opacity-60 hover:opacity-100 hover:border-ink/30'
                    }`}
                    aria-label={`View image ${i + 1} of ${colorImages.length}`}
                    aria-pressed={activeImage === i}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div variants={fadeUpVariants} className="space-y-7">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="atelier-eyebrow text-sienna"
              >
                {product.brand}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, type: 'spring', stiffness: 200, damping: 24 }}
                className="atelier-display text-3xl sm:text-4xl lg:text-[2.75rem] mt-2 leading-[1.1]"
              >
                {product.name}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="flex items-center gap-4 mt-3"
              >
                <div className="flex items-center gap-2">
                  <StarRating rating={product.avgRating} showValue />
                  <span className="text-ink-mute text-sm">({product.reviewCount} reviews)</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex items-center gap-4"
            >
              <span className="text-headline-md text-ink font-display tabular-nums">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <>
                  <span className="text-ink-mute line-through tabular-nums">{formatPrice(product.comparePrice)}</span>
                  <span className="bg-sienna text-ivory text-xs font-mono font-bold px-2.5 py-1 rounded-full tracking-wider">-{discount}%</span>
                </>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.5 }}
              className="text-ink-soft leading-relaxed"
            >
              {product.description}
            </motion.p>

            {/* Colorways */}
            {product.colorways.length > 0 && (
              <div>
                <h4 className="text-sm text-ink-mute mb-3">
                  Color: <span className="text-ink">{currentColor?.name}</span>
                </h4>
                <div className="flex gap-3">
                  {product.colorways.map((cw, i) => (
                    <MagneticColorSwatch
                      key={i}
                      cw={cw}
                      selected={selectedColor === i}
                      onSelect={() => {
                        setSelectedColor(i);
                        setActiveImage(0);
                        setSelectedSize(null);
                        setSizeError(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <h4 className="text-sm text-ink-mute mb-3">
                  Size: {selectedSize ? <span className="text-ink">{selectedSize}</span> : <span className={sizeError ? 'text-sienna' : 'text-ink'}>{sizeError ? 'Select a size' : 'Select'}</span>}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <MagneticSizeButton
                      key={size.label}
                      size={size}
                      selected={selectedSize === size.label}
                      outOfStock={size.stock === 0}
                      onSelect={() => { setSelectedSize(size.label); setSizeError(false); setQuantity(1); }}
                    />
                  ))}
                </div>
                {sizeError && (
                  <p className="mt-2 text-xs text-sienna flex items-center gap-1.5" role="alert">
                    <AlertCircle className="w-3.5 h-3.5" /> Please select a size
                  </p>
                )}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center atelier-seat">
                <MagneticQtyButton
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </MagneticQtyButton>
                <span className="px-4 text-sm text-ink" aria-live="polite">{quantity}</span>
                <MagneticQtyButton
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  disabled={quantity >= maxStock}
                  label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </MagneticQtyButton>
              </div>

              <button
                onClick={handleAddToCart}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                disabled={!inStock || (product.sizes.length > 0 && !selectedSize)}
                className="atelier-btn flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-offset-2"
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {!inStock ? 'Out of Stock' : product.sizes.length > 0 && !selectedSize ? 'Select a Size' : 'Add to Cart'}
              </button>

              <MagneticWishlistButton
                wishlisted={isWishlisted(product._id)}
                onToggle={() => toggleItem(product._id)}
              />
            </div>

            {/* Materials & Craftsmanship Accordion */}
            <div className="space-y-4 pt-4 border-t border-hairline">
              {product.materials.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-ink-mute mb-2">Textile Architecture</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((mat) => (
                      <span key={mat} className="px-3 py-1.5 border border-hairline text-xs font-mono text-ink bg-[var(--bone)]/40 rounded-sm">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3">
                <motion.div
                  whileHover={{ y: -2, boxShadow: '0 6px 20px -6px rgba(24,20,16,0.1)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="p-3.5 border border-hairline bg-[var(--bone)]/30 rounded-xl cursor-default"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-sienna mb-1">Global Shipping</span>
                  <span className="text-xs text-ink font-light">Complimentary courier on orders over $500</span>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2, boxShadow: '0 6px 20px -6px rgba(24,20,16,0.1)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="p-3.5 border border-hairline bg-[var(--bone)]/30 rounded-xl cursor-default"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-sienna mb-1">Authenticity</span>
                  <span className="text-xs text-ink font-light">Numbered Certificate of Provenance</span>
                </motion.div>
              </div>

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono text-ink-mute">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Sticky Mobile Add to Cart Bar */}
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[rgba(var(--ivory-rgb),0.88)] backdrop-blur-2xl border-t border-hairline/60 p-4 lg:hidden shadow-[0_-4px_24px_-8px_rgba(24,20,16,0.1)]"
        >
          <div className="container-void flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-ink font-display text-lg truncate tabular-nums">{formatPrice(product.price * quantity)}</p>
              <p className="text-[10px] text-ink-mute font-mono uppercase tracking-wider">
                {selectedSize ? `Size ${selectedSize}` : product.sizes.length > 0 ? 'Select a size' : 'One size'}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!inStock || (product.sizes.length > 0 && !selectedSize)}
              className="atelier-btn !min-h-0 !py-3 !px-6 text-xs disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
            >
              {!inStock ? 'Out of Stock' : product.sizes.length > 0 && !selectedSize ? 'Select Size' : 'Add to Cart'}
            </button>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <div className="mt-24 pt-16 border-t border-hairline relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Reviews Summary & Rating Distribution */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <p className="atelier-eyebrow text-sienna mb-2">Verified Impressions</p>
                <h2 className="atelier-display text-3xl md:text-4xl">Client Reviews</h2>
              </div>
              <div className="flex items-center gap-4 p-6 atelier-card rounded-2xl">
                <div className="text-5xl text-ink font-display font-bold">
                  {product.avgRating ? product.avgRating.toFixed(1) : '5.0'}
                </div>
                <div className="space-y-1">
                  <StarRating rating={product.avgRating || 5} size="md" />
                  <p className="text-xs text-ink-mute">Based on {product.reviewCount || 1} client appraisal{product.reviewCount !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Rating Distribution Breakdown */}
              <div className="space-y-2 text-xs font-mono text-ink-mute pt-2">
                <div className="flex items-center gap-3">
                  <span className="w-8">5 ★</span>
                  <div className="flex-1 h-1.5 bg-[var(--bone)] rounded-full overflow-hidden">
                    <div className="h-full bg-sienna w-[88%]" />
                  </div>
                  <span className="w-8 text-right">88%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8">4 ★</span>
                  <div className="flex-1 h-1.5 bg-[var(--bone)] rounded-full overflow-hidden">
                    <div className="h-full bg-sienna w-[12%]" />
                  </div>
                  <span className="w-8 text-right">12%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8">3 ★</span>
                  <div className="flex-1 h-1.5 bg-[var(--bone)] rounded-full overflow-hidden">
                    <div className="h-full bg-sienna w-0" />
                  </div>
                  <span className="w-8 text-right">0%</span>
                </div>
              </div>
            </div>

            {/* Reviews List & Submission Form */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                {!reviews?.length ? (
                  <div className="p-8 text-center atelier-card rounded-2xl">
                    <p className="text-ink font-display text-lg mb-1">First Appraisal Pending</p>
                    <p className="text-ink-mute text-sm">Be the first collector to review this piece.</p>
                  </div>
                ) : (
                  reviews.map((rev: any) => (
                    <motion.div
                      key={rev._id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="p-6 atelier-card rounded-2xl space-y-3 font-sans"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--bone)] border border-hairline flex items-center justify-center text-xs font-semibold text-sienna font-mono">
                            {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-ink font-semibold">{rev.user?.name || 'Verified Collector'}</p>
                              {rev.verified && (
                                <span className="text-[10px] font-mono uppercase tracking-widest text-sienna bg-sienna/10 px-2 py-0.5 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-ink-mute font-mono">{formatDate(rev.createdAt)}</span>
                          </div>
                        </div>
                        <StarRating rating={rev.rating} />
                      </div>
                      <div>
                        <h4 className="text-sm text-ink font-semibold">{rev.title}</h4>
                        <p className="text-sm text-ink-soft mt-1 leading-relaxed font-light">{rev.body}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              {user ? (
                <form onSubmit={handleReviewSubmit} className="atelier-card p-6 md:p-8 rounded-2xl space-y-5 font-sans">
                  <div className="border-b border-hairline pb-3">
                    <h3 className="text-ink text-lg font-bold font-display">Submit an Appraisal</h3>
                    <p className="text-xs text-ink-mute mt-1">Share your thoughts on the silhouette, drape, and textile quality.</p>
                  </div>

                  {/* Star rating selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-ink-mute block">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        return (
                          <motion.button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            whileTap={{ scale: 0.85 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                            className="focus-visible:outline-offset-2 p-1 rounded-lg hover:bg-[var(--bone)]/50 transition-colors"
                            aria-label={`Rate ${starVal} out of 5 stars`}
                          >
                            <Star className={`w-6 h-6 ${starVal <= rating ? 'text-sienna fill-[var(--sienna)]' : 'text-ink-mute/30'}`} />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-ink-mute block">Summary Title</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Exceptional drape and timeless silhouette"
                      required
                      className="w-full px-4 py-3 bg-[var(--bone)]/30 border border-hairline text-ink text-sm rounded-xl outline-none focus:border-sienna transition-colors placeholder-ink-mute/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-ink-mute block">Detailed Experience</label>
                    <textarea
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Describe the fit, hand-feel, movement, and finish..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-[var(--bone)]/30 border border-hairline text-ink text-sm rounded-xl outline-none focus:border-sienna transition-colors resize-none placeholder-ink-mute/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitReviewMutation.isPending}
                    className="btn-island-primary"
                  >
                    <span>{submitReviewMutation.isPending ? 'Submitting...' : 'Post Client Review'}</span>
                  </button>
                </form>
              ) : (
                <div className="atelier-card p-6 rounded-2xl text-center font-sans">
                  <p className="text-ink-mute text-sm">
                    Please{' '}
                    <Link to="/auth/login" className="text-sienna hover:underline font-semibold">
                      Sign In
                    </Link>{' '}
                    to submit a client appraisal.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}

