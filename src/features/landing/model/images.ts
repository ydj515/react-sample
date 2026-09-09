function responsiveImage(name: string) {
  return {
    src: `/landing-images/${name}-landscape-960.webp`,
    srcSet: [480, 960, 1536]
      .map(
        (width) => `/landing-images/${name}-landscape-${width}.webp ${width}w`,
      )
      .join(", "),
    width: 1536,
    height: 1024,
  };
}

export const landingImages = {
  retreat: responsiveImage("forest-retreat"),
  room: responsiveImage("forest-suite"),
  product: responsiveImage("forma-headphones"),
};
