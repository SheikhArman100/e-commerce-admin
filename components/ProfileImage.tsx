

"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toAbsoluteUrl } from '@/lib/helpers'
import Image from 'next/image'

type ImageProps = {
  image: {
    diskType?: string
    path: string
    originalName: string
    modifiedName?: string
  } | string | null | undefined
  className?: string
  height?: number
  width?: number
}

const ProfileImage: React.FC<ImageProps> = ({
  image,
  className
}) => {
  
  // Handle different image formats
  const getImageSrc = () => {
    if (!image) return null;

    if (typeof image === 'string') {
      // If image is a string, treat it as a direct URL
      return image;
    }

    if (typeof image === 'object' && image.path) {
      // If image is an object with path, construct the full URL
      return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image.path}`;
    }

    return null;
  };

  const imageSrc = getImageSrc();
  
  const altText = typeof image === 'object' && image?.originalName ? image.originalName : 'Profile image';

  return (
    <>
      {imageSrc && (
        <AvatarImage
          src={imageSrc}
          alt={altText}
          className={`${className} w-full h-full object-fit rounded-full`}
        />
      )}
      <AvatarFallback>
        <Image
          src={toAbsoluteUrl('/media/avatar.png')}
          alt="Default avatar"
          className="w-full h-full object-cover rounded-full"
          height={100}
          width={100}
        />
      </AvatarFallback>
    </>
  )
}


export default ProfileImage
