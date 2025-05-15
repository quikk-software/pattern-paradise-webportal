'use client';

import { Badge } from '@/components/ui/badge';
import { CldImage } from 'next-cloudinary';
import { QRCodeSVG } from 'qrcode.react';
import type { GetProductResponse, GetTestingResponse } from '@/@types/api-types';
import classNames from 'classnames';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';

interface SocialShareCardProps {
  product: GetProductResponse;
  testing: GetTestingResponse;
  theme: string;
  baseUrl: string;
  isDownloadVersion?: boolean;
}

export function SocialShareCard({
  product,
  testing,
  theme,
  baseUrl,
  isDownloadVersion = false,
}: SocialShareCardProps) {
  const fontSize = isDownloadVersion ? '16px' : 'calc(8px + 0.5vw)';
  const containerStyle = isDownloadVersion
    ? { width: '1080px', height: '1920px', fontSize }
    : { fontSize };

  const padding = isDownloadVersion ? '40px' : '5%';
  const fontSizeHeading = isDownloadVersion ? '48px' : '1.5em';
  const fontSizeText = isDownloadVersion ? '36px' : '1.2em';
  const fontSizeLabel = isDownloadVersion ? '28px' : '0.9em';
  const fontSizeParagraph = isDownloadVersion ? '30px' : '1.1em';
  const imageHeight = isDownloadVersion ? '672px' : '35%';

  const formatExperience = (exp: string) =>
    exp.charAt(0).toUpperCase() + exp.slice(1).toLowerCase();

  const shareUrl = `${baseUrl}/app/tester-calls/${product.id}`;

  const themeClasses: Record<string, string> = {
    slate: 'bg-slate-600',
    gray: 'bg-gray-600',
    zinc: 'bg-zinc-600',
    neutral: 'bg-neutral-600',
    stone: 'bg-stone-600',
    red: 'bg-red-600',
    orange: 'bg-orange-600',
    amber: 'bg-amber-600',
    yellow: 'bg-yellow-600',
    lime: 'bg-lime-600',
    green: 'bg-green-600',
    emerald: 'bg-emerald-600',
    teal: 'bg-teal-600',
    cyan: 'bg-cyan-600',
    sky: 'bg-sky-600',
    blue: 'bg-blue-600',
    indigo: 'bg-indigo-600',
    violet: 'bg-violet-600',
    purple: 'bg-purple-600',
    fuchsia: 'bg-fuchsia-600',
    pink: 'bg-pink-600',
    rose: 'bg-rose-600',
  };

  const themeTextClasses: Record<string, string> = {
    slate: 'text-slate-600',
    gray: 'text-gray-600',
    zinc: 'text-zinc-600',
    neutral: 'text-neutral-600',
    stone: 'text-stone-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    amber: 'text-amber-600',
    yellow: 'text-yellow-600',
    lime: 'text-lime-600',
    green: 'text-green-600',
    emerald: 'text-emerald-600',
    teal: 'text-teal-600',
    cyan: 'text-cyan-600',
    sky: 'text-sky-600',
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    violet: 'text-violet-600',
    purple: 'text-purple-600',
    fuchsia: 'text-fuchsia-600',
    pink: 'text-pink-600',
    rose: 'text-rose-600',
  };

  const themeBorderClasses: Record<string, string> = {
    slate: 'border-slate-600',
    gray: 'border-gray-600',
    zinc: 'border-zinc-600',
    neutral: 'border-neutral-600',
    stone: 'border-stone-600',
    red: 'border-red-600',
    orange: 'border-orange-600',
    amber: 'border-amber-600',
    yellow: 'border-yellow-600',
    lime: 'border-lime-600',
    green: 'border-green-600',
    emerald: 'border-emerald-600',
    teal: 'border-teal-600',
    cyan: 'border-cyan-600',
    sky: 'border-sky-600',
    blue: 'border-blue-600',
    indigo: 'border-indigo-600',
    violet: 'border-violet-600',
    purple: 'border-purple-600',
    fuchsia: 'border-fuchsia-600',
    pink: 'border-pink-600',
    rose: 'border-rose-600',
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full mx-auto" style={containerStyle}>
        <div className="relative w-full pb-[177.78%] bg-white">
          <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden border border-gray-200 rounded-lg shadow-md"
            style={{
              fontSize,
              transformOrigin: 'top left',
            }}
          >
            {/* Top Banner */}
            <div
              className={classNames(
                'flex items-center justify-between',
                themeClasses[theme] || 'bg-neutral-600',
              )}
              style={{
                height: isDownloadVersion ? '96px' : '5%',
                paddingLeft: padding,
                paddingRight: padding,
              }}
            >
              <div
                className={`text-white font-bold flex items-center ${isDownloadVersion ? 'gap-4' : ' gap-2'}`}
                style={{ fontSize: fontSizeHeading }}
              >
                <PatternParadiseIcon className={isDownloadVersion ? 'w-12 h-12' : 'w-4 h-4'} />
                Pattern Paradise
              </div>
              <div className="text-white font-medium" style={{ fontSize: fontSizeText }}>
                Tester Call
              </div>
            </div>

            {/* Main Content */}
            <div
              className="flex flex-col"
              style={{
                height: isDownloadVersion ? '1824px' : '95%',
                padding: padding,
              }}
            >
              {/* Featured Image */}
              <div className="relative mb-[5%] flex-shrink-0" style={{ height: imageHeight }}>
                {product.imageUrls.length > 0 && (
                  <div className="rounded-xl overflow-hidden border-4 border-white shadow-lg h-full">
                    <CldImage
                      src={product.imageUrls[0]}
                      alt={`${product.title} pattern`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                      format="webp"
                    />
                  </div>
                )}

                {/* Overlay with pattern title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-[4%] rounded-b-xl">
                  <h1 className="text-white font-bold" style={{ fontSize: fontSizeHeading }}>
                    {product.title}
                  </h1>
                  <p className="text-white" style={{ fontSize: fontSizeText }}>
                    by @{testing.creator.username}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div
                className="bg-gray-50 rounded-xl border border-gray-100 mb-[5%]"
                style={{ padding: padding, height: isDownloadVersion ? '384px' : '20%' }}
              >
                <div className="grid grid-cols-2 gap-[4%] h-full">
                  <div className="flex flex-col justify-center">
                    <span className="text-gray-500" style={{ fontSize: fontSizeLabel }}>
                      Category
                    </span>
                    <span className="font-bold" style={{ fontSize: fontSizeText }}>
                      {product.category}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-gray-500" style={{ fontSize: fontSizeLabel }}>
                      Skill Level
                    </span>
                    <span className="font-bold" style={{ fontSize: fontSizeText }}>
                      {formatExperience(testing.product.experience)}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-gray-500" style={{ fontSize: fontSizeLabel }}>
                      Duration
                    </span>
                    <span className="font-bold" style={{ fontSize: fontSizeText }}>
                      {testing.durationInWeeks} weeks
                    </span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-gray-500" style={{ fontSize: fontSizeLabel }}>
                      Status
                    </span>
                    <Badge
                      className={classNames(
                        'w-fit mt-1 px-2 py-1',
                        themeClasses[theme] || 'bg-neutral-600',
                      )}
                      style={{
                        fontSize: fontSizeLabel,
                        paddingLeft: isDownloadVersion ? '32px' : undefined,
                        paddingRight: isDownloadVersion ? '32px' : undefined,
                        paddingTop: isDownloadVersion ? '16px' : undefined,
                        paddingBottom: isDownloadVersion ? '16px' : undefined,
                      }}
                    >
                      Open for Applications
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div
                className="mb-auto overflow-hidden"
                style={{ height: isDownloadVersion ? '384px' : '20%' }}
              >
                <h2
                  className={classNames('font-bold mb-[2%]', themeTextClasses[theme])}
                  style={{ fontSize: fontSizeHeading }}
                >
                  About this Pattern
                </h2>
                <p className="text-gray-700 leading-tight" style={{ fontSize: fontSizeParagraph }}>
                  {product.description.length > 150
                    ? `${product.description.substring(0, 150)}...`
                    : product.description}
                </p>
              </div>

              {/* Call to Action */}
              <div
                className="flex items-center justify-between mt-[5%] mb-[5%]"
                style={{ height: isDownloadVersion ? '288px' : '15%' }}
              >
                <div>
                  <h2
                    className={classNames('font-bold mb-[2%]', themeTextClasses[theme])}
                    style={{ fontSize: fontSizeHeading }}
                  >
                    Become a Tester!
                  </h2>
                  <p className="text-gray-700" style={{ fontSize: fontSizeLabel }}>
                    Scan the QR code:
                  </p>
                </div>

                <div
                  className={classNames(
                    'rounded-lg border-2',
                    themeBorderClasses[theme] || 'border-neutral-600',
                  )}
                  style={{
                    padding: isDownloadVersion ? '24px' : '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isDownloadVersion ? '360px' : 'auto',
                    height: isDownloadVersion ? '360px' : 'auto',
                  }}
                >
                  <QRCodeSVG
                    value={shareUrl}
                    size={isDownloadVersion ? 360 : 60}
                    fgColor={
                      theme
                        ? themeTextClasses[theme].replace('text-', '').replace('-600', '')
                        : '#525252'
                    }
                    level="H"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
