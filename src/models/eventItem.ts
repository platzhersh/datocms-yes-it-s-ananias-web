export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueUrl: string;
  eventUrl: string;
  eventUrlText: string;
  description: any;
  flyer: {
    responsiveImage: {
      alt: string,
          aspectRatio: number,
          base64: string,
          bgColor: string,
          height: number,
          sizes: any,
          src: string,
          srcSet: any,
          webpSrcSet: any,
          width: number,
          title: string
    };
  };
}
