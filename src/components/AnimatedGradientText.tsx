import React from 'react';
import { ChevronRight } from 'lucide-react';

interface AnimatedGradientTextProps {
  children?: React.ReactNode;
}

export const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({ children }) => {
  return (
    <span className="text-sm font-medium bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:300%_100%] bg-clip-text text-transparent animate-gradient">
      {children}
    </span>
  );
};

export const AnimatedGradientBadge: React.FC = () => {
  return (
    <div className="group relative inline-flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
      <span
        className="animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
        style={{
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'subtract',
        }}
      />
      <span className="text-lg">✨</span>
      <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
      <AnimatedGradientText>
        Free Fire Likes Booster
      </AnimatedGradientText>
      <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </div>
  );
};

export default AnimatedGradientText;
