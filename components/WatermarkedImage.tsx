"use client";

interface Props {
  publicId: string;
}

export default function WatermarkedImage({ publicId }: Props) {
  const url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_60,w_800,e_blur:50,o_90,l_watermark:logo,g_center/${publicId}.jpg`;

  return (
    <img
      src={url}
      alt="Preview"
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      className="select-none pointer-events-none rounded"
    />
  );
}
