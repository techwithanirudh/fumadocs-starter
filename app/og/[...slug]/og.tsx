import { ImageResponse } from 'next/og';
import type { ReactElement, ReactNode } from 'react';
import type { ImageResponseOptions } from 'next/dist/compiled/@vercel/og/types';
import { title } from '@/app/layout.config';
import { baseUrl } from '@/lib/metadata';
import Logo from "@/public/logo.svg";

interface GenerateProps {
  title: ReactNode;
  tag: string;
  description?: ReactNode;
  primaryTextColor?: string;
}

export function generateOGImage(
  options: GenerateProps & ImageResponseOptions,
): ImageResponse {
  const { title, tag, description, primaryTextColor, ...rest } = options;

  return new ImageResponse(
    generate({
      title,
      tag,
      description,
      primaryTextColor,
    }),
    {
      width: 1200,
      height: 630,
      ...rest,
    },
  );
}

export function generate({
  primaryTextColor = 'rgb(255,150,255)',
  ...props
}: GenerateProps): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        backgroundImage: `url(${baseUrl}/background.png)`
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '4rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            marginBottom: 'auto',
            color: primaryTextColor,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
            <g fill="white">
              <path d="M225.12 119.71c-7.86 30.94-29.31 32.71-37.36 32.23h-1A36 36 0 1 1 128 180a36 36 0 1 1-58.72-28.06h-1c-8 .48-29.5-1.29-37.36-32.23C22.79 87.84 15.78 48 47.07 48S128 95.8 128 127.67C128 95.8 177.64 48 208.93 48s24.28 39.84 16.19 71.71" opacity=".2"></path>
              <path d="M232.7 50.48C229 45.7 221.84 40 209 40c-16.85 0-38.46 11.28-57.81 30.16A140 140 0 0 0 136 87.53V56a8 8 0 0 0-16 0v31.53a140 140 0 0 0-15.15-17.37C85.49 51.28 63.88 40 47 40c-12.84 0-20 5.7-23.7 10.48c-6.82 8.77-12.18 24.08-.21 71.2c6.05 23.83 19.51 33 30.63 36.42A44 44 0 0 0 128 205.27a44 44 0 0 0 74.28-47.17c11.12-3.4 24.57-12.59 30.63-36.42c6.72-26.44 11.94-55.58-.21-71.2M92 208a28.12 28.12 0 0 1-3.14-56a8 8 0 1 0-1.76-15.9a43.64 43.64 0 0 0-20.74 7.9c-8.43.09-22-3.57-27.76-26.26c-2.88-11.35-11.6-45.88-2.66-57.44C37.37 58.46 40.09 56 47 56c27.27 0 73 44.88 73 71.67V180a28 28 0 0 1-28 28m125.4-90.26c-5.77 22.69-19.33 26.34-27.77 26.26a43.6 43.6 0 0 0-20.74-7.95a8 8 0 1 0-1.76 15.9A28.11 28.11 0 1 1 136 180v-52.33C136 100.88 181.69 56 209 56c6.95 0 9.66 2.46 11.1 4.3c8.95 11.56.18 46.09-2.7 57.44"></path>
            </g>
          </svg>
          <p
            style={{
              fontSize: '54px',
              fontWeight: 600,
            }}
          >
            {title}
          </p>
        </div>
        <p
          style={{
            fontWeight: 600,
            fontSize: '26px'
          }}
        >
          {/* {props.tag.replace(/-/g, ' ')} */}
          @anirudh
        </p>
        <p
          style={{
            fontWeight: 600,
            fontSize: '56px',
          }}
        >
          {props.title}
        </p>
        <p
          style={{
            fontSize: '28px',
            color: 'rgba(240,240,240,0.7)',
          }}
        >
          {props.description}
        </p>
      </div>
    </div>
  );
}