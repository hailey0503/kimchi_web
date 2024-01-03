import { ImageResponse } from '@vercel/og';
 
export const config = {
  runtime: 'edge',
};
 
export default async function handler() {
  const imageData = await fetch(new URL('./kimchi_rec.png', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );
 
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#f6f6f6',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img width="1024" height="1024" src={imageData} />
      </div>
    ),
    {
      width: 1024,
      height: 1024,
    },
  );
}