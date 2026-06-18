"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";

interface SmoothScrollHeroProps {
  /**
   * Height of the scroll section in pixels
   * @default 1500
   */
  scrollHeight?: number;
  /**
   * Background image URL for desktop view
   */
  desktopImage?: string;
  /**
   * Background image URL for mobile view
   */
  mobileImage?: string;
  /**
   * Initial clip path percentage
   * @default 25
   */
  initialClipPercentage?: number;
  /**
   * Final clip path percentage
   * @default 75
   */
  finalClipPercentage?: number;
  /**
   * Alt text for the background image. Empty string marks it decorative.
   * @default ""
   */
  imageAlt?: string;
  /**
   * Optional overlay content rendered above the (clipped) background in a
   * sticky, full-height, centered layer. Not affected by the clip-path.
   */
  children?: React.ReactNode;
}

const DEFAULT_DESKTOP_IMAGE =
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6";
const DEFAULT_MOBILE_IMAGE =
  "https://images.unsplash.com/photo-1511207538754-e8555f2bc187?q=80&w=2412&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

type SmoothScrollHeroBackgroundProps = Required<
  Omit<SmoothScrollHeroProps, "children">
>;

const SmoothScrollHeroBackground: React.FC<SmoothScrollHeroBackgroundProps> = ({
  scrollHeight,
  desktopImage,
  mobileImage,
  initialClipPercentage,
  finalClipPercentage,
  imageAlt,
}) => {
  const { scrollY } = useScroll();

  const clipStart = useTransform(
    scrollY,
    [0, scrollHeight],
    [initialClipPercentage, 0],
  );
  const clipEnd = useTransform(
    scrollY,
    [0, scrollHeight],
    [finalClipPercentage, 100],
  );

  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

  // Параллакс-зум через transform: scale (дёшево для GPU), а не background-size.
  const imageScale = useTransform(scrollY, [0, scrollHeight + 500], [1.7, 1]);

  // Один и тот же файл для моб/десктоп — рендерим одно изображение, чтобы не
  // грузить два; разные — арт-дирекшн через md-брейкпоинт.
  const sameImage = mobileImage === desktopImage;

  return (
    <motion.div
      className="sticky top-0 h-screen w-full overflow-hidden bg-black"
      style={{
        clipPath,
        willChange: "transform, opacity",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, willChange: "transform" }}
      >
        {sameImage ? (
          <Image
            src={desktopImage}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <>
            <Image
              src={mobileImage}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center md:hidden"
            />
            <Image
              src={desktopImage}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="hidden object-cover object-center md:block"
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

/**
 * A smooth scroll hero component with parallax background effect.
 * @param props - Component props
 * @returns React component
 */
const SmoothScrollHero: React.FC<SmoothScrollHeroProps> = ({
  scrollHeight = 1500,
  desktopImage = DEFAULT_DESKTOP_IMAGE,
  mobileImage = DEFAULT_MOBILE_IMAGE,
  initialClipPercentage = 25,
  finalClipPercentage = 75,
  imageAlt = "",
  children,
}) => {
  return (
    <div
      style={{ height: `calc(${scrollHeight}px + 100vh)` }}
      className="relative w-full"
    >
      <SmoothScrollHeroBackground
        scrollHeight={scrollHeight}
        desktopImage={desktopImage}
        mobileImage={mobileImage}
        initialClipPercentage={initialClipPercentage}
        finalClipPercentage={finalClipPercentage}
        imageAlt={imageAlt}
      />
      {children ? (
        <div className="pointer-events-none sticky top-0 -mt-[100vh] h-screen">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default SmoothScrollHero;
