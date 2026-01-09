'use client';

import React from 'react';
import { Sparkles, Droplet, Sun, Wind, AlertCircle } from 'lucide-react';

export default function RugsCareGuide() {
  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">
          Rugs Care Guide
        </h1>
        <p className="text-center text-text-muted mb-12">
          Keep your handcrafted rugs beautiful for generations
        </p>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-terracotta" />
            Regular Maintenance
          </h2>
          <ul className="space-y-4 text-text-muted">
            <li className="flex gap-3">
              <span className="text-terracotta font-bold">•</span>
              <span>
                <strong className="text-text-body">Vacuum Weekly:</strong> Use a
                vacuum without a beater bar to remove dust and dirt. Vacuum in
                the direction of the pile.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-terracotta font-bold">•</span>
              <span>
                <strong className="text-text-body">Rotate Regularly:</strong>{' '}
                Rotate your rug every 3-6 months to ensure even wear and fading.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-terracotta font-bold">•</span>
              <span>
                <strong className="text-text-body">Use Rug Pads:</strong>{' '}
                Prevent slipping and extend the life of your rug with a quality
                rug pad.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-terracotta font-bold">•</span>
              <span>
                <strong className="text-text-body">Shake It Out:</strong> Take
                smaller rugs outside and shake them to remove embedded dirt.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
            <Droplet className="w-8 h-8 text-terracotta" />
            Stain Removal
          </h2>
          <div className="space-y-4 text-text-muted">
            <p>
              <strong className="text-text-body">Act Quickly:</strong> Blot
              spills immediately with a clean, white cloth. Never rub, as this
              can spread the stain.
            </p>
            <p>
              <strong className="text-text-body">Mild Solution:</strong> Use a
              mixture of mild dish soap and water for most stains. Test on an
              inconspicuous area first.
            </p>
            <p>
              <strong className="text-text-body">Professional Cleaning:</strong>{' '}
              For stubborn stains or valuable rugs, consult a professional rug
              cleaning service.
            </p>
            <p>
              <strong className="text-text-body">Avoid Harsh Chemicals:</strong>{' '}
              Never use bleach, strong detergents, or steam cleaners on
              handcrafted rugs.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <Sun className="w-12 h-12 text-terracotta mb-4" />
            <h2 className="font-serif text-2xl mb-4">Sunlight Protection</h2>
            <p className="text-text-muted">
              Prolonged exposure to direct sunlight can fade natural dyes. Use
              curtains or blinds to protect your rug, especially during peak
              sunlight hours. Rotating your rug regularly also helps prevent
              uneven fading.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <Wind className="w-12 h-12 text-terracotta mb-4" />
            <h2 className="font-serif text-2xl mb-4">Storage Tips</h2>
            <p className="text-text-muted">
              If storing your rug, roll it (never fold) with the pile facing
              inward. Wrap in breathable fabric like cotton sheets. Store in a
              cool, dry place away from moisture and pests. Add mothballs or
              cedar blocks for protection.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
          <h3 className="font-serif text-xl mb-3 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            Important Notes
          </h3>
          <ul className="space-y-2 text-text-muted text-sm">
            <li>
              • Hand-knotted rugs may shed initially - this is normal and will
              decrease over time
            </li>
            <li>
              • Natural fibers like wool and silk require gentle care and
              professional cleaning
            </li>
            <li>
              • Avoid placing heavy furniture on rugs for extended periods to
              prevent crushing
            </li>
            <li>
              • For antique or valuable rugs, always consult a professional for
              cleaning and repairs
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
