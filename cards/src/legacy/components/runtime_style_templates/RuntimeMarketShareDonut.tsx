import {RuntimeEntityLabel} from './runtimeEntityVisuals';
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {EditableTransform} from '../scenes/EditableTransform';
import {
  firstString,
  runtimeAnimationContract,
  runtimeContractMatches,
  runtimeContractOpacity,
  runtimePoints,
  slotTitle,
  trimNumber,
  truncate,
  uiLabel,
  paletteFor,
  type RuntimeStyleTemplateProps,
} from './runtimeSlots';
import {useNarrationSyncedFrame} from './narrationTiming';

const clampFrame = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing = Easing.out(Easing.cubic),
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const MarketShareDonutDemo: React.FC<RuntimeStyleTemplateProps> = ({sceneContent, scene}) => {
  const frame = useNarrationSyncedFrame(sceneContent, scene);
  const rawFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const safeFps = fps ?? 30;
  const animation = runtimeAnimationContract('pie', scene, rawFrame, safeFps);
  const runtimeRows = runtimePoints(sceneContent, scene)
    .filter((row) => row.value > 0)
    .slice(0, 5);
  const palette = paletteFor(sceneContent, false);
  const slices = runtimeRows.map((row, index) => ({
    label: row.label,
    value: row.value,
    color: firstString(row.color, palette[index % palette.length], '#2f63ff'),
  }));
  const title = slotTitle(sceneContent);
  if (slices.length < 2 || !title) return null;
  const total = slices.reduce((sum, item) => sum + item.value, 0) || 1;
  const largest = slices.reduce((max, item) => (item.value > max.value ? item : max), slices[0]);
  const activeSlice = slices.find((item) => runtimeContractMatches(animation, item.label)) || largest;
  const cardEntrance = spring({
    frame,
    fps: safeFps,
    config: {damping: 200, stiffness: 120},
    durationInFrames: 30,
  });
  const numberEntrance = spring({
    frame: frame - 28,
    fps: safeFps,
    config: {damping: 180, stiffness: 140},
    durationInFrames: 34,
  });

  const radius = 124;
  const stroke = 38;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <AbsoluteFill
      style={{
        background: '#f4f2fb',
        fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        color: '#26252a',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 24% 20%, rgba(255,255,255,0.9), transparent 31%), radial-gradient(circle at 80% 18%, rgba(226,222,241,0.8), transparent 24%)',
        }}
      />
      <EditableTransform id="market-share-shell" role="group" style={{display: 'block'}}>
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 122,
            width: 980,
            height: 418,
            borderRadius: 24,
            background: 'rgba(255,255,255,0.96)',
            boxShadow: '0 30px 70px rgba(58,54,86,0.14), 0 1px 0 rgba(255,255,255,0.8) inset',
            transform: `translateY(${(1 - cardEntrance) * 18}px) scale(${0.985 + cardEntrance * 0.015})`,
            opacity: clampFrame(frame, [0, 18], [0, 1]),
          }}
        >
          <EditableTransform id="market-share-title" role="title" style={{display: 'block'}}>
            <div
              data-dm-text-editable
              style={{
                position: 'absolute',
                left: 168,
                top: 139,
                width: 450,
                fontSize: 36,
                lineHeight: 1,
                fontWeight: 780,
                letterSpacing: 0,
                color: '#303036',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {truncate(title, 60)}
            </div>
          </EditableTransform>

          <EditableTransform id="market-share-legend" role="group" style={{display: 'block'}}>
            <div
              style={{
                position: 'absolute',
                left: 168,
                top: 210,
                width: 270,
                display: 'flex',
                flexDirection: 'column',
                gap: 19,
              }}
            >
              {slices.slice(0, 4).map((item, index) => {
                const itemProgress = clampFrame(frame, [18 + index * 5, 36 + index * 5], [0, 1]);
                const share = (item.value / total) * 100;
                const isActive = runtimeContractMatches(animation, item.label);
                return (
                  <div
                    key={item.label}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '16px 44px 1fr',
                      alignItems: 'center',
                      columnGap: 12,
                      opacity: itemProgress * runtimeContractOpacity(animation, isActive),
                      transform: `translateX(${(1 - itemProgress) * -14}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: item.color,
                        boxShadow: `0 0 0 ${isActive ? 7 : 4}px ${item.color}${isActive ? '33' : '1f'}`,
                      }}
                    />
                    <div
                      data-dm-text-editable
                      style={{
                        fontSize: 19,
                        fontWeight: 760,
                        color: '#34333a',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {trimNumber(share, 1)}%
                    </div>
                    <div
                      data-dm-text-editable
                      style={{
                        fontSize: 14,
                        fontWeight: 560,
                        color: '#77727f',
                      }}
                    >
                      <RuntimeEntityLabel sceneContent={sceneContent} label={item.label}>{truncate(item.label, 20)}</RuntimeEntityLabel>
                    </div>
                  </div>
                );
              })}
            </div>
          </EditableTransform>

          <svg
            width={360}
            height={360}
            viewBox="0 0 360 360"
            style={{
              position: 'absolute',
              right: 104,
              top: 50,
              overflow: 'visible',
            }}
          >
            <circle
              cx={180}
              cy={180}
              r={radius}
              fill="none"
              stroke="#eef0f8"
              strokeWidth={stroke}
            />
            {slices.map((item, index) => {
              const portion = item.value / total;
              const dash = portion * circumference;
              const gap = 18;
              const segmentProgress = clampFrame(frame, [14 + index * 8, 48 + index * 8], [0, 1]);
              const strokeDasharray = `${Math.max(0, dash - gap) * segmentProgress} ${circumference}`;
              const strokeDashoffset = -offset * circumference;
                const isActive = runtimeContractMatches(animation, item.label);
              offset += portion;
              return (
                <circle
                  key={item.label}
                  cx={180}
                  cy={180}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={isActive ? stroke + animation.strokeWidth : stroke}
                  opacity={runtimeContractOpacity(animation, isActive)}
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 180 180)"
                  style={{
                    filter: isActive ? animation.glow : 'drop-shadow(0 10px 16px rgba(39, 33, 70, 0.12))',
                  }}
                />
              );
            })}
          </svg>

          <EditableTransform id="market-share-center-number" role="metric" style={{display: 'block'}}>
            <div
              style={{
                position: 'absolute',
                right: 228,
                top: 167,
                width: 160,
                height: 116,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${0.82 + numberEntrance * 0.18})`,
                opacity: clampFrame(frame, [26, 44], [0, 1]),
              }}
            >
              <div
                data-dm-text-editable
                style={{
                  fontSize: 54,
                  lineHeight: 0.9,
                  fontWeight: 790,
                  letterSpacing: '-0.045em',
                  color: '#343238',
                }}
              >
                {trimNumber((activeSlice.value / total) * 100, 1)}%
              </div>
              <div
                data-dm-text-editable
                style={{
                  marginTop: 9,
                  width: 70,
                  fontSize: 10,
                  lineHeight: 1.15,
                  fontWeight: 680,
                  color: '#8c8794',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                {truncate(activeSlice.label, 28)} {activeSlice === largest ? uiLabel(sceneContent, 'leads_the_mix', 'leads the mix') : uiLabel(sceneContent, 'in_focus', 'in focus')}
              </div>
            </div>
          </EditableTransform>
        </div>
      </EditableTransform>
    </AbsoluteFill>
  );
};
